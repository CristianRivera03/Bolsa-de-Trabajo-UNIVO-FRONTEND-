export interface VerificarAlumno {
    carnet: string;
    passwordPortal: string;
}

export interface AlumnoActivo {
    carnet: string;
    nombres: string;
    apellidos: string;
    genero: string;
    fechaNacimiento: string; // En TypeScript, DateOnly se maneja usualmente como string (ISO 8601) o Date
}

export interface RegistroEstudiante {
    carnet: string;
    passwordPortal: string;
    email?: string; // Opcional, como mencionaste en el comentario del DTO
}