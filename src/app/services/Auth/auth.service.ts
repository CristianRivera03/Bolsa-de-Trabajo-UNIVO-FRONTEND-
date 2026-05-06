import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {LoginDTO, SessionDTO} from '../../models/Auth/Auth';
import { ResponseAPI } from '../../models/response-api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = environment.endpoint;
  constructor() { }

  Login(loginDTO: LoginDTO): Observable<ResponseAPI<SessionDTO>> {
    return this.http.post<ResponseAPI<SessionDTO>>(`${this.apiUrl}/Auth/login`, loginDTO);
  }



}
