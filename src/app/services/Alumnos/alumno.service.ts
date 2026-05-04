import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AlumnoActivo , VerificarAlumno , RegistroEstudiante } from '../../models/Alumnos/alumno';
import { ResponseAPI } from '../../models/response-api';
import { Session , Login } from '../../models/Auth/Auth';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + 'Alumno/';

  constructor() { }

  consultar(model: VerificarAlumno): Observable<ResponseAPI<AlumnoActivo>> {
    return this.http.post<ResponseAPI<AlumnoActivo>>(`${this.apiUrl}/consultar`, model);
  }

  registrar(model: RegistroEstudiante): Observable<ResponseAPI<Session>> {
    return this.http.post<ResponseAPI<Session>>(`${this.apiUrl}/registrar`, model);
  }

}
