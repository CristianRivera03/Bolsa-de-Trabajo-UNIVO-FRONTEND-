
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