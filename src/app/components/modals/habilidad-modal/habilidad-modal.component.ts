import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogosService } from '../../../services/Catalogo/catalogos.service'; // Para traer el catálogo
import { EstudianteHabilidadDTO } from '../../../models/Alumnos/perfil-estudiante';
import { HabilidadService } from '../../../services/perfil-estudiante/habilidades.service';

@Component({
  selector: 'app-modal-habilidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './habilidad-modal.component.html'
})
export class ModalHabilidadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private habilidadService = inject(HabilidadService);
  private catalogosService = inject(CatalogosService);

  @Output() guardadoExitoso = new EventEmitter<void>();

  habilidadForm!: FormGroup;
  isLoading = false;
  habilidadIdActual: number | null = null;
  
  catalogoHabilidades: any[] = []; 

  constructor() {
    this.iniciarFormulario();
  }

  ngOnInit() {
    this.cargarCatalogoHabilidades();
  }

  iniciarFormulario() {
    this.habilidadForm = this.fb.group({
      habilidadId: ['', Validators.required], // El ID del catálogo
      nivelDominio: [3, [Validators.required, Validators.min(1), Validators.max(5)]] // Rango del 1 al 5
    });
  }

  cargarCatalogoHabilidades() {
    this.catalogosService.obtenerHabilidades().subscribe(res => {
    if (res.status) this.catalogoHabilidades = res.value;
    });
    

    
  }

  abrir(hab?: EstudianteHabilidadDTO) {
    const modal = document.getElementById('modal_habilidad') as HTMLDialogElement;
    
    if (hab) {
      // MODO EDICIÓN
      this.habilidadIdActual = hab.habilidadId;
      this.habilidadForm.patchValue({
        habilidadId: hab.habilidadId,
        nivelDominio: hab.nivelDominio
      });
      // Bloqueamos el select para que en modo edición solo pueda cambiar el nivel
      this.habilidadForm.get('habilidadId')?.disable(); 
    } else {
      // MODO CREACIÓN
      this.habilidadIdActual = null;
      this.habilidadForm.reset({ nivelDominio: 3 });
      this.habilidadForm.get('habilidadId')?.enable();
    }
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_habilidad') as HTMLDialogElement;
    if (modal) modal.close();
  }

  guardar() {
    if (this.habilidadForm.invalid) {
      this.habilidadForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Obtenemos los valores. Usamos getRawValue() por si bloqueamos el select en edición
    const formValues = this.habilidadForm.getRawValue();
    const habIdNumber = Number(formValues.habilidadId);

    const habSeleccionada = this.catalogoHabilidades.find(h => h.id === habIdNumber);

    const dto: EstudianteHabilidadDTO = {
      habilidadId: habIdNumber,
      nombreHabilidad: habSeleccionada ? habSeleccionada.nombre : '', // Inyectamos el nombre para el Backend
      nivelDominio: Number(formValues.nivelDominio)
    };

    if (this.habilidadIdActual) {
      this.habilidadService.editarHabilidad(this.habilidadIdActual, dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    } else {
      this.habilidadService.agregarHabilidad(dto).subscribe({
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