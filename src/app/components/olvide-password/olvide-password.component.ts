import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';

/**
 * Component responsible for handling the password recovery request flow.
 * Displays a form to input the user's email and dispatches a request to the Auth service.
 */
@Component({
  selector: 'app-olvide-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './olvide-password.component.html',
})
export class OlvidePasswordComponent {
  olvideForm: FormGroup;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.olvideForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Validates the form and sends the recovery request to the API.
   * Updates loading and messaging states based on the HTTP response.
   */
  onSubmit() {
    if (this.olvideForm.valid) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.authService.solicitarRecuperacion({ email: this.olvideForm.value.email })
        .subscribe({
          next: (res) => {
            this.loading = false;
            if (res.status) {
              this.successMessage = res.msg || 'Si el correo está registrado, recibirás instrucciones.';
              this.olvideForm.reset();
            } else {
              this.errorMessage = res.msg || 'Ocurrió un error.';
            }
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = err.error?.msg || 'Ocurrió un error de conexión.';
          }
        });
    } else {
      this.olvideForm.markAllAsTouched();
    }
  }
}
