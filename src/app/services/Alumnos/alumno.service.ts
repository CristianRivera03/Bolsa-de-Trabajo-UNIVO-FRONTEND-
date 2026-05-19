import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AlumnoActivo , VerificarAlumno , RegistroEstudiante } from '../../models/Alumnos/alumno';
import { ResponseAPI } from '../../models/response-api';
import { SessionDTO  } from '../../models/Auth/Auth';
import { PerfilEstudianteDTO, PerfilEstudianteUpdateDTO } from '../../models/Alumnos/perfil-estudiante';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/Alumno/';

  constructor() { }

  consultar(model: VerificarAlumno): Observable<ResponseAPI<AlumnoActivo>> {
    return this.http.post<ResponseAPI<AlumnoActivo>>(`${this.apiUrl}consultar`, model);
  }

  registrar(model: RegistroEstudiante): Observable<ResponseAPI<SessionDTO>> {
    return this.http.post<ResponseAPI<SessionDTO>>(`${this.apiUrl}registrar`, model);
  }

  getMiPerfil(): Observable<ResponseAPI<PerfilEstudianteDTO>> {
    return this.http.get<ResponseAPI<PerfilEstudianteDTO>>(`${this.apiUrl}`);
  }

  updateMiPerfil(dto: PerfilEstudianteUpdateDTO): Observable<ResponseAPI<PerfilEstudianteDTO>> {
    return this.http.put<ResponseAPI<PerfilEstudianteDTO>>(`${this.apiUrl}`, dto);
  }

  cambiarFoto(formData: FormData): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}/CambiarFoto`, formData);
  }

}
