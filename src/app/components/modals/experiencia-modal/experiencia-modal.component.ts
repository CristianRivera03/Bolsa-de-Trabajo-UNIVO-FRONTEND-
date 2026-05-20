import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExperienciaLaboralService } from '../../../services/perfil-estudiante/experiencia-laboral.service'; // Ajusta la ruta
import { ExperienciaLaboralDTO } from '../../../models/Alumnos/perfil-estudiante';
import { CatalogosService } from '../../../services/Catalogo/catalogos.service';


@Component({
  selector: 'app-modal-experiencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experiencia-modal.component.html'
})
export class ModalExperienciaComponent {
  private fb = inject(FormBuilder);
  private experienciaService = inject(ExperienciaLaboralService);
  private catalogosService = inject(CatalogosService);

  @Output() guardadoExitoso = new EventEmitter<void>();

  experienciaForm!: FormGroup;
  isLoading = false;
  experienciaIdActual: number | null = null;

  constructor() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.experienciaForm = this.fb.group({
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      esTrabajoActual: [false],
      descripcionPuesto: ['', [Validators.required, Validators.maxLength(500)]]
    });

    // MAGIA REACTIVA: Si marca "Es trabajo actual", deshabilitamos "Fecha Fin"
    this.experienciaForm.get('esTrabajoActual')?.valueChanges.subscribe(checked => {
      const fechaFinControl = this.experienciaForm.get('fechaFin');
      if (checked) {
        fechaFinControl?.setValue(null);
        fechaFinControl?.disable();
      } else {
        fechaFinControl?.enable();
      }
    });
  }

  abrir(exp?: ExperienciaLaboralDTO) {
    const modal = document.getElementById('modal_experiencia') as HTMLDialogElement;
    
    if (exp) {
      this.experienciaIdActual = exp.id;
      this.experienciaForm.patchValue({
        empresa: exp.empresa,
        cargo: exp.cargo,
        fechaInicio: exp.fechaInicio,
        fechaFin: exp.fechaFin,
        esTrabajoActual: exp.esTrabajoActual,
        descripcionPuesto: exp.descripcionPuesto
      });
    } else {
      this.experienciaIdActual = null;
      this.experienciaForm.reset({ esTrabajoActual: false }); // Reseteo con valor por defecto
    }
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_experiencia') as HTMLDialogElement;
    if (modal) modal.close();
  }

  guardar() {
    if (this.experienciaForm.invalid) {
      this.experienciaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // getRawValue() extrae los valores incluso si el campo está deshabilitado (como fechaFin)
    const formValues = this.experienciaForm.getRawValue();

    const dto: ExperienciaLaboralDTO = {
      id: this.experienciaIdActual || 0,
      empresa: formValues.empresa,
      cargo: formValues.cargo,
      fechaInicio: formValues.fechaInicio,
      fechaFin: formValues.esTrabajoActual ? null : formValues.fechaFin,
      esTrabajoActual: formValues.esTrabajoActual,
      descripcionPuesto: formValues.descripcionPuesto
    };

    if (this.experienciaIdActual) {
      this.experienciaService.editarExperienciaLaboral(this.experienciaIdActual, dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    } else {
      this.experienciaService.agregarExperienciaLaboral(dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    }
  }

  private manejarRespuesta(res: any) {
    this.isLoading = false;
    if (res.status) {
      this.cerrar();
      this.guardadoExitoso.emit();
    } else {
      alert('Error: ' + res.msg);
    }
  }

  private manejarError(err: any) {
    this.isLoading = false;
    alert('Error de conexión con el servidor.');
    console.error(err);
  }
}