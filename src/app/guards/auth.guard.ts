import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard para asegurar que esté logueado
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const session = localStorage.getItem('userSession');

  if (session) return true;

  router.navigate(['/login']);
  return false;
};

//  Guard para proteger rutas de EMPRESA
export const empresaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionStr = localStorage.getItem('userSession');

  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    if (session.rolName === 'Empresa') return true;
  }

  // Si no es empresa, lo mandamos al home del dashboard
  router.navigate(['/dashboard/home']);
  return false;
};