import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule, Location } from '@angular/common';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-oferta-detalle',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './oferta-detalle.component.html'
})
export class OfertaDetalleComponent implements OnInit {

  //Inicializacion de variables
  oferta: OfertaLaboral | null = null;
  private ofertaLaboralService = inject(OfertaLaboralService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  isLoading = true;

  

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
    this.location.back(); // Regresa a la página anterior en el historial del navegador
  }

  aplicar() {
    console.log(`Aplicando a la oferta ID: ${this.oferta?.id}`);
  }

}
