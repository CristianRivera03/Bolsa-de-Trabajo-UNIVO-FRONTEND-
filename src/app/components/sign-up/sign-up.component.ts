import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlumnoActivo, RegistroEstudiante, VerificarAlumno } from '../../models/Alumnos/alumno';
import { AlumnoService } from '../../services/Alumnos/alumno.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  
  pasoActual: number = 1; 
  datosAlumno: AlumnoActivo | null = null; 

  private alumnoService = inject(AlumnoService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Formulario para validar y registrar
  registroForm: FormGroup = this.fb.group({
    carnet: ['', [Validators.required]],
    passwordPortal: ['', [Validators.required]]
  });

  // Estado de carga
  isLoading: boolean = false;
  errorMessage: string = '';

  consultarCredenciales() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const model: VerificarAlumno = this.registroForm.value;

    this.alumnoService.consultar(model).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.datosAlumno = response.value;
          this.pasoActual = 2; 
        } else {
          this.errorMessage = response.msg || 'Credenciales inválidas.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.msg) {
          this.errorMessage = err.error.msg;
        } else {
          this.errorMessage = 'Ocurrió un error al conectar con el servidor.';
        }
        console.error(err);
      }
    });
  }

  registrarAlumno() {
    if (this.registroForm.invalid) return;

    this.isLoading = true;
    const model: RegistroEstudiante = {
      carnet: this.registroForm.value.carnet,
      passwordPortal: this.registroForm.value.passwordPortal
    };

    this.alumnoService.registrar(model).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.msg || 'Error al registrar al alumno.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.msg) {
          this.errorMessage = err.error.msg;
        } else {
          this.errorMessage = 'Ocurrió un error al registrar al alumno.';
        }
        console.error(err);
      }
    });
  }
}