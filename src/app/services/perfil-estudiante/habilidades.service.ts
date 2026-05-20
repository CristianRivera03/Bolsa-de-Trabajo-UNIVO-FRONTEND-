import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { EstudianteHabilidadDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante/Habilidades';

  constructor() { }

 
  agregarHabilidad(dto: EstudianteHabilidadDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(this.apiUrl, dto);
  }


  editarHabilidad(habilidadId: number, dto: EstudianteHabilidadDTO): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}/${habilidadId}`, dto);
  }


  eliminarHabilidad(habilidadId: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}/${habilidadId}`);
  }
}