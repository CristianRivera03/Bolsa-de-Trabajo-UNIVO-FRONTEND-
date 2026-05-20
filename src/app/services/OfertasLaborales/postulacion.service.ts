import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../../models/response-api';
import { CreatePostulacionDTO, PostulacionDTO } from '../../models/OfertasLaborales/postulacion';


@Injectable({
  providedIn: 'root'
})
export class PostulacionService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/Postulacion/';

  constructor() { }


  aplicarOferta(dto: CreatePostulacionDTO): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(`${this.apiUrl}Aplicar`, dto);
  }

  obtenerMisPostulaciones(): Observable<ResponseAPI<PostulacionDTO[]>> {
    return this.http.get<ResponseAPI<PostulacionDTO[]>>(`${this.apiUrl}MisPostulaciones`);
  }
}
