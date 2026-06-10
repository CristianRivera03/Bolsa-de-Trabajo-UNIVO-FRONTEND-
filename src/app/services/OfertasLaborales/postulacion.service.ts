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

  obtenerPostulacionesPorOferta(ofertaId: number): Observable<ResponseAPI<PostulacionDTO[]>> {
    return this.http.get<ResponseAPI<PostulacionDTO[]>>(`${this.apiUrl}Oferta/${ofertaId}`);
  }

  descargarCV(perfilId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}CV/${perfilId}`, { responseType: 'blob' });
  }

  cambiarEstadoPostulacion(id: number, nuevoEstadoId: number): Observable<ResponseAPI<boolean>> {
    return this.http.put<ResponseAPI<boolean>>(`${this.apiUrl}${id}/Estado`, nuevoEstadoId);
  }
}
