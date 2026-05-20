import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { PerfilEstudianteDTO, PerfilEstudianteUpdateDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class PerfilEstudianteService {
  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante';

  getMiPerfil(): Observable<ResponseAPI<PerfilEstudianteDTO>> {
    return this.http.get<ResponseAPI<PerfilEstudianteDTO>>(`${this.apiUrl}`);
  }

  updateMiPerfil(dto: PerfilEstudianteUpdateDTO): Observable<ResponseAPI<PerfilEstudianteDTO>> {
    return this.http.patch<ResponseAPI<PerfilEstudianteDTO>>(`${this.apiUrl}`, dto);
  }

  cambiarFoto(formData: FormData): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}/CambiarFoto`, formData);
  }

  descargarCV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/GenerarCV`, { responseType: 'blob' });
  }
}
