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

  /**
   * Authenticates a user with the backend API.
   * @param loginDTO Object containing email and password.
   * @returns An observable containing the authentication session data.
   */
  Login(loginDTO: LoginDTO): Observable<ResponseAPI<SessionDTO>> {
    return this.http.post<ResponseAPI<SessionDTO>>(`${this.apiUrl}/Auth/login`, loginDTO);
  }

  /**
   * Requests a password recovery email to be sent to the user.
   * @param dto Object containing the user's email address.
   * @returns An observable with the API response status.
   */
  solicitarRecuperacion(dto: import('../../models/Auth/Auth').RecuperarPasswordDTO): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}/Auth/forgot-password`, dto);
  }

  /**
   * Resets the user's password using the provided security token.
   * @param dto Object containing the JWT token and the new password.
   * @returns An observable with the API response status.
   */
  restablecerPassword(dto: import('../../models/Auth/Auth').RestablecerPasswordDTO): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}/Auth/reset-password`, dto);
  }

  /**
   * Changes the user's password internally by verifying the current password.
   * @param dto Object containing the current and new passwords.
   * @returns An observable with the API response status.
   */
  cambiarPassword(dto: import('../../models/Auth/Auth').CambiarPasswordDTO): Observable<ResponseAPI<string>> {
    return this.http.post<ResponseAPI<string>>(`${this.apiUrl}/Auth/cambiar-password`, dto);
  }
}
