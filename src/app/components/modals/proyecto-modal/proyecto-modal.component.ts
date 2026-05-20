import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../../services/perfil-estudiante/proyecto.service';
import { ProyectoEstudianteDTO } from '../../../models/Alumnos/perfil-estudiante';

@Component({
  selector: 'app-modal-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyecto-modal.component.html'
})
export class ModalProyectoComponent {
  private fb = inject(FormBuilder);
  private proyectoService = inject(ProyectoService);

  @Output() guardadoExitoso = new EventEmitter<void>();

  proyectoForm!: FormGroup;
  isLoading = false;
  proyectoIdActual: number | null = null;

  constructor() {
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      tecnologiasUsadas: ['', Validators.required],
      enlaceRepositorio: [''], 
      fechaProyecto: ['']
    });
  }

  abrir(proy?: ProyectoEstudianteDTO) {
    const modal = document.getElementById('modal_proyecto') as HTMLDialogElement;
    
    if (proy) {
      // MODO EDICIÓN
      this.proyectoIdActual = proy.id;
      this.proyectoForm.patchValue({
        nombre: proy.nombre,
        descripcion: proy.descripcion,
        tecnologiasUsadas: proy.tecnologiasUsadas,
        enlaceRepositorio: proy.enlaceRepositorio,
        fechaProyecto: proy.fechaProyecto
      });
    } else {
      // MODO CREACIÓN
      this.proyectoIdActual = null;
      this.proyectoForm.reset();
    }
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_proyecto') as HTMLDialogElement;
    if (modal) modal.close();
  }

  guardar() {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.proyectoForm.value;

    const dto: ProyectoEstudianteDTO = {
      id: this.proyectoIdActual || 0,
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      tecnologiasUsadas: formValues.tecnologiasUsadas,
      enlaceRepositorio: formValues.enlaceRepositorio || '', // Evita enviar null si C# espera string
      fechaProyecto: formValues.fechaProyecto ? formValues.fechaProyecto : null
    };

    if (this.proyectoIdActual) {
      this.proyectoService.editarProyecto(this.proyectoIdActual, dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    } else {
      this.proyectoService.agregarProyecto(dto).subscribe({
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