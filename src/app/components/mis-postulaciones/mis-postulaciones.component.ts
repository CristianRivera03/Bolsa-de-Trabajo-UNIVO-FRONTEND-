import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {PostulacionDTO , CreatePostulacionDTO} from '../../models/OfertasLaborales/postulacion';
import { PostulacionService } from '../../services/OfertasLaborales/postulacion.service';


@Component({
  selector: 'app-mis-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-postulaciones.component.html'
})
export class MisPostulacionesComponent implements OnInit {
  private postulacionService = inject(PostulacionService);

  postulaciones: PostulacionDTO[] = [];
  isLoading = true;

  ngOnInit() {
    this.cargarPostulaciones();
  }

  cargarPostulaciones() {
    this.postulacionService.obtenerMisPostulaciones().subscribe({
      next: (res) => {
        if (res.status) {
          this.postulaciones = res.value;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar postulaciones', err);
        this.isLoading = false;
      }
    });
  }

  obtenerColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'recibida':
        return 'badge-info'; // Azul
      case 'en revision':
        return 'badge-warning'; // Amarillo
      case 'entrevista programada':
        return 'badge-primary'; // Tu color primario (ej. el azul de UNIVO)
      case 'seleccionado':
        return 'badge-success'; // Verde
      case 'no seleccionado':
        return 'badge-error'; // Rojo
      default:
        return 'badge-ghost'; // Gris por defecto
    }
  }
}