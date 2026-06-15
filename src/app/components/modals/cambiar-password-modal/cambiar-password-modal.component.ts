import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/Auth/auth.service';
import { CambiarPasswordDTO } from '../../../models/Auth/Auth';

@Component({
  selector: 'app-cambiar-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password-modal.component.html'
})
export class CambiarPasswordModalComponent {
  @Output() modalClosed = new EventEmitter<boolean>();
  
  passwordForm: FormGroup;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const dto: CambiarPasswordDTO = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.authService.cambiarPassword(dto).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          alert('¡Éxito!\n' + (res.msg || 'Contraseña actualizada correctamente.'));
          this.closeModal(true);
        } else {
          alert('Error\n' + (res.msg || 'No se pudo cambiar la contraseña.'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = err.error?.msg || 'Ocurrió un error al cambiar la contraseña.';
        alert('Error\n' + errMsg);
      }
    });
  }

  closeModal(success: boolean = false) {
    this.passwordForm.reset();
    const modal = document.getElementById('cambiar_password_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.modalClosed.emit(success);
  }
}
