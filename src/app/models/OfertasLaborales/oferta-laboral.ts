export interface OfertaLaboral {
  id: number;
  titulo: string;
  descripcion: string;
  empresaId: number;
  empresaNombre: string;
  empresaLogoUrl: string;
  modalidadId: number;
  modalidadNombre: string;
  ubicacion: string;
  salarioMin?: number;
  salarioMax?: number;
  fechaPublicacion?: Date;
  fechaExpiracion?: Date;
  activa?: boolean;
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
}