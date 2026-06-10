import { HttpInterceptorFn } from '@angular/common/http';
import { SessionDTO } from '../models/Auth/Auth';
import { CryptoUtil } from '../utils/crypto.util';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const session = CryptoUtil.getSession() as SessionDTO;
  
  if (session) {
    try {
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
