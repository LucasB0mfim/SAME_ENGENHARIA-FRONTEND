import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  private readonly _router = inject(Router);
  private readonly _cadastro = inject(CadastroService);

  cadastroForm: FormGroup = new FormGroup({
    usuario: new FormControl(''),
    email: new FormControl(''),
    senhaAtual: new FormControl('same0106'),
    senhaNova: new FormControl(''),
  });

  cadastro() {
    this._cadastro.cadastro(this.cadastroForm.value.usuario, this.cadastroForm.value.email, this.cadastroForm.value.senhaAtual, this.cadastroForm.value.senhaNova)
      .subscribe({
        next: () => {
          this._router.navigate(['dashboard']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.cadastroForm.setErrors({ 'crediciaisInvalidas': true });
          } else {
            this.cadastroForm.setErrors({ 'erroInesperado': true });
          }
        }
      });
  }
}
