import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EducacionService } from '../../../services/perfil-estudiante/educacion.service'; // Ajusta la ruta
import { EducacionDTO } from '../../../models/Alumnos/perfil-estudiante';

@Component({
  selector: 'app-modal-educacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education-modal.component.html'
})
export class ModalEducacionComponent {
  private fb = inject(FormBuilder);
  private educacionService = inject(EducacionService);

  // Este evento avisará al componente principal que recargue la lista tras guardar
  @Output() guardadoExitoso = new EventEmitter<void>();

  educacionForm!: FormGroup;
  isLoading = false;
  educacionIdActual: number | null = null; // Para saber si estamos editando
  
  // Catálogos locales para el select (Puedes pasarlos por Input después si lo deseas)
  gradosAcademicos = [
    { id: 1, nombre: 'Bachillerato' },
    { id: 2, nombre: 'Técnico' },
    { id: 3, nombre: 'Licenciatura' },
    { id: 4, nombre: 'Ingeniería' },
    { id: 5, nombre: 'Maestría' }
  ];

  constructor() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.educacionForm = this.fb.group({
      gradoAcademicoId: ['', Validators.required],
      institucion: ['', Validators.required],
      tituloObtenido: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''], // Opcional si está "En curso"
      estado: ['', Validators.required]
    });
  }

  // Método mágico que llamaremos desde el componente principal
  abrir(educacion?: EducacionDTO) {
    const modal = document.getElementById('modal_educacion') as HTMLDialogElement;
    
    if (educacion) {
      // MODO EDICIÓN
      this.educacionIdActual = educacion.id;
      this.educacionForm.patchValue({
        gradoAcademicoId: educacion.gradoAcademicoId,
        institucion: educacion.institucion,
        tituloObtenido: educacion.tituloObtenido,
        fechaInicio: educacion.fechaInicio,
        fechaFin: educacion.fechaFin,
        estado: educacion.estado
      });
    } else {
      // MODO CREACIÓN
      this.educacionIdActual = null;
      this.educacionForm.reset();
    }
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_educacion') as HTMLDialogElement;
    if (modal) modal.close();
  }

  guardar() {
    if (this.educacionForm.invalid) {
      this.educacionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.educacionForm.value;
    const gradoIdNumber = Number(formValues.gradoAcademicoId);

    const gradoSeleccionado = this.gradosAcademicos.find(g => g.id === gradoIdNumber);
    const nombreGrado = gradoSeleccionado ? gradoSeleccionado.nombre : 'No especificado';

    const dto: EducacionDTO = {
      id: this.educacionIdActual || 0, 
      gradoAcademicoId: gradoIdNumber,
      gradoAcademicoNombre: nombreGrado, 
      institucion: formValues.institucion,
      tituloObtenido: formValues.tituloObtenido,
      estado: formValues.estado,
      fechaInicio: formValues.fechaInicio,
      fechaFin: formValues.fechaFin ? formValues.fechaFin : null 
    };

    if (this.educacionIdActual) {
      this.educacionService.editarEducacion(this.educacionIdActual, dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    } else {
      // AGREGAR
      this.educacionService.agregarEducacion(dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    }
  }

  private manejarRespuesta(res: any) {
    this.isLoading = false;
    if (res.status) {
      this.cerrar();
      this.guardadoExitoso.emit(); // Avisamos que se guardó para refrescar la lista
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