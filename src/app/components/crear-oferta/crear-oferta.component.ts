import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboralCreate } from '../../models/OfertasLaborales/oferta-laboral';
import { SessionDTO } from '../../models/Auth/Auth';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { CatalogDTO } from '../../models/Catalog/catalog';


@Component({
  selector: 'app-crear-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-oferta.component.html',
})
export class CrearOfertaComponent implements OnInit {
  ofertaForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  sesionActual: SessionDTO | null = null;

  // Listas para dropdowns
  departamentos: CatalogDTO[] = [];
  modalidades: CatalogDTO[] = [];
  municipios: CatalogDTO[] = [];
  licencias: CatalogDTO[] = [];
  contratos: CatalogDTO[] = [];
  generos: CatalogDTO[] = []
  carreras: CatalogDTO[] = [];
  nivelesIdioma: CatalogDTO[] = [];
  gradosAcademicos: CatalogDTO[] = [];


  private ofertaService = inject(OfertaLaboralService);
  private catalogosService = inject(CatalogosService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      empresaId : this.sesionActual ? this.sesionActual.usuarioId : null,
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      requisitos: ['', Validators.required],
      modalidadId: ['', Validators.required], 
      ubicacion: ['', Validators.required],
      salarioMin: [null, Validators.min(1)],
      salarioMax: [null, Validators.min(1)],
      fechaExpiracion: [null],
      vacantes: [1, [Validators.required, Validators.min(1)]],
      edadMin: [18],
      edadMax: [null],
      tieneVehiculo: [false],
      licenciaId: [null],
      tipoContratoId: ['', Validators.required],
      departamentoId: ['', Validators.required], 
      municipioId: ['', Validators.required],    
      generoId: [3], // Asumimos que 3 es 'Indiferente'


    }, { validators: this.rangoSalarialValidator });
  }

  ngOnInit(): void {
    const sesionStr = localStorage.getItem('userSession'); 
    if (sesionStr) {
      this.sesionActual = JSON.parse(sesionStr) as SessionDTO;
      this.cargarCatalogos(); // <- AQUÍ: Cargar catálogos
    } else {
      this.router.navigate(['/login']);
    }
  }

  rangoSalarialValidator(c: AbstractControl) {
    const min = c.get('salarioMin')?.value;
    const max = c.get('salarioMax')?.value;
    if (min !== null && max !== null && max < min) {
      return { rangoInvalido: true };
    }
    return null;
  }

  publicarOferta() {
    if (this.ofertaForm.valid && this.sesionActual) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValues = this.ofertaForm.value;
      
      const modeloEnvio: OfertaLaboralCreate = {
        ...formValues,
        empresaId: this.sesionActual.usuarioId, 
        modalidadId: Number(formValues.modalidadId),
        salarioMin: formValues.salarioMin ? Number(formValues.salarioMin) : null,
        salarioMax: formValues.salarioMax ? Number(formValues.salarioMax) : null,
        tipoContratoId: formValues.tipoContratoId ? Number(formValues.tipoContratoId) : null,
        municipioId: formValues.municipioId ? Number(formValues.municipioId) : null,
        generoId: formValues.generoId ? Number(formValues.generoId) : null,
        licenciaId: formValues.licenciaId && formValues.licenciaId !== 'null' ? Number(formValues.licenciaId) : null,
        carreraIds: [] // Si necesitas un selector de carreras, puedes agregarlo después.
      };

      delete (modeloEnvio as any).departamentoId; // Limpiamos campos no requeridos por la API

      console.log("Sesion actual completa: ", this.sesionActual);
      console.log("Modelo a enviar: ", modeloEnvio);


      this.ofertaService.crear(modeloEnvio).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status) {
            this.successMessage = '¡Oferta laboral publicada!';
            this.ofertaForm.reset({}); 
            setTimeout(() => this.router.navigate(['/mis-ofertas']), 2000);
          } else {
            this.errorMessage = res.msg || 'Error al publicar la oferta.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.msg || 'Error de conexión con el servidor.';
        }
      });
    } else {
      this.ofertaForm.markAllAsTouched();
      if (!this.sesionActual) {
        this.errorMessage = 'No se encontró una sesión activa.';
      }
    }
  }

  cargarCatalogos() {
    this.catalogosService.obtenerCarreras().subscribe(res => this.carreras = res.value);
    this.catalogosService.obtenerModalidades().subscribe(res => this.modalidades = res.value);
    this.catalogosService.obtenerNivelesIdioma().subscribe(res => this.nivelesIdioma = res.value);
    this.catalogosService.obtenerGradosAcademicos().subscribe(res => this.gradosAcademicos = res.value);
    this.catalogosService.obtenerTiposContrato().subscribe(res => this.contratos = res.value);
    this.catalogosService.obtenerDepartamentos().subscribe(res => this.departamentos = res.value);
    this.catalogosService.obtenerTiposLicencia().subscribe(res => this.licencias = res.value);
    this.catalogosService.obtenerGeneros().subscribe(res => this.generos = res.value);
    // Municipios se cargan dinámicamente cuando se selecciona un departamento
  } 

  onDepartamentoChange(event: any) {
    const departamentoId = event.target.value;
    if (departamentoId) {
      this.catalogosService.obtenerMunicipios(departamentoId).subscribe(res => {
        this.municipios = res.value;
        this.ofertaForm.get('municipioId')?.setValue(''); // Reset municipio when departamento changes
      });
    } else {
      this.municipios = [];
      this.ofertaForm.get('municipioId')?.setValue('');
    }
  }

}