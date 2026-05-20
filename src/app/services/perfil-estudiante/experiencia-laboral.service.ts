import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { EducacionDTO, ExperienciaLaboralDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaLaboralService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante/Experiencia';

  constructor() { }

  agregarExperienciaLaboral(dto: ExperienciaLaboralDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(this.apiUrl, dto);
  }

  editarExperienciaLaboral(id: number, dto: ExperienciaLaboralDTO): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarExperienciaLaboral  (id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`);
  }
}