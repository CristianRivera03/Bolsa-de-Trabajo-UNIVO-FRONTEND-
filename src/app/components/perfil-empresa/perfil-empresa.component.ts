import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmpresaUpdateDTO } from '../../models/Empresa/empresa';
import { EnterpriseService } from '../../services/Enterprise/enterprise.service';

@Component({
  selector: 'app-perfil-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-empresa.component.html'
})
export class PerfilEmpresaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private enterpriseService = inject(EnterpriseService);

  empresaForm!: FormGroup;
  isLoading = true;
  isSaving = false;

  // Variables para la carga directa del logo
  isUploadingLogo = false;
  logoUrl: string = 'https://ui-avatars.com/api/?name=Empresa&background=0D8ABC&color=fff';

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosEmpresa();
  }

  iniciarFormulario() {
    this.empresaForm = this.fb.group({
      // Datos Generales
      nombreComercial: ['', Validators.required],
      sector: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      sitioWeb: [''],
      
      // Datos Legales y Operativos
      razonSocial: [''],
      nit: [''],
      direccion: [''],
      telefonoFijo: [''],
      correoInstitucional: ['', Validators.email],
      facebook: [''],
      twitter: [''],

      // Sub-formulario anidado para el Contacto Comercial
      contacto: this.fb.group({
        nombreCompleto: [''],
        cargo: [''],
        dui: ['', [Validators.pattern(/^\d{8}-\d$/)]],
        telefonoMovil: [''],
        correoContacto: ['', Validators.email]
      })
    });
  }

  cargarDatosEmpresa() {
    this.enterpriseService.getMiPerfil().subscribe({
      next: (res) => {
        this.isLoading = false;
        
        if (res.status && res.value) {
          // Llenamos el formulario con los datos de BD
          this.empresaForm.patchValue({
            nombreComercial: res.value.nombreComercial,
            sector: res.value.sector,
            descripcion: res.value.descripcion,
            sitioWeb: res.value.sitioWeb,
            razonSocial: res.value.razonSocial,
            nit: res.value.nit,
            direccion: res.value.direccion,
            telefonoFijo: res.value.telefonoFijo,
            correoInstitucional: res.value.correoInstitucional,
            facebook: res.value.facebook,
            twitter: res.value.twitter,
            
            // Llenamos el contacto (si viene null, pasamos un objeto vacío)
            contacto: res.value.contacto || {}
          });

          // Actualizamos el logo si existe
          if (res.value.logoUrl) {
            this.logoUrl = res.value.logoUrl;
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cargar el perfil de la empresa:', err);
      }
    });
  }

  // ==========================================
  // CARGA DIRECTA DE LOGO
  // ==========================================
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      this.isUploadingLogo = true;
      const formData = new FormData();
      formData.append('Archivo', file); 

      this.enterpriseService.cambiarLogo(formData).subscribe({
        next: (res) => {
          this.isUploadingLogo = false;
          if (res.status && res.value) {
            this.logoUrl = res.value; 
            alert('Logo actualizado correctamente.');
          } else {
            alert('Error al actualizar el logo: ' + res.msg);
          }
        },
        error: (err) => {
          this.isUploadingLogo = false;
          alert('Error de red al subir el logo.');
          console.error(err);
        },
      });
    } else {
      alert('Por favor, selecciona una imagen válida (JPG, PNG, WEBP).');
      event.target.value = '';
    }
  }

  // ==========================================
  // GUARDAR PERFIL
  // ==========================================
  guardarPerfil() {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    // Obtenemos todos los valores estructurados exactamente como los pide el DTO
    const dto: EmpresaUpdateDTO = this.empresaForm.value;

    this.enterpriseService.updateMiPerfil(dto).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.status) {
          alert('Perfil corporativo actualizado con éxito.');
        } else {
          alert('No se pudo actualizar el perfil: ' + res.msg);
        }
      },
      error: (err) => {
        this.isSaving = false;
        alert('Ocurrió un error de conexión al guardar el perfil.');
        console.error(err);
      }
    });
  }
}