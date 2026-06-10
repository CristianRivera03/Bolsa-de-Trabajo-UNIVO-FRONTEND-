import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
})
// Implementamos OnInit
export class HomeComponent implements OnInit { 
  ofertasOriginales: OfertaLaboral[] = [];
  ofertas: OfertaLaboral[] = [];
  filtroActivo: string = 'Todas';
  carrerasDisponibles: string[] = [];
  mostrarFiltros: boolean = false;
  
  // Variables de Búsqueda Backend
  searchKeyword: string = '';
  searchCarreraId: string = '';
  searchSectorId: string = '';
  carrerasTodas: any[] = [];
  sectoresDisponibles: any[] = [];

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
  private ofertaLaboralService = inject(OfertaLaboralService);
  private catalogosService = inject(CatalogosService);

  // Este método se ejecuta automáticamente al cargar el componente
  ngOnInit(): void {
    this.loadPosts();
    this.catalogosService.obtenerCarreras().subscribe(res => { if(res.value) this.carrerasTodas = res.value; });
    this.catalogosService.obtenerSectores().subscribe(res => { if(res.value) this.sectoresDisponibles = res.value; });
  }

  buscar() {
    this.loadPosts();
  }

  loadPosts() {
    const cId = this.searchCarreraId ? Number(this.searchCarreraId) : undefined;
    const sId = this.searchSectorId ? Number(this.searchSectorId) : undefined;
    
    this.ofertaLaboralService.lista(this.searchKeyword, cId, sId).subscribe({
      next: (res) => {
        if (res.status) {
          console.log("Ofertas cargadas:", res.value);
          this.ofertasOriginales = res.value;
          this.extraerCarrerasDisponibles();
          this.filtrar('Todas');
        }
      },
      error: (err) => {
        console.error("Error al cargar las ofertas", err);
      }
    });
  }

  extraerCarrerasDisponibles() {
    const carrerasSet = new Set<string>();
    this.ofertasOriginales.forEach(oferta => {
      if (oferta.carreras && oferta.carreras.length > 0) {
        oferta.carreras.forEach(c => carrerasSet.add(c));
      }
    });
    this.carrerasDisponibles = Array.from(carrerasSet).sort();
  }

  private router = inject(Router);

  filtrar(filtro: string) {
    this.filtroActivo = filtro;
    if (filtro === 'Todas') {
      this.ofertas = [...this.ofertasOriginales];
    } else {
      this.ofertas = this.ofertasOriginales.filter(o => 
        o.carreras && o.carreras.includes(filtro)
      );
    }
  }

  filtrarPorPasantia() {
    this.filtroActivo = 'Pasantías';
    this.ofertas = this.ofertasOriginales.filter(o => 
      (o.tipoContratoNombre && o.tipoContratoNombre.toLowerCase().includes('pasantia')) ||
      (o.modalidadNombre && o.modalidadNombre.toLowerCase().includes('pasantía'))
    );
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