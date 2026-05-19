import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {EnterpriseService} from '../../services/Enterprise/enterprise.service';
@Component({
  selector: 'app-perfil-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="container mx-auto p-4 max-w-4xl animate-fade-in">
  
  <div class="flex items-center gap-4 mb-8">
    <div class="avatar relative group cursor-pointer" (click)="logoInput.click()">
      <div class="w-24 h-24 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-white flex items-center justify-center">
        <span *ngIf="isUploadingLogo" class="loading loading-spinner text-primary"></span>
        <img *ngIf="!isUploadingLogo" [src]="logoUrl" alt="Logo de Empresa" class="object-contain w-full h-full" />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-white">photo_camera</span>
        </div>
      </div>
      <input #logoInput type="file" class="hidden" accept="image/jpeg, image/png, image/webp" (change)="onLogoSelected($event)">
    </div>
    <div>
      <h1 class="text-3xl font-bold text-base-content">Perfil de Empresa</h1>
      <p class="text-base-content/70">Gestiona la información de tu organización.</p>
    </div>
  </div>

  <form [formGroup]="empresaForm" (ngSubmit)="guardarPerfil()" class="space-y-6">
    
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body">
        <h2 class="card-title text-primary border-b pb-2"><span class="material-symbols-outlined">business</span> Información Principal</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="form-control col-span-full">
            <label class="label"><span class="label-text font-medium">Nombre Comercial</span></label>
            <input type="text" formControlName="nombreComercial" class="input input-bordered w-full" />
          </div>
          
          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Sector / Industria</span></label>
            <input type="text" formControlName="sector" class="input input-bordered w-full" placeholder="Ej: Tecnología, Salud, Finanzas..." />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Sitio Web</span></label>
            <input type="url" formControlName="sitioWeb" class="input input-bordered w-full" placeholder="https://www.tuempresa.com" />
          </div>

          <div class="form-control col-span-full">
            <label class="label">
              <span class="label-text font-medium">Descripción de la Empresa</span>
            </label>
            <textarea formControlName="descripcion" class="textarea textarea-bordered h-32" placeholder="Un breve resumen de la visión, misión y área de trabajo de la empresa..."></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-4 pb-10">
      <button type="submit" class="btn btn-primary w-48 shadow-lg" [disabled]="isLoading || empresaForm.invalid">
        @if(isLoading) {
          <span class="loading loading-spinner"></span> Guardando...
        } @else {
          Guardar Cambios
        }
      </button>
    </div>

  </form>
</div>
  `
})
export class PerfilEmpresaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EnterpriseService);
  
  empresaForm!: FormGroup;
  isLoading = false;
  isUploadingLogo = false;
  logoUrl: string = 'https://ui-avatars.com/api/?name=Empresa&background=random&color=fff';

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosPerfil();
  }

  iniciarFormulario() {
    this.empresaForm = this.fb.group({
      nombreComercial: ['', Validators.required],
      sector: ['', Validators.required],
      sitioWeb: [''],
      descripcion: ['', Validators.maxLength(1000)]
    });
  }

  cargarDatosPerfil() {
    this.empresaService.getMiPerfil().subscribe({
      next: (res) => {
        if (res.status && res.value) {
          if (res.value.logoUrl) {
            this.logoUrl = res.value.logoUrl;
          }
          this.empresaForm.patchValue({
            nombreComercial: res.value.nombreComercial,
            sector: res.value.sector,
            sitioWeb: res.value.sitioWeb,
            descripcion: res.value.descripcion
          });
        }
      },
      error: (err) => {
        console.error('Error cargando perfil de empresa:', err);
      }
    });
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      this.isUploadingLogo = true;
      const formData = new FormData();
      formData.append('Archivo', file);

      this.empresaService.cambiarLogo(formData).subscribe({
        next: (res) => {
          this.isUploadingLogo = false;
          if (res.status && res.value) {
            this.logoUrl = res.value; // Server returns new url
            alert('Logo actualizado correctamente.');
          } else {
            alert('Error al actualizar el logo: ' + res.msg);
          }
        },
        error: (err) => {
          this.isUploadingLogo = false;
          alert('Error de red al subir la imagen.');
          console.error(err);
        }
      });
    } else {
      alert('Por favor, selecciona una imagen válida (JPG, PNG, WEBP).');
      event.target.value = '';
    }
  }

  guardarPerfil() {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    this.empresaService.updateMiPerfil(this.empresaForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status) {
          alert('Información actualizada exitosamente.');
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
