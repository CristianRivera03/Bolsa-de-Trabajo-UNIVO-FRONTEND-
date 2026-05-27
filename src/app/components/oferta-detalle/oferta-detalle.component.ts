import { Component, OnInit, inject, ViewChild } from '@angular/core'; 
import { CommonModule, Location } from '@angular/common';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import {ModalPostulacionComponent} from '../modals/postulacion-modal/postulacion-modal.component'; // <-- Ajusta la ruta a donde guardaste tu modal

@Component({
  selector: 'app-oferta-detalle',
  standalone: true, // Asegúrate de que sea standalone
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    ModalPostulacionComponent // 2. AÑADIR A LOS IMPORTS
  ],
  templateUrl: './oferta-detalle.component.html'
})
export class OfertaDetalleComponent implements OnInit {

  oferta: OfertaLaboral | null = null;

  get rolActual(): string {
    const session = localStorage.getItem('userSession');
    if (!session) return '';
    return JSON.parse(session)?.rolName ?? '';
  }

  get puedeAplicar(): boolean {
    const rolesRestringidos = ['Empresa', 'Administrador'];
    return !rolesRestringidos.includes(this.rolActual);
  }
  private ofertaLaboralService = inject(OfertaLaboralService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  isLoading = true;

  // 3. CAPTURAR EL MODAL CON VIEWCHILD
  @ViewChild(ModalPostulacionComponent) modalPostulacion!: ModalPostulacionComponent;

  ngOnInit(): void {
    this.loadOferta();
  }

  loadOferta() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ofertaLaboralService.obtenerPorId(+id).subscribe({
        next: (res) => {
          if (res.status) {
            this.oferta = res.value;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error al cargar la oferta", err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  volver() {
    this.location.back();
  }

  // 4. ABRIR EL MODAL AL DAR CLIC EN APLICAR
  aplicar() {
    if (this.oferta) {
      this.modalPostulacion.abrir(this.oferta.id, this.oferta.titulo);
    }
  }
}