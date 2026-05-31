import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import {CatalogDTO} from '../../models/Catalog/catalog';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/Catalogo/';

  constructor() { }

  obtenerCarreras(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}carreras`);
  }

  obtenerModalidades(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}modalidades`);
  }

  obtenerNivelesIdioma(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}niveles-idioma`);
  }

  obtenerGradosAcademicos(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}grados-academicos`);
  }

  obtenerEstadosPostulacion(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}estados-postulacion`);
  }

  obtenerDepartamentos(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}departamentos`);
  }

  obtenerMunicipios(departamentoId: number): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}municipios/${departamentoId}`);
  }

  obtenerDistritos(municipioId: number): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}distritos/${municipioId}`);
  }

  obtenerTiposContrato(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}tipos-contrato`);
  }

  obtenerTiposLicencia(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}tipos-licencia`);
  }

  obtenerGeneros(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}generos`);
  }

  obtenerHabilidades(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}habilidades`);
  }

  obtenerSectores(): Observable<ResponseAPI<CatalogDTO[]>> {
    return this.http.get<ResponseAPI<CatalogDTO[]>>(`${this.apiUrl}sectores`);
  }

  // --- CRUD ADMIN ---
  crearHabilidad(dto: CatalogDTO): Observable<ResponseAPI<CatalogDTO>> {
    return this.http.post<ResponseAPI<CatalogDTO>>(`${this.apiUrl}habilidades`, dto);
  }

  eliminarHabilidad(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}habilidades/${id}`);
  }

  crearSector(dto: CatalogDTO): Observable<ResponseAPI<CatalogDTO>> {
    return this.http.post<ResponseAPI<CatalogDTO>>(`${this.apiUrl}sectores`, dto);
  }

  eliminarSector(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}sectores/${id}`);
  }

  crearCarrera(dto: CatalogDTO): Observable<ResponseAPI<CatalogDTO>> {
    return this.http.post<ResponseAPI<CatalogDTO>>(`${this.apiUrl}carreras`, dto);
  }

  eliminarCarrera(id: number): Observable<ResponseAPI<boolean>> {
    return this.http.delete<ResponseAPI<boolean>>(`${this.apiUrl}carreras/${id}`);
  }
}
