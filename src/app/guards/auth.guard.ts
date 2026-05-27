import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// 1. Guard General: Solo verifica que esté logueado
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const session = localStorage.getItem('userSession');

  if (session) return true;

  router.navigate(['/login']);
  return false;
};

// 2. Guard para proteger rutas de EMPRESA
export const empresaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionStr = localStorage.getItem('userSession');

  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    if (session.rolName === 'Empresa') return true;
  }

  router.navigate(['/dashboard/home']);
  return false;
};

// 3. Guard para proteger rutas de ESTUDIANTE
export const estudianteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionStr = localStorage.getItem('userSession');

  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    // Cambia 'Estudiante' si tu C# devuelve otro texto (ej. 'Alumno')
    if (session.rolName === 'Estudiante') return true; 
  }

  router.navigate(['/dashboard/home']);
  return false;
};

// 4. Guard para proteger rutas de ADMINISTRADOR (UNIVO)
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionStr = localStorage.getItem('userSession');

  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    // Cambia 'Admin' si tu C# devuelve 'Administrador'
    if (session.rolName === 'Administrador') return true;
  }

  router.navigate(['/dashboard/home']);
  return false;
};