import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,} from '@angular/forms';
import { PerfilEstudianteService } from '../../services/perfil-estudiante/perfil-estudiante.service';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { PerfilEstudianteDTO,PerfilEstudianteUpdateDTO,EducacionDTO,ExperienciaLaboralDTO,EstudianteHabilidadDTO,EstudianteIdiomaDTO,ProyectoEstudianteDTO} from '../../models/Alumnos/perfil-estudiante';
import { ModalEducacionComponent } from '../modals/education-modal/education-modal.component';
import { CambiarPasswordModalComponent } from '../modals/cambiar-password-modal/cambiar-password-modal.component';
import {ViewChild} from '@angular/core';
import { EducacionService } from '../../services/perfil-estudiante/educacion.service';
import { ModalExperienciaComponent } from '../modals/experiencia-modal/experiencia-modal.component';
import { ExperienciaLaboralService } from '../../services/perfil-estudiante/experiencia-laboral.service';
import { ModalHabilidadComponent } from '../modals/habilidad-modal/habilidad-modal.component';
import { HabilidadService } from '../../services/perfil-estudiante/habilidades.service';
import { ModalIdiomaComponent } from '../modals/idioma-modal/idioma-modal.component';
import { IdiomaService } from '../../services/perfil-estudiante/idioma.service';
import { ModalProyectoComponent } from '../modals/proyecto-modal/proyecto-modal.component';
import { ProyectoService } from '../../services/perfil-estudiante/proyecto.service';


