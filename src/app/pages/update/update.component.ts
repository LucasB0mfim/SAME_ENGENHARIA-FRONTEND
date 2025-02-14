import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-update',
  imports: [ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  private readonly _router = inject(Router);
  private readonly _updateService = inject(UpdateService);

  updateForm: FormGroup = new FormGroup({
    username: new FormGroup(''),
    email: new FormGroup(''),
    currentPassword: new FormGroup(''),
    newPassword: new FormGroup('')
  });

  update() {

  }
}

