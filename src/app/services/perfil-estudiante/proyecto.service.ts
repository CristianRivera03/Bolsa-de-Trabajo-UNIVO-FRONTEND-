import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { ProyectoEstudianteDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante/Proyectos';

  constructor() { }

  agregarProyecto(dto: ProyectoEstudianteDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(this.apiUrl, dto);
  }

  editarProyecto(id: number, dto: ProyectoEstudianteDTO): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarProyecto(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`);
  }
}