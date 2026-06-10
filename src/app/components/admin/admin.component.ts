import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/Admin/admin.service';
import { AdminDashboardStatsDTO, UsuarioDTO, AdminEmpresaDTO, AuditLogDTO } from '../../models/Admin/admin';
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
  activeTab: 'dashboard' | 'usuarios' | 'empresas' | 'ofertas' | 'catalogos' | 'auditoria' = 'dashboard';

  // Loading States
  loadingStats: boolean = false;
  loadingUsers: boolean = false;
  loadingCompanies: boolean = false;
  loadingJobs: boolean = false;
  loadingAuditoria: boolean = false;

  // Error Messages
  errorMsg: string | null = null;

  // Data
  stats: AdminDashboardStatsDTO | null = null;
  users: UsuarioDTO[] = [];
  companies: AdminEmpresaDTO[] = [];
  jobPosts: OfertaLaboral[] = [];
  auditLogs: AuditLogDTO[] = [];

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

  // Audit Log expanded row
  expandedLogId: number | null = null;

  // Reportes Modals State
  showReportesCandidatosModal: boolean = false;
  showReportesEmpresasModal: boolean = false;
  
  // Filtros Candidatos
  filtroCandFechaInicio: string = '';
  filtroCandFechaFin: string = '';
  filtroCandCarreraId: string = '';
  filtroCandDepartamento: string = '';
  filtroCandEstado: string = '';

  // Filtros Empresas
  filtroEmpFechaInicio: string = '';
  filtroEmpFechaFin: string = '';
  filtroEmpSectorId: string = '';

  departamentosSV = [
    'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
    'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
    'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
  ];

  // Human-readable field name map
  private fieldLabels: Record<string, string> = {
    Nombre: 'Nombre',
    Titulo: 'Título',
    Descripcion: 'Descripción',
    Activo: 'Estado activo',
    Email: 'Correo',
    PasswordHash: 'Contraseña',
    RolId: 'Rol',
    FechaPublicacion: 'Fecha publicación',
    FechaExpiracion: 'Fecha expiración',
    Salario: 'Salario',
    Ubicacion: 'Ubicación',
    ModalidadId: 'Modalidad',
    NombreComercial: 'Nombre comercial',
    NombreCompleto: 'Nombre completo',
    Telefono: 'Teléfono',
    DireccionWeb: 'Sitio web',
    BuscaEmpleo: 'Busca empleo',
    SobreMi: 'Sobre mí',
    FotoUrl: 'Foto URL',
    EnlaceGitHub: 'GitHub',
    EnlaceLinkedIn: 'LinkedIn',
    CarreraId: 'Carrera',
    SectorId: 'Sector',
    EsObligatorio: 'Es obligatorio',
  };

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadCompanies();
    this.loadJobPosts();
    this.loadCatalogData();
    this.loadAuditLogs();
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

  loadAuditLogs(): void {
    this.loadingAuditoria = true;
    this.adminService.getAuditLogs().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          this.auditLogs = res.value;
        } else {
          this.errorMsg = res.msg || 'No se pudo cargar el registro de auditoría.';
        }
        this.loadingAuditoria = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al conectar con el servidor para auditoría.';
        this.loadingAuditoria = false;
      }
    });
  }

  toggleLogDetail(id: number): void {
    this.expandedLogId = this.expandedLogId === id ? null : id;
  }

  parseJson(json: string | null | undefined): Record<string, any> {
    if (!json) return {};
    try { return JSON.parse(json); } catch { return {}; }
  }

  getDiffEntries(log: AuditLogDTO): { campo: string; antes: any; despues: any }[] {
    const antiguo = this.parseJson(log.valoresAntiguos);
    const nuevo = this.parseJson(log.valoresNuevos);
    const keys = new Set([...Object.keys(antiguo), ...Object.keys(nuevo)]);
    const entries: { campo: string; antes: any; despues: any }[] = [];
    keys.forEach(k => {
      const antes = antiguo[k];
      const despues = nuevo[k];
      if (JSON.stringify(antes) !== JSON.stringify(despues)) {
        entries.push({ campo: this.fieldLabels[k] ?? k, antes, despues });
      }
    });
    return entries;
  }

  getValueEntries(json: string | null | undefined): { campo: string; valor: any }[] {
    const obj = this.parseJson(json);
    return Object.entries(obj)
      .filter(([k]) => !['Id', 'FechaCreacion', 'FechaModificacion', 'UsuarioCreacionId', 'UsuarioModificacionId'].includes(k))
      .map(([k, v]) => ({ campo: this.fieldLabels[k] ?? k, valor: v }));
  }

  formatAuditValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleString('es-SV');
    }
    return String(value);
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

  // --- Reportes Helpers ---
  openReporteCandidatosModal(): void {
    this.showReportesCandidatosModal = true;
    this.filtroCandFechaInicio = '';
    this.filtroCandFechaFin = '';
    this.filtroCandCarreraId = '';
    this.filtroCandDepartamento = '';
    this.filtroCandEstado = '';
    if (this.carreras.length === 0) {
      this.catalogosService.obtenerCarreras().subscribe(res => { if (res.value) this.carreras = res.value; });
    }
  }

  closeReporteCandidatosModal(): void {
    this.showReportesCandidatosModal = false;
  }

  descargarReporteCandidatos(): void {
    const params: any = {};
    if (this.filtroCandFechaInicio) params.fechaInicio = this.filtroCandFechaInicio;
    if (this.filtroCandFechaFin) params.fechaFin = this.filtroCandFechaFin;
    if (this.filtroCandCarreraId) params.carreraId = this.filtroCandCarreraId;
    if (this.filtroCandDepartamento) params.departamento = this.filtroCandDepartamento;
    if (this.filtroCandEstado) params.estado = this.filtroCandEstado;

    this.adminService.getReporteCandidatos(params).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Candidatos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.closeReporteCandidatosModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error al generar el reporte de candidatos.');
      }
    });
  }

  openReporteEmpresasModal(): void {
    this.showReportesEmpresasModal = true;
    this.filtroEmpFechaInicio = '';
    this.filtroEmpFechaFin = '';
    this.filtroEmpSectorId = '';
    if (this.sectores.length === 0) {
      this.catalogosService.obtenerSectores().subscribe(res => { if (res.value) this.sectores = res.value; });
    }
  }

  closeReporteEmpresasModal(): void {
    this.showReportesEmpresasModal = false;
  }

  descargarReporteEmpresas(): void {
    const params: any = {};
    if (this.filtroEmpFechaInicio) params.fechaInicio = this.filtroEmpFechaInicio;
    if (this.filtroEmpFechaFin) params.fechaFin = this.filtroEmpFechaFin;
    if (this.filtroEmpSectorId) params.sectorId = this.filtroEmpSectorId;

    this.adminService.getReporteEmpresas(params).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Empresas_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.closeReporteEmpresasModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error al generar el reporte de empresas.');
      }
    });
  }
}
