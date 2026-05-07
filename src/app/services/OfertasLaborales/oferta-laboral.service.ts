import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../../models/response-api';
import { OfertaLaboral, OfertaLaboralUpdate, OfertaLaboralCreate } from '../../models/OfertasLaborales/oferta-laboral';

@Injectable({
  providedIn: 'root'
})
export class OfertaLaboralService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + 'OfertaLaboral/';

  constructor() { }

  lista(): Observable<ResponseAPI<OfertaLaboral[]>> {
    return this.http.get<ResponseAPI<OfertaLaboral[]>>(`${this.apiUrl}lista`);
  }


  crear(model : OfertaLaboralCreate): Observable<ResponseAPI<OfertaLaboral>> {
    return this.http.post<ResponseAPI<OfertaLaboral>>(`${this.apiUrl}crear`, model);
  }
}
