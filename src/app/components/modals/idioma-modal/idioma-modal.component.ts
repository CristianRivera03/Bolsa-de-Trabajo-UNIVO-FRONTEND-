import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IdiomaService } from '../../../services/perfil-estudiante/idioma.service';
import { CatalogosService } from '../../../services/Catalogo/catalogos.service'; 
import { EstudianteIdiomaDTO } from '../../../models/Alumnos/perfil-estudiante';

@Component({
  selector: 'app-modal-idioma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './idioma-modal.component.html'
})
export class ModalIdiomaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private idiomaService = inject(IdiomaService);
  private catalogosService = inject(CatalogosService);

  @Output() guardadoExitoso = new EventEmitter<void>();

  idiomaForm!: FormGroup;
  isLoading = false;
  idiomaIdActual: number | null = null;
  
  listaIdiomas: string[] = [
    'Español',
    'Inglés',
    'Alemán',
    'Francés',
    'Portugués',
    'Italiano',
    'Chino Mandarín',
    'Japonés',
    'Coreano',
    'Ruso',
    'Árabe',
    'Lengua de Señas'
  ];

  // Niveles desde la base de datos
  nivelesIdioma: any[] = [];

  constructor() {
    this.iniciarFormulario();
  }

  ngOnInit() {
    this.cargarNiveles();
  }

  iniciarFormulario() {
    this.idiomaForm = this.fb.group({
      idioma: ['', Validators.required],
      nivelId: ['', Validators.required]
    });
  }

  cargarNiveles() {

    this.catalogosService.obtenerNivelesIdioma().subscribe(res => {
      if (res.status) this.nivelesIdioma = res.value;
    });
    
    
  }

  abrir(idiomaInfo?: EstudianteIdiomaDTO) {
    const modal = document.getElementById('modal_idioma') as HTMLDialogElement;
    
    if (idiomaInfo) {
      // MODO EDICIÓN
      this.idiomaIdActual = idiomaInfo.id;
      this.idiomaForm.patchValue({
        idioma: idiomaInfo.idioma,
        nivelId: idiomaInfo.nivelId
      });
      // Bloqueamos el selector de idioma para que solo puedan editar el nivel
      this.idiomaForm.get('idioma')?.disable(); 
    } else {
      // MODO CREACIÓN
      this.idiomaIdActual = null;
      this.idiomaForm.reset();
      this.idiomaForm.get('idioma')?.enable();
    }
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_idioma') as HTMLDialogElement;
    if (modal) modal.close();
  }

  guardar() {
    if (this.idiomaForm.invalid) {
      this.idiomaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.idiomaForm.getRawValue(); 

    const nivelIdNum = Number(formValues.nivelId);
    const nivelSeleccionado = this.nivelesIdioma.find(n => n.id === nivelIdNum);

    const dto: EstudianteIdiomaDTO = {
      id: this.idiomaIdActual || 0,
      idioma: formValues.idioma,
      nivelId: nivelIdNum,
      nivelNombre: nivelSeleccionado ? nivelSeleccionado.nombre : 'No especificado'
    };

    if (this.idiomaIdActual) {
      this.idiomaService.editarIdioma(this.idiomaIdActual, dto).subscribe({
        next: (res) => this.manejarRespuesta(res),
        error: (err) => this.manejarError(err)
      });
    } else {
      this.idiomaService.agregarIdioma(dto).subscribe({
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