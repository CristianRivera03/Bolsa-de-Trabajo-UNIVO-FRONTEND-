export interface OfertaHabilidad {
  habilidadId: number;
  nombreHabilidad: string;
  esObligatorio: boolean;
}

export interface OfertaLaboral {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos?: string; 
  empresaId: number;
  empresaNombre: string;
  empresaLogoUrl?: string | null; 
  modalidadId: number;
  modalidadNombre: string;
  ubicacion: string;
  salarioMin?: number | null;
  salarioMax?: number | null;
  fechaPublicacion?: string | null; 
  fechaExpiracion?: string | null;  
  activa?: boolean | null;
  vacantes?: number | null;
  edadMin?: number | null;
  edadMax?: number | null;
  tieneVehiculo?: boolean | null;
  licenciaId?: number | null;
  licenciaNombre?: string | null;
  tipoContratoId?: number | null;
  tipoContratoNombre?: string | null;
  distritoId?: number | null;
  distritoNombre?: string | null;
  generoId?: number | null;
  generoNombre?: string | null;
  carreras: string[];
  habilidades?: OfertaHabilidad[];
}

export interface OfertaLaboralCreate {
  empresaId: number;
  titulo: string;
  descripcion: string;
  requisitos: string;
  modalidadId: number;
  ubicacion: string;
  salarioMin?: number | null;
  salarioMax?: number | null;
  fechaExpiracion?: string | null;
  vacantes?: number | null;
  edadMin?: number | null;
  edadMax?: number | null;
  tieneVehiculo?: boolean | null;
  licenciaId?: number | null;
  tipoContratoId?: number | null;
  distritoId?: number | null;
  generoId?: number | null;
  carreraIds: number[]; 
  habilidadIds?: number[];
}

export interface OfertaLaboralUpdate {
  titulo: string;
  descripcion: string;
  modalidadId: number;
  ubicacion: string;
  salarioMin?: number | null;
  salarioMax?: number | null;
  fechaExpiracion?: string | null;
  activa?: boolean | null;
  vacantes?: number | null;
  edadMin?: number | null;
  edadMax?: number | null;
  tieneVehiculo?: boolean | null;
  licenciaId?: number | null;
  tipoContratoId?: number | null;
  distritoId?: number | null;
  generoId?: number | null;
  carreraIds: number[]; 
  habilidadIds?: number[];
}