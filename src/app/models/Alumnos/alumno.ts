export interface VerificarAlumno {
    carnet: string;
    passwordPortal: string;
}

export interface AlumnoActivo {
    carnet: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fechaNacimiento: string; 
}

export interface RegistroEstudiante {
    carnet: string;
    passwordPortal: string;
    email?: string; 
}