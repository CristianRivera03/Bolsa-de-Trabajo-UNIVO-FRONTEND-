export interface ContactoEmpresaDTO {
  id?: number | null;
  nombreCompleto: string;
  cargo: string;
  dui: string;
  telefonoMovil: string;
  correoContacto: string;
}

// DTO Principal de Lectura
export interface EmpresaDTO {
  id: number;
  usuarioId: number;
  nombreComercial: string;
  sector: string;
  descripcion?: string;
  sitioWeb?: string;
  logoUrl?: string;

  razonSocial?: string;
  nit?: string;
  direccion?: string;
  telefonoFijo?: string;
  correoInstitucional?: string;
  facebook?: string;
  twitter?: string;

  // Navegación al contacto comercial
  contacto?: ContactoEmpresaDTO;
}

//  DTO de Registro (Pantalla de "Crear Cuenta")
export interface EmpresaCreateDTO {
  email: string;
  password: string;
  nombreComercial: string;
  sector: string;
  descripcion?: string;
  sitioWeb?: string;
}

// DTO de Actualización
export interface EmpresaUpdateDTO {
  nombreComercial: string;
  sector: string;
  descripcion?: string;
  sitioWeb?: string;
  logoUrl?: string;

  razonSocial?: string;
  nit?: string;
  direccion?: string;
  telefonoFijo?: string;
  correoInstitucional?: string;
  facebook?: string;
  twitter?: string;

  contacto?: ContactoEmpresaDTO;
}