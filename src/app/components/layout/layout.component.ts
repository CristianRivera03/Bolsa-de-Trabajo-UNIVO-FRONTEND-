import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionDTO } from '../../models/Auth/Auth';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  // Controla si el menú está expandido o colapsado
  isSidebarExpanded: boolean = true;
  usuarioActual: SessionDTO | null = null;

  ngOnInit() {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
      this.usuarioActual = JSON.parse(sessionStr);
    }
  }


  // Menú adaptado para la Bolsa de Trabajo
  menuItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard/home' },
    { icon: 'person', label: 'Mi Perfil', route: '/dashboard/perfil' },
    { icon: 'work', label: 'Ofertas Laborales', route: '/dashboard/ofertas' },
    { icon: 'assignment_turned_in', label: 'Mis Postulaciones', route: '/dashboard/postulaciones' },
    { icon: 'business', label: 'Empresas Aliadas', route: '/dashboard/empresas' },
    { icon: 'calendar_today', label: 'Entrevistas', route: '/dashboard/entrevistas' }
  ];

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}