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
