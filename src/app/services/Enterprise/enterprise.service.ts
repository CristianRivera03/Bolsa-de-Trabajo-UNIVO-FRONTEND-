import { inject , Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseAPI } from '../../models/response-api';
import {EmpresaDTO, EmpresaCreateDTO, EmpresaUpdateDTO} from '../../models/Empresa/empresa';


@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/Empresa/';

  registrar(model: EmpresaCreateDTO): Observable<ResponseAPI<EmpresaDTO>> {
    return this.http.post<ResponseAPI<EmpresaDTO>>(`${this.apiUrl}registrar`, model);
  }

  getMiPerfil(): Observable<ResponseAPI<EmpresaDTO>> {
    return this.http.get<ResponseAPI<EmpresaDTO>>(`${this.apiUrl}MiPerfil`);
  }

  updateMiPerfil(dto: EmpresaUpdateDTO): Observable<ResponseAPI<EmpresaDTO>> {
    return this.http.put<ResponseAPI<EmpresaDTO>>(`${this.apiUrl}MiPerfil`, dto);
  }

  cambiarLogo(formData: FormData): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}CambiarLogo`, formData);
  }
}
