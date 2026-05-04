
export interface Login {
    email: string;
    password: string;
}

export interface Session {
    usuarioId: number;
    email: string;
    rolName: string;
    token: string;
}