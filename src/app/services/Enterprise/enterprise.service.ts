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
}
