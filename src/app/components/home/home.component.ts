import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
})
// Implementamos OnInit
export class HomeComponent implements OnInit { 
  ofertasOriginales: OfertaLaboral[] = [];
  ofertas: OfertaLaboral[] = [];
  filtroActivo: string = 'Todas';
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
          this.ofertasOriginales = res.value;
          this.filtrar('Todas');
        }
      },
      error: (err) => {
        console.error("Error al cargar las ofertas", err);
      }
    });
  }

  private router = inject(Router);

  filtrar(filtro: string) {
    this.filtroActivo = filtro;
    if (filtro === 'Todas') {
      this.ofertas = [...this.ofertasOriginales];
    } else if (filtro === 'Ingeniería') {
      this.ofertas = this.ofertasOriginales.filter(o => 
        o.carreras && o.carreras.some(c => c.toLowerCase().includes('ingenier'))
      );
    } else if (filtro === 'Pasantías') {
      this.ofertas = this.ofertasOriginales.filter(o => 
        (o.tipoContratoNombre && o.tipoContratoNombre.toLowerCase().includes('pasantia')) ||
        (o.modalidadNombre && o.modalidadNombre.toLowerCase().includes('pasantía'))
      );
    }
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

  verDetalle(id: number) {
    this.router.navigate(['/dashboard/oferta', id]);
  }
}