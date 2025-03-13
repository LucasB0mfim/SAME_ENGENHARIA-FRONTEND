import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from '../../../core/services/theme.service';
import { IEmployeesRecord, IEmployeesResponse } from '../../../core/interfaces/employees-response.interface';
import { FindEmployeesService } from '../../../core/services/find-employees.service';
import { TimesheetModalComponent } from '../timesheet-modal/timesheet-modal.component';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeSheetService } from '../../../core/services/time-sheet.service';
import { ITimeSheetRequest } from '../../../core/interfaces/timesheet-request.interface';
import { ITimesheetRecord, ITimeSheetResponse } from '../../../core/interfaces/timesheet-response.interface';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit, OnDestroy {
  private readonly _findEmployees = inject(FindEmployeesService);
  private readonly _themeService = inject(ThemeService);
  private readonly _dialog = inject(MatDialog);
  private readonly _timeSheetService = inject(TimeSheetService);
  private themeSubscription: Subscription | null = null;
  private _titleService = inject(TitleService);

  defaultAvatar: string = '';
  isDarkTheme: boolean = false;
  avatarIconDark: string = 'assets/images/avatarIconDark.png';
  avatarIconLight: string = 'assets/images/avatarIconLight.png';

  employees: IEmployeesRecord[] = [];
  filteredEmployees: IEmployeesRecord[] = [];
  employeeNameFilter: string = '';

  // Novos campos para os filtros
  statusFilter: string = 'all';
  allowanceFilter: string = 'none';
  startDateFilter: string = '';
  endDateFilter: string = '';

  // Flag para indicar se estamos carregando dados
  isLoading: boolean = false;

  // Para armazenar registros de ponto
  timesheet: ITimesheetRecord[] = [];
  showEmployeeTable: boolean = true;

  ngOnInit(): void {
    // Inicializa o tema de acordo com o localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.updateDefaultAvatar();
    this.findEmployees();
    this._titleService.setTitle('Monitorar Ponto')

    // Se inscreve para mudanças de tema
    this.themeSubscription = this._themeService.getThemeState().subscribe(isDark => {
      this.isDarkTheme = isDark;
      this.updateDefaultAvatar();
      this.updateEmployeeAvatars();
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  findEmployees(): void {
    this.isLoading = true;
    this._findEmployees.findEmployees().subscribe({
      next: (response: IEmployeesResponse) => {
        this.employees = response.employees.map(employee => ({
          ...employee, avatar: employee.avatar || this.defaultAvatar
        }));
        this.filterEmployees(); // Aplica o filtro atual
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
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

  search(): void {
    this.isLoading = true;

    // Formatar as datas para o padrão brasileiro
    const formattedStartDate = this.formatDate(this.startDateFilter);
    const formattedEndDate = this.formatDate(this.endDateFilter);

    const request: ITimeSheetRequest = {
      status: this.statusFilter,
      abono: this.allowanceFilter,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    this._timeSheetService.find(request).subscribe({
      next: (response: ITimeSheetResponse) => {
        this.timesheet = response.records;
        this.showEmployeeTable = false;
        this.isLoading = false;

        // Se temos apenas data inicial, não agrupamos os registros
        // Se temos ambas as datas, agrupamos por colaborador
        if (this.startDateFilter && this.endDateFilter) {
          this.groupTimesheetByEmployee();
        }
      },
      error: (error) => {
        console.error('Erro ao buscar registros de ponto:', error);
        this.isLoading = false;
      }
    });
  }

  groupTimesheetByEmployee(): void {
    // Criar um Map para agrupar os registros por colaborador
    const employeeMap = new Map<string, ITimesheetRecord[]>();

    this.timesheet.forEach(record => {
      const employeeKey = record.CHAPA; // Usando a chapa como identificador único

      if (!employeeMap.has(employeeKey)) {
        employeeMap.set(employeeKey, []);
      }

      employeeMap.get(employeeKey)?.push(record);
    });

    // Transformar o Map em um array de registros consolidados
    this.consolidatedTimesheet = Array.from(employeeMap.entries()).map(([chapa, records]) => {
      // Pegar o primeiro registro para obter o nome do colaborador
      const firstRecord = records[0];
      return {
        CHAPA: chapa,
        NOME: firstRecord.NOME,
        records: records, // Armazenar todos os registros para uso posterior no modal
        // Outros campos que possam ser necessários
      };
    });
  }

  consolidatedTimesheet: any[] = [];

  FindRecordByFilters(employee: any): void {
    let modalData: any;

    if (this.startDateFilter && this.endDateFilter) {
      // Caso de intervalo de datas: passamos os registros e o intervalo
      modalData = {
        employeeName: employee.NOME,
        employeeId: employee.CHAPA,
        records: employee.records,  // Estes são os registros já filtrados
        startDate: this.startDateFilter,
        endDate: this.endDateFilter,
        status: this.statusFilter,
        abono: this.allowanceFilter
      };
    } else if (this.startDateFilter && !this.endDateFilter) {
      // Caso de apenas uma data: encontramos o registro específico deste funcionário
      const employeeRecords = this.timesheet.filter(record =>
        record.CHAPA === employee.CHAPA || record.NOME === employee.NOME);

      modalData = {
        employeeName: employee.NOME,
        records: employeeRecords,
        startDate: this.startDateFilter,
        status: this.statusFilter,
        abono: this.allowanceFilter
      };
    } else {
      // Caso padrão (sem filtros de data): buscaremos todos os registros
      modalData = {
        employeeName: employee.name || employee.NOME,
        status: this.statusFilter,
        abono: this.allowanceFilter
      };
    }

    this._dialog.open(TimesheetModalComponent, {
      width: '90vw',
      maxWidth: '90vw',
      height: '90vh',
      maxHeight: '90vh',
      panelClass: 'timesheet-modal-dialog',
      data: modalData
    });
  }

  FindRecordByName(employee: any): void {
    this.isLoading = true;

    // Cria o objeto de requisição com o nome do funcionário e filtros padrão
    const request: ITimeSheetRequest = {
      status: 'all', // Filtro padrão para status
      abono: 'none', // Filtro padrão para abono
      startDate: '', // Sem data inicial
      endDate: '', // Sem data final
    };

    // Usa o método find() do serviço para buscar os registros
    this._timeSheetService.find(request).subscribe({
      next: (response: ITimeSheetResponse) => {
        // Filtra os registros pelo nome do funcionário
        const employeeRecords = response.records.filter(record =>
          record.NOME.toLowerCase() === employee.name.toLowerCase()
        );

        // Prepara os dados para a modal
        const modalData = {
          employeeName: employee.name,
          records: employeeRecords
        };

        // Abre a modal com os registros do funcionário
        this._dialog.open(TimesheetModalComponent, {
          width: '90vw',
          maxWidth: '90vw',
          height: '90vh',
          maxHeight: '90vh',
          panelClass: 'timesheet-modal-dialog',
          data: modalData
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar registros de ponto:', error);
        this.isLoading = false;
      }
    });
  }

  // Função auxiliar para formatar a data
  private formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = (date.getDate() + 1).toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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
