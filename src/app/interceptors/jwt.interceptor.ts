import { HttpInterceptorFn } from '@angular/common/http';
import { SessionDTO } from '../models/Auth/Auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionStr = localStorage.getItem('userSession');
  
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr) as SessionDTO;
      if (session && session.token) {
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${session.token}`
          }
        });
        return next(clonedRequest);
      }
    } catch (e) {
      console.error('Error al parsear la sesión de localStorage', e);
    }
  }

  return next(req);
};
