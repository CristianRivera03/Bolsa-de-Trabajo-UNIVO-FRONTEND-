import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { EstudianteIdiomaDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/PerfilEstudiante/Idiomas';

  constructor() { }


  agregarIdioma(dto: EstudianteIdiomaDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(this.apiUrl, dto);
  }


  editarIdioma(id: number, dto: EstudianteIdiomaDTO): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`, dto);
  }

 
  eliminarIdioma(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}/${id}`);
  }
}