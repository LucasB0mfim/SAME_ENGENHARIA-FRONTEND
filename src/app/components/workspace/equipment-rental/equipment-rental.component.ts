import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { TitleService } from '../../../core/services/title.service';
import { EquipmentRentalService } from '../../../core/services/equipment-rental.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-equipment-rental',
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equipment-rental.component.html',
  styleUrl: './equipment-rental.component.scss'
})
export class EquipmentRentalComponent implements OnInit {

  private readonly _titleService = inject(TitleService);
  private readonly _rentalService = inject(EquipmentRentalService);

  items: any[] = [];
  currentItem: any = null;

  optionModal: boolean = false;
  editModal: boolean = false;
  renewModal: boolean = false;

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  renewForm: FormGroup = new FormGroup({
    id_produto: new FormControl(''),
    idmov: new FormControl(''),
    data_inicial: new FormControl(''),
    ordem_compra: new FormControl(''),
    valor: new FormControl(''),
    tempo_contratado: new FormControl(''),
    equipamento: new FormControl(''),
    periodo: new FormControl('')
  });

  updateForm: FormGroup = new FormGroup({
    id_produto: new FormControl(''),
    idmov: new FormControl(''),
    data_inicial: new FormControl(''),
    data_final: new FormControl(''),
    ordem_compra: new FormControl(''),
    valor: new FormControl(''),
    tempo_contratado: new FormControl(''),
    periodo: new FormControl('')
  });

  ngOnInit(): void {
    this._titleService.setTitle('Locação');
    this.findAll();

    this.updateForm.get('periodo')?.valueChanges.subscribe(periodoSelecionado => {
      if (this.currentItem && periodoSelecionado) {
        const locacao = this.currentItem.locacoes.find(
          (l: any) => l.periodo === periodoSelecionado
        );
        if (locacao) {
          this.updateForm.patchValue({
            id_produto: locacao.id_produto || '',
            idmov: locacao.idmov || '',
            data_inicial: locacao.data_inicial || '',
            data_final: locacao.data_final || '',
            ordem_compra: locacao.ordem_compra || '',
            valor: locacao.valor || '',
            tempo_contratado: locacao.tempo_contratado || ''
          }, { emitEvent: false });
        }
      }
    });
  };

  findAll(): void {
    this._rentalService.findAll().subscribe({
      next: (res) => {
        this.items = res.result;
      },
      error: (err) => {
        console.error('Erro ao buscar registros: ', err);
      }
    });
  };

  onUpdate(): void {
    const request = {
      id_produto: this.updateForm.value.id_produto,
      idmov: this.updateForm.value.idmov,
      data_inicial: this.updateForm.value.data_inicial,
      data_final: this.updateForm.value.data_final,
      ordem_compra: this.updateForm.value.ordem_compra,
      valor: this.updateForm.value.valor,
      tempo_contratado: this.updateForm.value.tempo_contratado,
      periodo: this.updateForm.value.periodo
    }

    this._rentalService.update(request).subscribe({
      next: () => {
        this.closeAll();
        this.findAll();
        this.setMessage('Locação atualizada com sucesso!', 'success');
      },
      error: (err) => {
        console.error('Erro ao atualizar locação: ', err);
        this.setMessage('Erro ao atualizar locação!', 'error');
      }
    })
  };

  onRenew(): void {
    const request = {
      periodo: this.renewForm.value.periodo,
      id_produto: this.renewForm.value.id_produto,
      idmov: this.renewForm.value.idmov,
      data_inicial: this.renewForm.value.data_inicial,
      ordem_compra: this.renewForm.value.ordem_compra,
      valor: this.renewForm.value.valor,
      tempo_contratado: this.renewForm.value.tempo_contratado
    }

    this._rentalService.renew(request).subscribe({
      next: () => {
        this.closeAll();
        this.findAll();
        this.setMessage('Locação renovada com sucesso!', 'success');

        this.renewForm.reset({
          idmov: '',
          data_inicial: '',
          ordem_compra: '',
          valor: ''
        });
      },
      error: (err) => {
        console.error('Erro ao renovar locação: ', err);
        this.setMessage('Erro ao renovar locação!', 'error');
      }
    })
  };

  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }

  openOption(employee: any): void {
    this.renewModal = false;
    this.editModal = false;
    this.optionModal = true;
    this.currentItem = employee;
  };

  openEdit(): void {
    this.optionModal = false;
    this.renewModal = false;
    this.editModal = true;

    this.updateForm.patchValue({
      id_produto: this.currentItem.locacoes[0].id_produto || '',
      idmov: this.currentItem.locacoes[0].idmov || '',
      data_inicial: this.currentItem.locacoes[0].data_inicial || '',
      data_final: this.currentItem.locacoes[0].data_final || '',
      ordem_compra: this.currentItem.locacoes[0].ordem_compra || '',
      valor: this.currentItem.locacoes[0].valor || '',
      tempo_contratado: this.currentItem.locacoes[0].tempo_contratado || '',
      periodo: this.currentItem.locacoes[0].periodo || ''
    });
  };

  openRenew(): void {
    this.optionModal = false;
    this.editModal = false;
    this.renewModal = true;

    this.renewForm.patchValue({
      equipamento: this.currentItem.equipamento || '',
      id_produto: this.currentItem.id_produto || '',
      periodo: (this.currentItem.locacoes.length + 1) || '',
      tempo_contratado: this.currentItem.locacoes[0].tempo_contratado || ''
    });
  };

  closeOption(): void {
    this.optionModal = false;
  };

  closeEdit(): void {
    this.editModal = false;
  };

  closeRenew(): void {
    this.renewModal = false;
  };

  returnOption(): void {
    this.renewModal = false;
    this.editModal = false;
    this.optionModal = true;
  };

  closeAll(): void {
    this.optionModal = false;
    this.editModal = false;
    this.renewModal = false;
  };
}
