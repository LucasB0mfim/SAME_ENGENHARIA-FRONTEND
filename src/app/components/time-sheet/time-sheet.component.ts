import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetService } from '../../services/time-sheet.service';
import { ThemeService } from '../../services/theme.service';
import { ITimeSheetResponse, ITimeSheetRecord } from '../../interfaces/time-sheet.interface';
import { IEmployeesRecord, IEmployeesResponse } from '../../interfaces/employees-response.interface';
import { FindEmployeesService } from '../../services/find-employees.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit, OnDestroy {
  private readonly _findEmployees = inject(FindEmployeesService);
  private readonly _themeService = inject(ThemeService);

  private themeSubscription: Subscription | null = null;

  isDarkTheme: boolean = false;
  avatarIconDark: string = 'assets/images/avatarIconDark.png';
  avatarIconLight: string = 'assets/images/avatarIconLight.png';
  defaultAvatar: string = '';

  timeSheets: ITimeSheetRecord[] = [];
  employees: IEmployeesRecord[] = [];

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

    this.findEmployees();
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
      },
      error: (error) => {
        console.error(error);
      }
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
    }
  }
}
