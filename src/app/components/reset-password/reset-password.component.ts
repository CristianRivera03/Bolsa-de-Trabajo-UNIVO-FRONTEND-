import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';

/**
 * Component responsible for setting a new user password.
 * Extracts the JWT security token from the URL and submits it alongside the new password to the Auth service.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  loading = false;
  successMessage = '';
  errorMessage = '';
  token = '';
  showPassword = false;

  constructor() {
    this.resetForm = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Initializes the component by retrieving the security token from the URL query parameters.
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'Enlace inválido. No se encontró el token de seguridad.';
      }
    });
  }

  /**
   * Custom validator to ensure that the new password and confirmation password match.
   * @param g The FormGroup instance containing the password fields.
   * @returns Null if they match, or a mismatch error object otherwise.
   */
  passwordMatchValidator(g: FormGroup) {
    return g.get('nuevaPassword')?.value === g.get('confirmarPassword')?.value
      ? null : { mismatch: true };
  }

  /**
   * Toggles the visibility of the password input fields.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Submits the new password to the API for the current token.
   * Handles loading states, validation errors, and redirects the user to the login page on success.
   */
  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const dto = {
        token: this.token,
        nuevaPassword: this.resetForm.value.nuevaPassword
      };

      this.authService.restablecerPassword(dto).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status) {
            this.successMessage = res.msg || 'Contraseña actualizada con éxito.';
            this.resetForm.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.errorMessage = res.msg || 'Ocurrió un error al restablecer la contraseña.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.msg || 'El token ha expirado o es inválido.';
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
