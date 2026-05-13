import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnterpriseService } from '../../services/Enterprise/enterprise.service';
import { EmpresaCreateDTO } from '../../models/Empresa/empresa';

@Component({
  selector: 'app-sign-up-enterprise',
  standalone: true,
  imports: [ ReactiveFormsModule , CommonModule ],
  templateUrl: './sign-up-enterprise.component.html',
})
export class SignUpEnterpriseComponent {
  empresaForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private enterpriseService = inject(EnterpriseService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.empresaForm = this.fb.group(
      {
        nombreComercial: ['', Validators.required],
        sector: ['', Validators.required],
        sitioWeb: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  registrarEmpresa() {
    if (this.empresaForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...datosEmpresa } = this.empresaForm.value;

      // petición a la API
      this.enterpriseService
        .registrar(datosEmpresa as EmpresaCreateDTO)
        .subscribe({
          next: (response) => {
            this.isLoading = false;

            if (response.status) {
              // Registro exitoso:
              this.router.navigate(['/login']);
            } else {
              this.errorMessage =
                response.msg || 'No se pudo completar el registro.';
            }
          },

          // Si ocurre un error 
          error: (err) => {
            this.isLoading = false;
            this.errorMessage =
              err.error?.msg || 'Ocurrió un error de conexión con el servidor.';
          },
        });
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }
}
