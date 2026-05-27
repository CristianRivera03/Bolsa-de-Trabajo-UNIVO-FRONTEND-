export interface CreatePostulacionDTO {
  ofertaId: number;
  mensaje: string;
}

export interface EstudianteHabilidad {
  habilidadId: number;
  nombreHabilidad: string;
  nivelDominio: number;
}

export interface PostulacionDTO {
  id: number;
  ofertaId: number;
  ofertaTitulo: string;
  empresaNombre: string;
  perfilId: number;
  estudianteNombreCompleto: string;
  fechaPostulacion: string;
  estadoNombre: string;
  mensaje: string;
  estudianteFotoUrl?: string;
  empresaLogoUrl?: string;
  estudianteHabilidades?: EstudianteHabilidad[];
}
