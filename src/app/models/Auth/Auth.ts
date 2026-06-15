
export interface LoginDTO {
    email: string;
    password: string;
}

export interface SessionDTO {
    usuarioId: number;
    email: string;
    rolName: string;
    nombreCompleto: string;
    token: string;
}

export interface RecuperarPasswordDTO {
    email: string;
}

export interface RestablecerPasswordDTO {
    token: string;
    nuevaPassword: string;
}

export interface CambiarPasswordDTO {
    currentPassword: string;
    newPassword: string;
}