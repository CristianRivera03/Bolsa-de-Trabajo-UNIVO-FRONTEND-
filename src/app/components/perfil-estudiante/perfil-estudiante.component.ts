import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PerfilEstudianteService } from '../../services/perfil-estudiante/perfil-estudiante.service';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { PerfilEstudianteDTO, PerfilEstudianteUpdateDTO } from '../../models/Alumnos/perfil-estudiante';

@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-estudiante.component.html',
})
export class PerfilEstudianteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilEstudianteService);
  private catalogosService = inject(CatalogosService);
  perfilForm!: FormGroup;
  isLoading = false;
  isUploadingFoto = false;
  fotoUrl: string =
    'https://ui-avatars.com/api/?name=Estudiante&background=0D8ABC&color=fff';

  //catalogos
  carreras: any[] = [];
  nivelesIdioma: any[] = [];
  gradosAcademicos: any[] = [];

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosPerfil();
    this.cargarCatalogos();
  }

  iniciarFormulario() {
    this.perfilForm = this.fb.group({
      nombres: [''],
      apellidos: [''],
      telefono: ['', Validators.pattern(/^\d{8}$/)],
      enlaceLinkedIn: [''],
      enlaceGitHub: [''],
      universidad: ['Universidad de Oriente (UNIVO)'],
      carreraId: [''],
      sobreMi: ['', Validators.maxLength(500)],
      direccion: [''],
      buscaEmpleo: [true],
      gradoAcademicoId: [''],
      nivelIdiomaId: [''],
      habilidades: [''],
      experienciaPrevia: [''],
    });
  }

  cargarCatalogos() {
    this.catalogosService.obtenerCarreras().subscribe((res) => {
      if (res.status) this.carreras = res.value;
    });
    this.catalogosService.obtenerNivelesIdioma().subscribe((res) => {
      if (res.status) this.nivelesIdioma = res.value;
    });
    this.catalogosService.obtenerGradosAcademicos().subscribe((res) => {
      if (res.status) this.gradosAcademicos = res.value;
    });
  }

  cargarDatosPerfil() {
    this.perfilService.getMiPerfil().subscribe({
      next: (res) => {
        console.log('Respuesta del perfil:', res);
        if (res.status && res.value) {
          if (res.value.fotoUrl) {
            this.fotoUrl = res.value.fotoUrl;
          }
          
          this.perfilForm.patchValue({
            nombres: res.value.nombres,
            apellidos: res.value.apellidos,
            telefono: res.value.telefono,
            direccion: res.value.direccion, 
            enlaceLinkedIn: res.value.enlaceLinkedIn,
            enlaceGitHub: res.value.enlaceGitHub,
            carreraId: res.value.carreraId,
            sobreMi: res.value.sobreMi,
            buscaEmpleo: res.value.buscaEmpleo
          });
        }
      },
      error: (err) => console.error('Error cargando perfil de estudiante:', err)
    });
  }

  onFotoSelected(event: any) {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp')
    ) {
      this.isUploadingFoto = true;
      const formData = new FormData();
      formData.append('Archivo', file);

      this.perfilService.cambiarFoto(formData).subscribe({
        next: (res) => {
          this.isUploadingFoto = false;
          if (res.status && res.value) {
            this.fotoUrl = res.value; // Server returns new URL
            alert('Foto actualizada correctamente.');
          } else {
            alert('Error al actualizar la foto: ' + res.msg);
          }
        },
        error: (err) => {
          this.isUploadingFoto = false;
          alert('Error de red al subir la foto.');
          console.error(err);
        },
      });
    } else {
      alert('Por favor, selecciona una imagen válida (JPG, PNG, WEBP).');
      event.target.value = '';
    }
  }

  guardarPerfil() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    // 1. Objeto dinámico para guardar solo los cambios
    const dtoParcial: Partial<PerfilEstudianteUpdateDTO> = {};
    let huboCambios = false;

    // 2. Iterar sobre los controles y extraer solo los 'dirty' (modificados)
    Object.keys(this.perfilForm.controls).forEach(key => {
      const control = this.perfilForm.get(key);
      
      if (control && control.dirty) {
        // Filtrar los campos que no pertenecen al DTO principal de PerfilEstudiante
        // (como habilidades, experiencia, que van en tablas separadas)
        if (key !== 'universidad' && key !== 'gradoAcademicoId' && key !== 'nivelIdiomaId' && key !== 'habilidades' && key !== 'experienciaPrevia') {
            
            if (key === 'carreraId') {
              // Parsear a número los IDs
              dtoParcial[key as keyof PerfilEstudianteUpdateDTO] = control.value ? Number(control.value) : null as any;
            } else {
              dtoParcial[key as keyof PerfilEstudianteUpdateDTO] = control.value;
            }
            huboCambios = true;
        }
      }
    });

    if (!huboCambios) {
      alert('No se detectaron cambios en la información básica para guardar.');
      return;
    }

    this.isLoading = true;

    // 3. Enviar la petición PATCH
    this.perfilService.updateMiPerfil(dtoParcial as PerfilEstudianteUpdateDTO).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          alert('Información actualizada exitosamente.');
          this.perfilForm.markAsPristine(); // Reiniciar el estado de los controles
        } else {
          alert('Error al actualizar: ' + res.msg);
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error de red al guardar perfil.');
        console.error(err);
      }
    });
  }
}
