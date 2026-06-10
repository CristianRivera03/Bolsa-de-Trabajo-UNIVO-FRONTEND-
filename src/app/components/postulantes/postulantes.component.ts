import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { PostulacionService } from '../../services/OfertasLaborales/postulacion.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { PostulacionDTO } from '../../models/OfertasLaborales/postulacion';

@Component({
  selector: 'app-postulantes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './postulantes.component.html'
})
export class PostulantesComponent implements OnInit {
  private ofertaService = inject(OfertaLaboralService);
  private postulacionService = inject(PostulacionService);

  ofertas: OfertaLaboral[] = [];
  isLoadingOfertas = true;
  expandedOfertas = new Set<number>();
  
  // Mapea el ID de la oferta a su lista de postulantes y estado de carga
  postulantesMap: { [ofertaId: number]: { data: PostulacionDTO[]; loading: boolean; error: boolean } } = {};
  
  // Track de descarga de CVs por perfilId
  loadingCvs: { [perfilId: number]: boolean } = {};

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.isLoadingOfertas = true;
    this.ofertaService.obtenerMisOfertas().subscribe({
      next: (res) => {
        if (res.status) {
          this.ofertas = res.value;
          // Inicializar el mapa de postulantes para cada oferta
          this.ofertas.forEach(o => {
            this.postulantesMap[o.id] = { data: [], loading: false, error: false };
          });
        }
        this.isLoadingOfertas = false;
      },
      error: (err) => {
        console.error('Error al cargar ofertas de la empresa:', err);
        this.isLoadingOfertas = false;
      }
    });
  }

  toggleOferta(ofertaId: number) {
    if (this.expandedOfertas.has(ofertaId)) {
      this.expandedOfertas.delete(ofertaId);
    } else {
      this.expandedOfertas.add(ofertaId);
      // Cargar postulantes solo si no se han cargado previamente o si hubo error
      const estadoPostulantes = this.postulantesMap[ofertaId];
      if (!estadoPostulantes || estadoPostulantes.data.length === 0 || estadoPostulantes.error) {
        this.cargarPostulantesDeOferta(ofertaId);
      }
    }
  }

  cargarPostulantesDeOferta(ofertaId: number) {
    this.postulantesMap[ofertaId] = { data: [], loading: true, error: false };
    
    this.postulacionService.obtenerPostulacionesPorOferta(ofertaId).subscribe({
      next: (res) => {
        if (res.status) {
          this.postulantesMap[ofertaId] = {
            data: res.value,
            loading: false,
            error: false
          };
        } else {
          this.postulantesMap[ofertaId] = {
            data: [],
            loading: false,
            error: true
          };
        }
      },
      error: (err) => {
        console.error(`Error al cargar postulantes de la oferta ${ofertaId}:`, err);
        this.postulantesMap[ofertaId] = {
          data: [],
          loading: false,
          error: true
        };
      }
    });
  }

  descargarCV(perfilId: number, nombreEstudiante: string) {
    this.loadingCvs[perfilId] = true;
    
    this.postulacionService.descargarCV(perfilId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${nombreEstudiante.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loadingCvs[perfilId] = false;
      },
      error: (err) => {
        console.error(`Error al descargar CV del estudiante ${perfilId}:`, err);
        alert('Ocurrió un error al descargar el currículum del estudiante. Es posible que el perfil no contenga suficiente información para generarlo.');
        this.loadingCvs[perfilId] = false;
      }
    });
  }

  tieneHabilidad(postulante: PostulacionDTO, habilidadId: number): boolean {
    if (!postulante.estudianteHabilidades) return false;
    return postulante.estudianteHabilidades.some(eh => eh.habilidadId === habilidadId);
  }

  obtenerMatchHabilidades(postulante: PostulacionDTO, oferta: OfertaLaboral) {
    const requiredSkills = oferta.habilidades || [];
    if (requiredSkills.length === 0) {
      return { matchCount: 0, totalCount: 0, percentage: 100, colorClass: 'text-success bg-success/10 border-success/20' };
    }

    const studentSkillIds = new Set((postulante.estudianteHabilidades || []).map(eh => eh.habilidadId));
    let matchCount = 0;
    
    requiredSkills.forEach(rs => {
      if (studentSkillIds.has(rs.habilidadId)) {
        matchCount++;
      }
    });

    const percentage = Math.round((matchCount / requiredSkills.length) * 100);
    
    let colorClass = 'text-error bg-error/10 border-error/20';
    if (percentage >= 80) {
      colorClass = 'text-success bg-success/10 border-success/20';
    } else if (percentage >= 50) {
      colorClass = 'text-warning bg-warning/10 border-warning/20';
    }

    return {
      matchCount,
      totalCount: requiredSkills.length,
      percentage,
      colorClass
    };
  }

  obtenerColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'recibida':
        return 'badge-info bg-info/10 text-info border-none';
      case 'en revisión':
      case 'en revision':
        return 'badge-warning bg-warning/10 text-warning border-none';
      case 'entrevista':
      case 'entrevista programada':
        return 'badge-primary bg-primary/10 text-primary border-none';
      case 'seleccionado':
        return 'badge-success bg-success/10 text-success border-none';
      case 'descartado':
      case 'no seleccionado':
        return 'badge-error bg-error/10 text-error border-none';
      default:
        return 'badge-ghost';
    }
  }

  estadosDisponibles = [
    { id: 1, nombre: 'Recibida' },
    { id: 2, nombre: 'En revisión' },
    { id: 3, nombre: 'Entrevista' },
    { id: 4, nombre: 'Seleccionado' },
    { id: 5, nombre: 'Descartado' }
  ];

  obtenerEstadoId(nombre: string): number {
    const estado = this.estadosDisponibles.find(e => e.nombre.toLowerCase() === nombre.toLowerCase() ||
      (e.id === 5 && nombre.toLowerCase() === 'no seleccionado') ||
      (e.id === 3 && nombre.toLowerCase() === 'entrevista programada') ||
      (e.id === 2 && nombre.toLowerCase() === 'en revision')
    );
    return estado ? estado.id : 1;
  }

  actualizarEstado(postulante: PostulacionDTO, nuevoEstadoIdStr: string) {
    const nuevoEstadoId = parseInt(nuevoEstadoIdStr, 10);
    this.postulacionService.cambiarEstadoPostulacion(postulante.id, nuevoEstadoId).subscribe({
      next: (res) => {
        if (res.status) {
          const estadoObj = this.estadosDisponibles.find(e => e.id === nuevoEstadoId);
          if (estadoObj) {
            postulante.estadoNombre = estadoObj.nombre;
          }
          alert('Estado actualizado y estudiante notificado exitosamente.');
        } else {
          alert('No se pudo actualizar el estado.');
        }
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('Ocurrió un error al cambiar el estado.');
      }
    });
  }
}
