// Agregamos OnInit a los imports
import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
})
// Implementamos OnInit
export class HomeComponent implements OnInit { 
  ofertas: OfertaLaboral[] = [];
  private ofertaLaboralService = inject(OfertaLaboralService);

  // Este método se ejecuta automáticamente al cargar el componente
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    // Asegúrate de que el método en tu servicio se llame 'lista' o 'obtenerTodos'
    this.ofertaLaboralService.lista().subscribe({
      next: (res) => {
        if (res.status) {
          console.log("Ofertas cargadas:", res.value);
          this.ofertas = res.value;
        }
      },
      error: (err) => {
        console.error("Error al cargar las ofertas", err);
      }
    });
  }

  getModalidadClass(modalidad: string): string {
    // Es importante que el string coincida exactamente con lo que viene de la DB
    if (!modalidad) return 'badge-ghost';
    
    switch (modalidad.trim()) {
      case 'Remoto': return 'badge-info text-info-content';
      case 'Híbrido': return 'badge-secondary text-secondary-content';
      case 'Presencial': return 'badge-primary text-primary-content'; 
      default: return 'badge-ghost';
    }
  }
}