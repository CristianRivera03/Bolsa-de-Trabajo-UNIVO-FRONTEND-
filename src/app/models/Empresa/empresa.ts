export interface EmpresaDTO {
  id: number;
  usuarioId: number;
  nombreComercial: string;
  sector: string;
  sitioWeb?: string; 
  logoUrl?: string;
}

export interface EmpresaCreateDTO {
  email: string;
  password: string;
  nombreComercial: string;
  sector: string;
  sitioWeb?: string;
}

export interface EmpresaUpdateDTO {
  nombreComercial: string;
  sector: string;
  sitioWeb?: string;
  logoUrl?: string;
}
