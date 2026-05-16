import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-estudiante.component.html'
})
export class PerfilEstudianteComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  perfilForm!: FormGroup;
  isLoading = false;
  cvFile: File | null = null;

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosMock();
  }

  iniciarFormulario() {
    this.perfilForm = this.fb.group({
      // Datos Personales
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      enlaceLinkedIn: [''],
      enlaceGitHub: [''],
      
      // Información Académica
      universidad: ['Universidad de Oriente (UNIVO)', Validators.required],
      carreraId: ['', Validators.required],
      anioEstudio: ['', Validators.required], // Ej: 3er Año, Egresado, etc.
      nivelIngles: ['', Validators.required],
      
      // Perfil Técnico y Experiencia
      habilidades: ['', Validators.required],
      experienciaPrevia: [''],
      sobreMi: ['', Validators.maxLength(500)]
    });
  }

  cargarDatosMock() {
    // Simulación de los datos que vendrían de tu base de datos al hacer GET a /api/Estudiantes/Perfil
    const datosBackend = {
      nombres: 'Cristian Alexander',
      apellidos: 'Rivera Romero',
      telefono: '7777-8888',
      enlaceLinkedIn: 'linkedin.com/in/cristian-rivera',
      enlaceGitHub: 'github.com/cristian-dev',
      universidad: 'Universidad de Oriente (UNIVO)',
      carreraId: '4', // Suponiendo que 4 es Ingeniería en Desarrollo de Software
      anioEstudio: '5to Año',
      nivelIngles: 'Intermedio',
      habilidades: 'C#, .NET, Angular, PostgreSQL, Patrones de Repositorio',
      experienciaPrevia: 'Pasantía profesional de 500 horas en Nauterra (Depto. de Sistemas y Digitalización).',
      sobreMi: 'Estudiante de Ingeniería apasionado por el desarrollo full-stack y la arquitectura de software escalable para entornos industriales.'
    };

    // Llenamos el formulario automáticamente
    this.perfilForm.patchValue(datosBackend);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.cvFile = file;
    } else {
      alert('Por favor, sube un archivo en formato PDF.');
      event.target.value = ''; // Limpiar el input
    }
  }

  guardarPerfil() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Si tienes un archivo PDF, normalmente usarías FormData para enviarlo
    const formData = new FormData();
    formData.append('datos', JSON.stringify(this.perfilForm.value));
    if (this.cvFile) {
      formData.append('cvDocumento', this.cvFile);
    }

    console.log('Enviando al backend...', this.perfilForm.value);
    
    // Simulación de guardado
    setTimeout(() => {
      this.isLoading = false;
      // Aquí podrías mostrar un SweetAlert de éxito
    }, 1500);
  }
}