@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalEducacionComponent, ModalExperienciaComponent, ModalHabilidadComponent, ModalIdiomaComponent , ModalProyectoComponent, CambiarPasswordModalComponent],
  templateUrl: './perfil-estudiante.component.html',
})
export class PerfilEstudianteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilEstudianteService);
  private catalogosService = inject(CatalogosService);
  private educacionService = inject(EducacionService);
  private experienciaService = inject(ExperienciaLaboralService);
  private habilidadService = inject(HabilidadService);
  private idiomaService = inject(IdiomaService);
  private proyectoService = inject(ProyectoService);

  @ViewChild(ModalEducacionComponent) modalEducacion!: ModalEducacionComponent;
  @ViewChild(ModalExperienciaComponent) modalExperiencia!: ModalExperienciaComponent;
  @ViewChild(ModalHabilidadComponent) modalHabilidad!: ModalHabilidadComponent;
  @ViewChild(ModalIdiomaComponent) modalIdioma!: ModalIdiomaComponent;
  @ViewChild(ModalProyectoComponent) modalProyecto!: ModalProyectoComponent;



  perfilForm!: FormGroup;
  isLoading = false;
  isUploadingFoto = false;
  fotoUrl: string = 'https://ui-avatars.com/api/?name=Estudiante&background=0D8ABC&color=fff';

  perfilCompleto!: PerfilEstudianteDTO;
  isDownloadingCv = false;


  // Catalogos
  carreras: any[] = [];
  nivelesIdioma: any[] = [];
  gradosAcademicos: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];
  distritos: any[] = [];

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarCatalogos();
    this.cargarDatosPerfil();
  }

  iniciarFormulario() {
    // Formulario LIMPIO: Solo contiene los datos del PerfilEstudianteUpdateDTO
    this.perfilForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.pattern(/^\d{8}$/)],
      departamentoId: [''],
      municipioId: [''],
      distritoId: [''],
      sobreMi: ['', Validators.maxLength(500)],
      enlaceLinkedIn: [''],
      enlaceGitHub: [''],
      carreraId: [''],
      buscaEmpleo: [true]
    });
  }

  cargarCatalogos() {
    this.catalogosService.obtenerCarreras().subscribe((res) => {
      if (res.status) this.carreras = res.value;
    });
    // Se mantienen listos para cuando crees los modales
    this.catalogosService.obtenerNivelesIdioma().subscribe((res) => {
      if (res.status) this.nivelesIdioma = res.value;
    });
    this.catalogosService.obtenerGradosAcademicos().subscribe((res) => {
      if (res.status) this.gradosAcademicos = res.value;
    });
    this.catalogosService.obtenerDepartamentos().subscribe((res) => {
      if (res.status) this.departamentos = res.value;
    });
  }

  cargarDatosPerfil() {
    this.perfilService.getMiPerfil().subscribe({
      next: (res) => {
        console.log('Respuesta del perfil:', res);
        if (res.status && res.value) {
          
          // 1. Guardamos todo el objeto para el HTML (Tablas relacionales)
          this.perfilCompleto = res.value;

          // 2. Actualizamos la foto si existe
          if (res.value.fotoUrl) {
            this.fotoUrl = res.value.fotoUrl;
          }
          
          // 3. Llenamos el formulario solo con la info básica
          this.perfilForm.patchValue({
            nombres: res.value.nombres,
            apellidos: res.value.apellidos,
            telefono: res.value.telefono,
            departamentoId: res.value.departamentoId || '',
            municipioId: res.value.municipioId || '',
            distritoId: res.value.distritoId || '',
            sobreMi: res.value.sobreMi,
            enlaceLinkedIn: res.value.enlaceLinkedIn,
            enlaceGitHub: res.value.enlaceGitHub,
            carreraId: res.value.carreraId,
            buscaEmpleo: res.value.buscaEmpleo
          });

          if (res.value.departamentoId) {
            this.catalogosService.obtenerMunicipios(res.value.departamentoId).subscribe(r => {
              if (r.status) this.municipios = r.value;
            });
          }
          if (res.value.municipioId) {
            this.catalogosService.obtenerDistritos(res.value.municipioId).subscribe(r => {
              if (r.status) this.distritos = r.value;
            });
          }
        }
      },
      error: (err) => console.error('Error cargando perfil de estudiante:', err)
    });
  }

  onFotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      this.isUploadingFoto = true;
      const formData = new FormData();
      formData.append('Archivo', file);

      this.perfilService.cambiarFoto(formData).subscribe({
        next: (res) => {
          this.isUploadingFoto = false;
          if (res.status && res.value) {
            this.fotoUrl = res.value; 
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

    const dtoParcial: Partial<PerfilEstudianteUpdateDTO> = {};
    let huboCambios = false;

    // Iteramos de forma limpia porque el form ya no tiene basura (como universidad o habilidades)
    Object.keys(this.perfilForm.controls).forEach(key => {
      const control = this.perfilForm.get(key);
      
      if (control && control.dirty) {
        if (key === 'carreraId' || key === 'distritoId') {
          dtoParcial[key as keyof PerfilEstudianteUpdateDTO] = control.value ? Number(control.value) : null as any;
        } else {
          dtoParcial[key as keyof PerfilEstudianteUpdateDTO] = control.value;
        }
        huboCambios = true;
      }
    });

    if (!huboCambios) {
      alert('No se detectaron cambios en la información básica para guardar.');
      return;
    }

    this.isLoading = true;

    // TODO: Ajusta 'updateMiPerfil' si en tu servicio se llama 'actualizarPerfilBasico'
    this.perfilService.updateMiPerfil(dtoParcial as PerfilEstudianteUpdateDTO).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          alert('Información actualizada exitosamente.');
          this.perfilForm.markAsPristine(); 
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

  // =========================================================
  // MÉTODOS PARA GESTIONAR UBICACION
  // =========================================================
  onDepartamentoChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const deptoId = Number(target.value);
    this.municipios = [];
    this.distritos = [];
    this.perfilForm.patchValue({ municipioId: '', distritoId: '' });
    if (deptoId) {
      this.catalogosService.obtenerMunicipios(deptoId).subscribe((res) => {
        if (res.status) this.municipios = res.value;
      });
    }
  }

  onMunicipioChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const muniId = Number(target.value);
    this.distritos = [];
    this.perfilForm.patchValue({ distritoId: '' });
    if (muniId) {
      this.catalogosService.obtenerDistritos(muniId).subscribe((res) => {
        if (res.status) this.distritos = res.value;
      });
    }
  }

  // =========================================================
  // MÉTODOS PARA GESTIONAR LAS LISTAS (MODALES FUTUROS)
  // =========================================================


  // Start Educación
  gestionarEducacion(edu?: EducacionDTO) {
    this.modalEducacion.abrir(edu);
  }
  eliminarEducacion(id: number) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este registro de educación?');
    
    if (confirmar) {
      this.educacionService.eliminarEducacion(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.recargarPerfil(); 
          } else {
            alert('Error al eliminar: ' + res.msg);
          }
        },
        error: (err) => {
          alert('Error de conexión al eliminar.');
          console.error(err);
        }
      });
    }
  }

  //End Educación

  // Start Experiencia

  gestionarExperiencia(exp?: ExperienciaLaboralDTO) {
    this.modalExperiencia.abrir(exp);
  }

