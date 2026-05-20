export interface CreatePostulacionDTO {
  ofertaId: number;
  mensaje: string;
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
  curriculumUrl: string;
}
