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
    if (window.innerWidth < 768) {
      this.isSidebarExpanded = false;
    }
  }


  allMenuItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard/home' },
    { icon: 'admin_panel_settings', label: 'Administración', route: '/dashboard/admin', roles: ['Administrador'] },
    { icon: 'add_home_work', label: 'Crear Oferta', route: '/dashboard/crear-oferta' , roles: ['Empresa'] },
    { icon: 'group', label: 'Postulantes', route: '/dashboard/postulantes' , roles: ['Empresa'] },
    { icon: 'person', label: 'Mi Perfil', route: '/dashboard/perfil-estudiante' , roles: ['Estudiante'] },
    { icon: 'person', label: 'Mi Perfil', route: '/dashboard/perfil-empresa' , roles: ['Empresa'] },
    { icon: 'assignment_turned_in', label: 'Mis Postulaciones', route: '/dashboard/mis-postulaciones' , roles: ['Estudiante'] },
  ];

  get menuItems() {
    return this.allMenuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(this.usuarioActual?.rolName || '');
    });
  }
  
  logout(){
    localStorage.removeItem('userSession');
    window.location.href = '/login';
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  onMenuItemClick() {
    if (window.innerWidth < 768) {
      this.isSidebarExpanded = false;
    }
  }
}