eliminarExperiencia(id: number) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este registro de experiencia laboral?');
    
    if (confirmar) {
      this.experienciaService.eliminarExperienciaLaboral(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.recargarPerfil(); 
          } else {
            alert('Error al eliminar: ' + res.msg);
          }
        },
        error: (err) => {
          alert('Error de conexión al eliminar.');
          console.error(err);
        }
      });
    }
  }


  // End Experiencia


  //Start Habilidad

  gestionarHabilidad(hab?: EstudianteHabilidadDTO) {
    this.modalHabilidad.abrir(hab);
  }

  eliminarHabilidad(id: number) {
      this.habilidadService.eliminarHabilidad(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.recargarPerfil();
          } else {
            alert('Error al eliminar: ' + res.msg);
          }
        },
        error: (err) => {
          alert('Error de conexión al eliminar.');
          console.error(err);
        }
      });
  }

  // End Habilidad

  //Start Idioma

  gestionarIdioma(idioma?: EstudianteIdiomaDTO) {
    this.modalIdioma.abrir(idioma);
  }

  eliminarIdioma(id: number) {
      this.idiomaService.eliminarIdioma(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.recargarPerfil();
          } else {
            alert('Error al eliminar: ' + res.msg);
          }
        },
        error: (err) => {
          alert('Error de conexión al eliminar.');
          console.error(err);
        }
      });
  }

  //End Idioma


  // Start Proyecto
  gestionarProyecto(proy?: ProyectoEstudianteDTO) {
    this.modalProyecto.abrir(proy);
  }

  eliminarProyecto(id: number) {
      this.proyectoService.eliminarProyecto(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.recargarPerfil();
          } else {
            alert('Error al eliminar: ' + res.msg);
          }
        },
        error: (err) => {
          alert('Error de conexión al eliminar.');
          console.error(err);
        }
      });
  }


  descargarCV() {
    this.isDownloadingCv = true;
    
    this.perfilService.descargarCV().subscribe({
      next: (blob: Blob) => {
        this.isDownloadingCv = false;
        
        // 1. Crear una URL local a partir del archivo binario recibido
        const url = window.URL.createObjectURL(blob);
        
        // 2. Crear un elemento <a> oculto en HTML
        const a = document.createElement('a');
        a.href = url;
        
        // 3. Asignarle el nombre con el que se va a guardar (puedes dinamizarlo)
        a.download = `CV_${this.perfilCompleto.nombres.replace(' ', '_')}.pdf`;
        
        // 4. Hacer clic fantasma y limpiar la memoria
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.isDownloadingCv = false;
        alert('Error al generar el CV. Intenta de nuevo más tarde.');
        console.error('Error descargando PDF:', err);
      }
    });
  }

  // End Proyecto



  // 3. Método para refrescar cuando el modal guarde algo
  recargarPerfil() {
    this.cargarDatosPerfil();
  }

  abrirModalCambiarPassword() {
    const modal = document.getElementById('cambiar_password_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

}