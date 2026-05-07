import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboralCreate } from '../../models/OfertasLaborales/oferta-laboral';
import { SessionDTO } from '../../models/Auth/Auth';

@Component({
  selector: 'app-crear-oferta',
  standalone: true, // Agregado si estás usando Angular 14+ con standalone components
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-oferta.component.html',
})
export class CrearOfertaComponent implements OnInit {
  ofertaForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Variable para guardar la sesión activa
  sesionActual: SessionDTO | null = null;

  private ofertaService = inject(OfertaLaboralService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      // Eliminamos empresaId de aquí, ya no es un control del formulario
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      requisitos: ['', Validators.required],
      modalidadId: ['', Validators.required], 
      ubicacion: ['', Validators.required],
      salarioMin: [null, Validators.min(1)],
      salarioMax: [null, Validators.min(1)],
      fechaExpiracion: [null]
    }, { validators: this.rangoSalarialValidator });
  }

  ngOnInit(): void {
    // Recuperamos la sesión del LocalStorage al cargar el componente
    const sesionStr = localStorage.getItem('sesionUsuario'); // Asegúrate de usar la llave correcta
    if (sesionStr) {
      this.sesionActual = JSON.parse(sesionStr) as SessionDTO;
    } else {
      // Si no hay sesión, lo devolvemos al login por seguridad
      this.router.navigate(['/login']);
    }
  }

  // Validador: debe ser mayor o igual al Min
  rangoSalarialValidator(c: AbstractControl) {
    const min = c.get('salarioMin')?.value;
    const max = c.get('salarioMax')?.value;
    if (min !== null && max !== null && max < min) {
      return { rangoInvalido: true };
    }
    return null;
  }

  publicarOferta() {
    if (this.ofertaForm.valid && this.sesionActual) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValues = this.ofertaForm.value;
      
      // Armamos el modelo inyectando el ID directamente desde la sesión
      const modeloEnvio: OfertaLaboralCreate = {
        ...formValues,
        // OJO AQUÍ: Explicación crítica más abajo sobre este campo
        empresaId: this.sesionActual.usuarioId, 
        
        modalidadId: Number(formValues.modalidadId),
        salarioMin: formValues.salarioMin ? Number(formValues.salarioMin) : null,
        salarioMax: formValues.salarioMax ? Number(formValues.salarioMax) : null
      };

      this.ofertaService.crear(modeloEnvio).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status) {
            this.successMessage = '¡Oferta laboral publicada!';
            this.ofertaForm.reset({}); 
            setTimeout(() => this.router.navigate(['/mis-ofertas']), 2000);
          } else {
            this.errorMessage = res.msg || 'Error al publicar la oferta.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.msg || 'Error de conexión con el servidor.';
        }
      });
    } else {
      this.ofertaForm.markAllAsTouched();
      if (!this.sesionActual) {
         this.errorMessage = 'No se encontró una sesión activa.';
      }
    }
  }
}