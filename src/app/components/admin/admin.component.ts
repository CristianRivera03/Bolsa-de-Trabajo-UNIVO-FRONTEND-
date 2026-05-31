import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/Admin/admin.service';
import { AdminDashboardStatsDTO, UsuarioDTO, AdminEmpresaDTO } from '../../models/Admin/admin';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { CatalogDTO } from '../../models/Catalog/catalog';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: []
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private catalogosService = inject(CatalogosService);

  // Active Tab
  activeTab: 'dashboard' | 'usuarios' | 'empresas' | 'ofertas' | 'catalogos' = 'dashboard';

  // Loading States
  loadingStats: boolean = false;
  loadingUsers: boolean = false;
  loadingCompanies: boolean = false;
  loadingJobs: boolean = false;

  // Error Messages
  errorMsg: string | null = null;

  // Data
  stats: AdminDashboardStatsDTO | null = null;
  users: UsuarioDTO[] = [];
  companies: AdminEmpresaDTO[] = [];
  jobPosts: OfertaLaboral[] = [];

  // Filtered Data
  filteredUsers: UsuarioDTO[] = [];
  filteredCompanies: AdminEmpresaDTO[] = [];
  filteredJobs: OfertaLaboral[] = [];

  // Search Queries
  userSearch: string = '';
  companySearch: string = '';
  jobSearch: string = '';

  // Confirmation Modal State
  showConfirmModal: boolean = false;
  confirmTitle: string = '';
  confirmMessage: string = '';
  pendingAction: (() => void) | null = null;

  // Catalogs
  activeCatalogTab: 'habilidades' | 'sectores' | 'carreras' = 'habilidades';
  habilidades: CatalogDTO[] = [];
  sectores: CatalogDTO[] = [];
  carreras: CatalogDTO[] = [];
  loadingCatalog: boolean = false;
  newCatalogName: string = '';

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadCompanies();
    this.loadJobPosts();
    this.loadCatalogData();
  }

  // --- Data Loading ---
  loadStats(): void {
    this.loadingStats = true;
    this.adminService.getStats().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.stats = res.value;
        } else {
          this.errorMsg = res.msg || 'No se pudieron cargar las estadísticas.';
        }
        this.loadingStats = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al conectar con el servidor para estadísticas.';
        this.loadingStats = false;
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.users = res.value;
          this.applyUserFilter();
        }
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingUsers = false;
      }
    });
  }

  loadCompanies(): void {
    this.loadingCompanies = true;
    this.adminService.getCompanies().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.companies = res.value;
          this.applyCompanyFilter();
        }
        this.loadingCompanies = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingCompanies = false;
      }
    });
  }

  loadJobPosts(): void {
    this.loadingJobs = true;
    this.adminService.getJobPosts().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.jobPosts = res.value;
          this.applyJobFilter();
        }
        this.loadingJobs = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingJobs = false;
      }
    });
  }

  // --- Catalogs Logic ---
  loadCatalogData(): void {
    this.loadingCatalog = true;
    if (this.activeCatalogTab === 'habilidades') {
      this.catalogosService.obtenerHabilidades().subscribe({
        next: (res) => { this.habilidades = res.value || []; this.loadingCatalog = false; },
        error: () => this.loadingCatalog = false
      });
    } else if (this.activeCatalogTab === 'sectores') {
      this.catalogosService.obtenerSectores().subscribe({
        next: (res) => { this.sectores = res.value || []; this.loadingCatalog = false; },
        error: () => this.loadingCatalog = false
      });
    } else if (this.activeCatalogTab === 'carreras') {
      this.catalogosService.obtenerCarreras().subscribe({
        next: (res) => { this.carreras = res.value || []; this.loadingCatalog = false; },
        error: () => this.loadingCatalog = false
      });
    }
  }

  setCatalogTab(tab: 'habilidades' | 'sectores' | 'carreras'): void {
    this.activeCatalogTab = tab;
    this.newCatalogName = '';
    this.loadCatalogData();
  }

  addCatalogItem(): void {
    if (!this.newCatalogName.trim()) return;
    const dto: CatalogDTO = { id: 0, nombre: this.newCatalogName.trim() };
    this.loadingCatalog = true;

    const action = 
      this.activeCatalogTab === 'habilidades' ? this.catalogosService.crearHabilidad(dto) :
      this.activeCatalogTab === 'sectores' ? this.catalogosService.crearSector(dto) :
      this.catalogosService.crearCarrera(dto);

    action.subscribe({
      next: (res) => {
        if (res.status) {
          this.newCatalogName = '';
          this.loadCatalogData();
        } else {
          alert(res.msg);
          this.loadingCatalog = false;
        }
      },
      error: (err) => { console.error(err); this.loadingCatalog = false; }
    });
  }

  deleteCatalogItem(id: number, nombre: string): void {
    this.openConfirmModal('Eliminar Elemento', `¿Está seguro de que desea eliminar "${nombre}"?`, () => {
      this.loadingCatalog = true;
      const action = 
        this.activeCatalogTab === 'habilidades' ? this.catalogosService.eliminarHabilidad(id) :
        this.activeCatalogTab === 'sectores' ? this.catalogosService.eliminarSector(id) :
        this.catalogosService.eliminarCarrera(id);

      action.subscribe({
        next: (res) => {
          if (res.status) {
            this.loadCatalogData();
          } else {
            alert(res.msg);
            this.loadingCatalog = false;
          }
        },
        error: (err) => { console.error(err); this.loadingCatalog = false; }
      });
    });
  }

  // --- Filtering Logic ---
  applyUserFilter(): void {
    const q = this.userSearch.toLowerCase().trim();
    if (!q) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(u => 
        u.email.toLowerCase().includes(q) || 
        u.rolName.toLowerCase().includes(q)
      );
    }
  }

  applyCompanyFilter(): void {
    const q = this.companySearch.toLowerCase().trim();
    if (!q) {
      this.filteredCompanies = [...this.companies];
    } else {
      this.filteredCompanies = this.companies.filter(c => 
        c.nombreComercial.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.razonSocial && c.razonSocial.toLowerCase().includes(q))
      );
    }
  }

  applyJobFilter(): void {
    const q = this.jobSearch.toLowerCase().trim();
    if (!q) {
      this.filteredJobs = [...this.jobPosts];
    } else {
      this.filteredJobs = this.jobPosts.filter(j => 
        j.titulo.toLowerCase().includes(q) || 
        j.empresaNombre.toLowerCase().includes(q) || 
        j.ubicacion.toLowerCase().includes(q)
      );
    }
  }

  // --- Action Handlers with Modal Confirmation ---
  confirmToggleUser(user: UsuarioDTO): void {
    const nextState = !user.activo;
    const actionText = nextState ? 'activar' : 'desactivar';
    const msg = `¿Está seguro de que desea ${actionText} la cuenta del usuario "${user.email}"?`;
    
    this.openConfirmModal(
      `Confirmar ${actionText.toUpperCase()}`,
      msg,
      () => {
        this.adminService.toggleUser(user.id, nextState).subscribe({
          next: (res) => {
            if (res.status) {
              user.activo = nextState;
              this.loadStats(); // Update dashboard counts
            } else {
              alert(res.msg || 'No se pudo actualizar el usuario.');
            }
          },
          error: (err) => {
            console.error(err);
            alert('Error de conexión al actualizar el usuario.');
          }
        });
      }
    );
  }

  confirmToggleCompany(company: AdminEmpresaDTO): void {
    const nextState = !company.activo;
    const actionText = nextState ? 'activar' : 'desactivar';
    const msg = nextState 
      ? `¿Está seguro de que desea activar la empresa "${company.nombreComercial}"? Esto permitirá a sus reclutadores volver a iniciar sesión.`
      : `¿Está seguro de que desea desactivar la empresa "${company.nombreComercial}"? ¡ATENCIÓN! Esto desactivará automáticamente todas sus ofertas laborales activas y suspenderá las cuentas asociadas.`;
    
    this.openConfirmModal(
      `Confirmar ${actionText.toUpperCase()}`,
      msg,
      () => {
        this.adminService.toggleCompany(company.id, nextState).subscribe({
          next: (res) => {
            if (res.status) {
              company.activo = nextState;
              this.loadStats(); // Update dashboard counts
              this.loadUsers(); // Users roles or statuses could change
              this.loadJobPosts(); // Jobs will deactivate
            } else {
              alert(res.msg || 'No se pudo actualizar la empresa.');
            }
          },
          error: (err) => {
            console.error(err);
            alert('Error de conexión al actualizar la empresa.');
          }
        });
      }
    );
  }

  confirmToggleJobPost(job: OfertaLaboral): void {
    const nextState = !job.activa;
    const actionText = nextState ? 'activar' : 'desactivar';
    const msg = `¿Está seguro de que desea ${actionText} la oferta de empleo "${job.titulo}" de "${job.empresaNombre}"?`;
    
    this.openConfirmModal(
      `Confirmar ${actionText.toUpperCase()}`,
      msg,
      () => {
        this.adminService.toggleJobPost(job.id, nextState).subscribe({
          next: (res) => {
            if (res.status) {
              job.activa = nextState;
              this.loadStats(); // Update dashboard counts
            } else {
              alert(res.msg || 'No se pudo actualizar la publicación.');
            }
          },
          error: (err) => {
            console.error(err);
            alert('Error de conexión al actualizar la publicación.');
          }
        });
      }
    );
  }

  // --- Modal Helpers ---
  openConfirmModal(title: string, message: string, action: () => void): void {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.pendingAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmTitle = '';
    this.confirmMessage = '';
    this.pendingAction = null;
  }

  executePendingAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.closeConfirmModal();
  }
}
