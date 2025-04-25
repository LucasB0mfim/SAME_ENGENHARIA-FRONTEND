import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-open-call',
  imports: [],
  templateUrl: './open-call.component.html',
  styleUrl: './open-call.component.scss'
})
export class OpenCallComponent implements OnInit {

  // INJEÇÃO DE DEPENDÊNCIAS //
  private _titleService = inject(TitleService);

  // HOOK DE CICLO //
  ngOnInit() {
    this._titleService.setTitle('Abrir Chamado')
  }

}
