// 1. Interfaz Principal
export interface PerfilEstudianteDTO {
    id: number;
    usuarioId: number;
    carnet: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fechaNacimiento?: string; 
    telefono?: string;
    direccion?: string;
    sobreMi?: string;
    fotoUrl?: string;
    enlaceGitHub?: string;
    enlaceLinkedIn?: string;
    carreraId?: number;
    carreraNombre?: string;
    buscaEmpleo: boolean;

    //Relaciones
    educaciones: EducacionDTO[];
    experienciasLaborales: ExperienciaLaboralDTO[];
    habilidades: EstudianteHabilidadDTO[];
    idiomas: EstudianteIdiomaDTO[];
    proyectos: ProyectoEstudianteDTO[];
}

// 2. Interfaz de Actualización
export interface PerfilEstudianteUpdateDTO {
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    direccion?: string;
    sobreMi?: string;
    fotoUrl?: string;
    enlaceGitHub?: string;
    enlaceLinkedIn?: string;
    carreraId?: number;
    buscaEmpleo?: boolean;
}

// 3. Sub-Interfaces (Relaciones)
export interface EducacionDTO {
    id: number;
    gradoAcademicoId: number;
    gradoAcademicoNombre: string;
    institucion: string;
    tituloObtenido: string;
    fechaInicio: string; 
    fechaFin?: string;   
    estado: string;
}

export interface ExperienciaLaboralDTO {
    id: number;
    empresa: string;
    cargo: string;
    fechaInicio: string; 
    fechaFin?: string;   
    esTrabajoActual?: boolean;
    descripcionPuesto: string;
}

export interface EstudianteHabilidadDTO {
    habilidadId: number;
    nombreHabilidad: string;
    nivelDominio: number;
}

export interface EstudianteIdiomaDTO {
    id: number;
    idioma: string;
    nivelId: number;
    nivelNombre: string;
}

export interface ProyectoEstudianteDTO {
    id: number;
    nombre: string;
    descripcion: string;
    tecnologiasUsadas: string;
    enlaceRepositorio: string;
    fechaProyecto?: string; // Mapeado de DateOnly?
}