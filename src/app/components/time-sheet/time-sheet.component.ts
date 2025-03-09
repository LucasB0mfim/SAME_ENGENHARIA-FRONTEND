import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TimeSheetService } from '../../services/time-sheet.service';
import { ThemeService } from '../../services/theme.service';
import { ITimeSheetResponse, ITimeSheetRecord } from '../../interfaces/time-sheet.interface';
import { IEmployeesRecord, IEmployeesResponse } from '../../interfaces/employees-response.interface';
import { FindEmployeesService } from '../../services/find-employees.service';
import { TimesheetModalComponent } from '../timesheet-modal/timesheet-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit, OnDestroy {
  private readonly _findEmployees = inject(FindEmployeesService);
  private readonly _themeService = inject(ThemeService);
  private readonly _dialog = inject(MatDialog);
  private themeSubscription: Subscription | null = null;

  isDarkTheme: boolean = false;
  avatarIconDark: string = 'assets/images/avatarIconDark.png';
  avatarIconLight: string = 'assets/images/avatarIconLight.png';
  defaultAvatar: string = '';

  timeSheets: ITimeSheetRecord[] = [];
  employees: IEmployeesRecord[] = [];
  filteredEmployees: IEmployeesRecord[] = [];
  employeeNameFilter: string = '';

  isEmployeesActive: boolean = false;

  ngOnInit(): void {
    // Inicializa o tema de acordo com o localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.updateDefaultAvatar();

    // Se inscreve para mudanças de tema
    this.themeSubscription = this._themeService.getThemeState().subscribe(isDark => {
      this.isDarkTheme = isDark;
      this.updateDefaultAvatar();
      this.updateEmployeeAvatars();
    });
  }

  toggleEmployees() {
    this.isEmployeesActive = !this.isEmployeesActive;
    if (this.isEmployeesActive) {
      this.findEmployees();
    } else {
      this.employees = []; // Clear employees when deactivated
      this.filteredEmployees = []; // Clear filtered employees also
    }
  }

  ngOnDestroy(): void {
    // Limpar a inscrição ao destruir o componente
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
      this.themeSubscription = null;
    }
  }

  findEmployees(): void {
    this._findEmployees.findEmployees().subscribe({
      next: (response: IEmployeesResponse) => {
        this.employees = response.employees.map(employee => ({
          ...employee, avatar: employee.avatar || this.defaultAvatar
        }));
        this.filterEmployees(); // Aplica o filtro atual
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  filterEmployees(): void {
    if (!this.employeeNameFilter) {
      // Se o filtro estiver vazio, mostra todos os colaboradores
      this.filteredEmployees = [...this.employees];
    } else {
      // Filtra os colaboradores pelo nome
      const filterText = this.employeeNameFilter.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(filterText)
      );
    }
  }

  openTimesheetDetails(employee: IEmployeesRecord): void {
    this._dialog.open(TimesheetModalComponent, {
      width: '800px',
      data: { employeeName: employee.name }
    });
  }

  private updateDefaultAvatar(): void {
    // Atualiza o avatar padrão com base no tema atual
    this.defaultAvatar = this.isDarkTheme ? this.avatarIconLight : this.avatarIconDark;
  }

  private updateEmployeeAvatars(): void {
    // Atualiza os avatares dos funcionários que usam o padrão
    if (this.employees.length > 0) {
      this.employees = this.employees.map(employee => {
        // Verifica se é um avatar padrão (seja o light ou dark)
        const isDefaultAvatar =
          !employee.avatar ||
          employee.avatar === this.avatarIconDark ||
          employee.avatar === this.avatarIconLight;

        return {
          ...employee,
          avatar: isDefaultAvatar ? this.defaultAvatar : employee.avatar
        };
      });

      // Atualiza também os avatares na lista filtrada
      this.filterEmployees();
    }
  }
}
