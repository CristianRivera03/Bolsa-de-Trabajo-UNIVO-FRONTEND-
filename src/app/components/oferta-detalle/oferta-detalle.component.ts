import { Component, OnInit, inject, ViewChild } from '@angular/core'; 
import { CommonModule, Location } from '@angular/common';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CryptoUtil } from '../../utils/crypto.util';
import { HashService } from '../../services/hash.service';

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
    const session = CryptoUtil.getSession();
    if (!session) return '';
    return session.rolName ?? '';
  }

  get puedeAplicar(): boolean {
    const rolesRestringidos = ['Empresa', 'Administrador'];
    return !rolesRestringidos.includes(this.rolActual);
  }
  private ofertaLaboralService = inject(OfertaLaboralService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private hashService = inject(HashService);
  isLoading = true;

  // 3. CAPTURAR EL MODAL CON VIEWCHILD
  @ViewChild(ModalPostulacionComponent) modalPostulacion!: ModalPostulacionComponent;

  ngOnInit(): void {
    this.loadOferta();
  }

  loadOferta() {
    const hashId = this.route.snapshot.paramMap.get('id');
    if (hashId) {
      const realId = this.hashService.decode(hashId);
      if (!realId) {
        this.isLoading = false;
        // Opcional: Redirigir a 404 o Home si el ID es inválido
        return;
      }
      this.ofertaLaboralService.obtenerPorId(realId).subscribe({
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

  getEmpresaHash(id: number): string {
    return this.hashService.encode(id);
  }
}