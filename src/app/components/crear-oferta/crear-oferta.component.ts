import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboralCreate } from '../../models/OfertasLaborales/oferta-laboral';
import { SessionDTO } from '../../models/Auth/Auth';

@Component({
  selector: 'app-crear-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-oferta.component.html',
})
export class CrearOfertaComponent implements OnInit {
  ofertaForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  sesionActual: SessionDTO | null = null;

  private ofertaService = inject(OfertaLaboralService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      empresaId : this.sesionActual ? this.sesionActual.usuarioId : null,
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
    const sesionStr = localStorage.getItem('userSession'); 
    if (sesionStr) {
      this.sesionActual = JSON.parse(sesionStr) as SessionDTO;
    } else {
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
      
      const modeloEnvio: OfertaLaboralCreate = {
        ...formValues,
        empresaId: this.sesionActual.usuarioId, 
        
        modalidadId: Number(formValues.modalidadId),
        salarioMin: formValues.salarioMin ? Number(formValues.salarioMin) : null,
        salarioMax: formValues.salarioMax ? Number(formValues.salarioMax) : null
      };

      console.log("Sesion actual completa: ", this.sesionActual);
      console.log("Modelo a enviar: ", modeloEnvio);


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