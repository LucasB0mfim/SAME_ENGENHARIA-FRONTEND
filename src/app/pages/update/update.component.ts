import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-update',
  imports: [ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  updateForm: FormGroup = new FormGroup({
    usuario: new FormControl(''),
    email: new FormControl(''),
    senhaAtual: new FormControl('same0106'),
    senhaNova: new FormControl(''),
  });

  private readonly _router = inject(Router);
  // private readonly _update = inject();

  update() {

  }
}

