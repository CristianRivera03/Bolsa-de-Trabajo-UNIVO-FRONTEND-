import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { EducacionDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante/Educacion';

  constructor() { }


  agregarEducacion(dto: EducacionDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(this.apiUrl, dto);
  }

  editarEducacion(id: number, dto: EducacionDTO): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarEducacion(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`);
  }
}