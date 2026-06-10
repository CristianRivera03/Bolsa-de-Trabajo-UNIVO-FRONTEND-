import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EnterpriseService } from '../../services/Enterprise/enterprise.service';
import { EmpresaCreateDTO } from '../../models/Empresa/empresa';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { CatalogDTO } from '../../models/Catalog/catalog';

@Component({
  selector: 'app-sign-up-enterprise',
  standalone: true,
  imports: [ ReactiveFormsModule , CommonModule, RouterModule ],
  templateUrl: './sign-up-enterprise.component.html',
})
export class SignUpEnterpriseComponent {
  empresaForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  sectores: CatalogDTO[] = [];
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private enterpriseService = inject(EnterpriseService);
  private catalogosService = inject(CatalogosService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.empresaForm = this.fb.group(
      {
        nombreComercial: ['', Validators.required],
        razonSocial: ['', Validators.required],
        nit: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
        sectorId: ['', Validators.required],
        descripcion: ['', Validators.required],
        sitioWeb: [''],
        email: ['', [Validators.required, Validators.email]],
        contactoNombre: ['', Validators.required],
        contactoTelefono: ['', [Validators.required, Validators.minLength(8)]],
        contactoDui: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {
    this.catalogosService.obtenerSectores().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.sectores = res.value;
        }
      }
    });
  }

  // Auto-formato de NIT (XXXX-XXXXXX-XXX-X)
  formatNit(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remover todo lo que no sea dígito
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    let formatted = value;
    if (value.length > 4) {
      formatted = value.substring(0, 4) + '-' + value.substring(4);
    }
    if (value.length > 10) {
      formatted = formatted.substring(0, 11) + '-' + formatted.substring(11);
    }
    if (value.length > 13) {
      formatted = formatted.substring(0, 15) + '-' + formatted.substring(15);
    }
    
    this.empresaForm.get('nit')?.setValue(formatted, { emitEvent: false });
  }

  // Auto-formato de DUI (XXXXXXXX-X)
  formatDui(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remover todo lo que no sea dígito
    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    let formatted = value;
    if (value.length > 8) {
      formatted = value.substring(0, 8) + '-' + value.substring(8);
    }
    
    this.empresaForm.get('contactoDui')?.setValue(formatted, { emitEvent: false });
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
