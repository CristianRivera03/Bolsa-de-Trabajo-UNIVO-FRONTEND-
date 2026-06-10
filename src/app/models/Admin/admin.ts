export interface AdminDashboardStatsDTO {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  totalEmpresas: number;
  empresasActivas: number;
  empresasInactivas: number;
  totalOfertas: number;
  ofertasActivas: number;
  ofertasInactivas: number;
  totalPostulaciones: number;
}

export interface UsuarioDTO {
  id: number;
  email: string;
  rolName: string;
  activo: boolean;
  fechaRegistro?: string;
}

export interface AdminEmpresaDTO {
  id: number;
  usuarioId: number;
  nombreComercial: string;
  razonSocial?: string;
  nit?: string;
  email: string;
  activo: boolean;
  fechaRegistro?: string;
}

export interface AuditLogDTO {
  id: number;
  nombreTabla: string;
  accion: string;
  registroId: string;
  valoresAntiguos: string;
  valoresNuevos: string;
  fecha: string;
  usuarioId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogFilterDTO {
  pageNumber?: number;
  pageSize?: number;
  tabla?: string;
  accion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
