import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EnterpriseService } from '../../services/Enterprise/enterprise.service';
import { EmpresaDTO } from '../../models/Empresa/empresa';
import { Location } from '@angular/common';
import { HashService } from '../../services/hash.service';

@Component({
  selector: 'app-vista-empresa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vista-empresa.component.html',
  styleUrls: ['./vista-empresa.component.css']
})
export class VistaEmpresaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private enterpriseService = inject(EnterpriseService);
  private location = inject(Location);
  private hashService = inject(HashService);

  empresa: EmpresaDTO | null = null;
  isLoading = true;
  error = '';

  ngOnInit(): void {
    const hashId = this.route.snapshot.paramMap.get('id');
    if (hashId) {
      const id = this.hashService.decode(hashId);
      if (id) {
        this.cargarEmpresa(id);
      } else {
        this.error = 'ID de empresa inválido.';
        this.isLoading = false;
      }
    } else {
      this.error = 'No se especificó una empresa.';
      this.isLoading = false;
    }
  }

  cargarEmpresa(id: number): void {
    this.enterpriseService.getEmpresaById(id).subscribe({
      next: (response) => {
        if (response.status && response.value) {
          this.empresa = response.value;
        } else {
          this.error = response.msg || 'Error al cargar la empresa.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching empresa:', err);
        this.error = 'Ocurrió un error al cargar los datos de la empresa.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
