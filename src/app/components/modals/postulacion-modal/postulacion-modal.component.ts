import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {PostulacionDTO , CreatePostulacionDTO} from '../../../models/OfertasLaborales/postulacion';
import { PostulacionService } from '../../../services/OfertasLaborales/postulacion.service';

@Component({
  selector: 'app-modal-postulacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './postulacion-modal.component.html'
})
export class ModalPostulacionComponent {
  private fb = inject(FormBuilder);
  private postulacionService = inject(PostulacionService);

  @Output() postulacionExitosa = new EventEmitter<void>();

  postulacionForm!: FormGroup;
  isLoading = false;
  
  ofertaIdActual!: number;
  tituloOfertaActual: string = '';

  constructor() {
    this.postulacionForm = this.fb.group({
      mensaje: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  abrir(ofertaId: number, tituloOferta: string) {
    const modal = document.getElementById('modal_postulacion') as HTMLDialogElement;
    
    this.ofertaIdActual = ofertaId;
    this.tituloOfertaActual = tituloOferta;
    this.postulacionForm.reset();
    
    if (modal) modal.showModal();
  }

  cerrar() {
    const modal = document.getElementById('modal_postulacion') as HTMLDialogElement;
    if (modal) modal.close();
  }

  aplicar() {
    if (this.postulacionForm.invalid) {
      this.postulacionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    const dto: CreatePostulacionDTO = {
      ofertaId: this.ofertaIdActual,
      mensaje: this.postulacionForm.value.mensaje
    };

    this.postulacionService.aplicarOferta(dto).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          alert('¡Éxito! Tu postulación ha sido enviada a la empresa. RRHH podrá ver tu CV actualizado.');
          this.cerrar();
          this.postulacionExitosa.emit();
        } else {
          alert('Aviso: ' + res.msg);
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('Ocurrió un error al intentar postularte.');
        console.error(err);
      }
    });
  }
}