import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { UpdateService } from '../../services/update.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { IUpdateRequest } from '../../interfaces/update-request.interface';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {

  loading: boolean = false;

  private readonly _router = inject(Router);
  private readonly _updateService = inject(UpdateService);

  updateForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    currentPassword: new FormControl(''),
    newPassword: new FormControl('')
  });

  update() {
    this.loading = true;

    const request: IUpdateRequest = {
      username: this.updateForm.value.username,
      email: this.updateForm.value.email,
      currentPassword: this.updateForm.value.currentPassword,
      newPassword: this.updateForm.value.newPassword
    };

    this._updateService.update(request).subscribe({
      next: () => {
        this.loading = false;
        this._router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    });
  }
}
