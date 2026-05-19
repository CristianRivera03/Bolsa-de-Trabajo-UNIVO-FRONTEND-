export interface PerfilEstudianteDTO {
    id: number;
    usuarioId: number;
    nombres: string;
    apellidos: string;
    telefono?: string;
    direccion?: string;
    sobreMi?: string;
    fotoUrl?: string;
    enlaceGitHub?: string;
    enlaceLinkedIn?: string;
    carreraId?: number;
    carreraNombre?: string;
    buscaEmpleo: boolean;
    educaciones: any[];
    experienciasLaborales: any[];
    habilidades: any[];
    idiomas: any[];
}

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
