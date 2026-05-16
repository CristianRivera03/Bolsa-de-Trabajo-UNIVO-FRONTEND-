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
  municipioId?: number | null;
  municipioNombre?: string | null;
  generoId?: number | null;
  generoNombre?: string | null;
  carreras: string[];
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
  municipioId?: number | null;
  generoId?: number | null;
  carreraIds: number[]; 
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
  municipioId?: number | null;
  generoId?: number | null;
  carreraIds: number[]; 
}