import { Injectable } from '@angular/core';
import Hashids from 'hashids';

@Injectable({
  providedIn: 'root'
})
export class HashService {
  // Configuración del Hash (Salt secreto, longitud mínima y alfabeto permitido opcional)
  private hashids = new Hashids('PortalTrabajo_Secreto_2026_UNIVO', 6);

  constructor() { }

  /**
   * Encripta un ID numérico a un string corto y único
   */
  encode(id: number | string): string {
    const num = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(num)) return String(id);
    return this.hashids.encode(num);
  }

  /**
   * Desencripta el string hash devuelta a su número ID original
   */
  decode(hash: string): number | null {
    if (!hash) return null;
    const numbers = this.hashids.decode(hash);
    if (numbers && numbers.length > 0) {
      return Number(numbers[0]);
    }
    return null;
  }
}
