import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ResponseAPI } from '../../models/response-api';
import { AdminDashboardStatsDTO, UsuarioDTO, AdminEmpresaDTO, AuditLogDTO, PaginatedResponse, AuditLogFilterDTO } from '../../models/Admin/admin';
import { OfertaLaboral } from '../../models/OfertasLaborales/oferta-laboral';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.endpoint + '/Admin/';

  getStats(): Observable<ResponseAPI<AdminDashboardStatsDTO>> {
    return this.http.get<ResponseAPI<AdminDashboardStatsDTO>>(`${this.apiUrl}stats`);
  }

  getUsers(): Observable<ResponseAPI<UsuarioDTO[]>> {
    return this.http.get<ResponseAPI<UsuarioDTO[]>>(`${this.apiUrl}users`);
  }

  toggleUser(id: number, active: boolean): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(`${this.apiUrl}users/${id}/toggle?active=${active}`, {});
  }

  getCompanies(): Observable<ResponseAPI<AdminEmpresaDTO[]>> {
    return this.http.get<ResponseAPI<AdminEmpresaDTO[]>>(`${this.apiUrl}companies`);
  }

  toggleCompany(id: number, active: boolean): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(`${this.apiUrl}companies/${id}/toggle?active=${active}`, {});
  }

  getJobPosts(): Observable<ResponseAPI<OfertaLaboral[]>> {
    return this.http.get<ResponseAPI<OfertaLaboral[]>>(`${this.apiUrl}jobposts`);
  }

  toggleJobPost(id: number, active: boolean): Observable<ResponseAPI<boolean>> {
    return this.http.post<ResponseAPI<boolean>>(`${this.apiUrl}jobposts/${id}/toggle?active=${active}`, {});
  }

  getAuditLogs(filter: AuditLogFilterDTO): Observable<ResponseAPI<PaginatedResponse<AuditLogDTO>>> {
    let params: any = {
      pageNumber: filter.pageNumber || 1,
      pageSize: filter.pageSize || 20
    };
    if (filter.tabla) params.tabla = filter.tabla;
    if (filter.accion) params.accion = filter.accion;
    if (filter.fechaInicio) params.fechaInicio = filter.fechaInicio;
    if (filter.fechaFin) params.fechaFin = filter.fechaFin;

    return this.http.get<ResponseAPI<PaginatedResponse<AuditLogDTO>>>(`${this.apiUrl}audit-logs`, { params });
  }

  // Se envían los parámetros por la URL y se espera un Blob como respuesta
  getReporteCandidatos(params?: any): Observable<Blob> {
    return this.http.get(environment.endpoint + '/Reportes/Candidatos', { params, responseType: 'blob' });
  }

  getReporteEmpresas(params?: any): Observable<Blob> {
    return this.http.get(environment.endpoint + '/Reportes/Empresas', { params, responseType: 'blob' });
  }
}
