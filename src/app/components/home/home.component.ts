import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  
  // Simulamos los datos que vendrán de tu API
  ofertas = [
    {
      id: 1,
      titulo: 'Desarrollador Backend .NET Core',
      empresa: 'Nauterra',
      ubicacion: 'San Salvador / Remoto',
      modalidad: 'Remoto',
      salario: '$1,200 - $1,500',
      fechaPublicacion: 'Hace 2 días',
      logo: 'https://ui-avatars.com/api/?name=Nauterra&background=10406d&color=fff' // Usa tu primary color
    },
    {
      id: 2,
      titulo: 'Frontend Developer (Angular 19)',
      empresa: 'Nauterra',
      ubicacion: 'Planta La Unión, El Salvador',
      modalidad: 'Híbrido',
      salario: '$1,000 - $1,300',
      fechaPublicacion: 'Hace 5 días',
      logo: 'https://ui-avatars.com/api/?name=Nauterra&background=10406d&color=fff'
    },
    {
      id: 3,
      titulo: 'Analista de Seguridad (AppSec)',
      empresa: 'Nauterra',
      ubicacion: 'Planta La Unión, El Salvador',
      modalidad: 'Presencial',
      salario: '$1,500 - $2,000',
      fechaPublicacion: 'Hoy',
      logo: 'https://ui-avatars.com/api/?name=Nauterra&background=10406d&color=fff'
    },
    {
      id: 4,
      titulo: 'Pasante de Sistemas y Automatización',
      empresa: 'Nauterra',
      ubicacion: 'San Miguel / La Unión',
      modalidad: 'Híbrido',
      salario: '$400',
      fechaPublicacion: 'Hace 1 semana',
      logo: 'https://ui-avatars.com/api/?name=Nauterra&background=10406d&color=fff'
    }
  ];

  getModalidadClass(modalidad: string): string {
    switch (modalidad) {
      case 'Remoto': return 'badge-info text-info-content';
      case 'Híbrido': return 'badge-secondary text-secondary-content'; // Tu color mostaza
      case 'Presencial': return 'badge-primary text-primary-content'; // Tu color azul
      default: return 'badge-ghost';
    }
  }
}