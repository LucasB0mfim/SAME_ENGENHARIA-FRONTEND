import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TransportService } from '../../../../core/services/transport.service';

@Component({
  selector: 'app-transport',
  imports: [CommonModule],
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _transportService = inject(TransportService);

  allItems: any[] = [];
  items: any[] = [];
  isLoading: boolean = false;
  activeStatus: string = 'NOVO';

  ngOnInit(): void {
    this.findRecord();
    this._titleService.setTitle('Transporte');
  }

  findRecord(): void {
    this.isLoading = true;

    this._transportService.findAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.allItems = res.result || [];
          this.filterByStatus(this.activeStatus);
        },
        error: (err) => {
          console.error(err.error.message, err);
        }
      });
  }

  filterByStatus(status: string): void {
    this.activeStatus = status;
    this.items = this.allItems.filter(item => item.status === status);
  }

  formateDate(date: string) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}
