import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OfertaLaboralService } from '../../services/OfertasLaborales/oferta-laboral.service';
import { OfertaLaboralCreate } from '../../models/OfertasLaborales/oferta-laboral';
import { SessionDTO } from '../../models/Auth/Auth';
import { CatalogosService } from '../../services/Catalogo/catalogos.service';
import { CatalogDTO } from '../../models/Catalog/catalog';
import { CryptoUtil } from '../../utils/crypto.util';


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
  distritos: CatalogDTO[] = [];
  licencias: CatalogDTO[] = [];
  contratos: CatalogDTO[] = [];
  generos: CatalogDTO[] = [];
  carreras: CatalogDTO[] = [];
  nivelesIdioma: CatalogDTO[] = [];
  gradosAcademicos: CatalogDTO[] = [];

  // Habilidades
  todasHabilidades: CatalogDTO[] = [];
  habilidadesFiltradas: CatalogDTO[] = [];
  habilidadesSeleccionadas: CatalogDTO[] = [];
  searchTerm: string = '';

  // Carreras
  carrerasFiltradas: CatalogDTO[] = [];
  carrerasSeleccionadas: CatalogDTO[] = [];
  carreraSearchTerm: string = '';


  private ofertaService = inject(OfertaLaboralService);
  private catalogosService = inject(CatalogosService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      empresaId : this.sesionActual ? this.sesionActual.usuarioId : null,
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      requisitos: [''],
      modalidadId: ['', Validators.required], 
      ubicacion: ['', Validators.required],
      salarioMin: [null, [Validators.required, Validators.min(1)]],
      salarioMax: [null, Validators.min(1)],
      fechaExpiracion: [null, Validators.required],
      vacantes: [1, [Validators.required, Validators.min(1)]],
      edadMin: [18],
      edadMax: [null],
      tieneVehiculo: [false],
      licenciaId: [null],
      tipoContratoId: ['', Validators.required],
      departamentoId: ['', Validators.required], 
      municipioId: ['', Validators.required],
      distritoId: ['', Validators.required],
      generoId: [3], // Asumimos que 3 es 'Indiferente'


    }, { validators: this.rangoSalarialValidator });
  }

  ngOnInit(): void {
    const sesion = CryptoUtil.getSession(); 
    if (sesion) {
      this.sesionActual = sesion;
      this.cargarCatalogos(); 
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

  filtrarHabilidades(event: any) {
    const term = event.target.value.toLowerCase().trim();
    this.searchTerm = term;
    if (!term) {
      this.habilidadesFiltradas = this.todasHabilidades.filter(
        h => !this.habilidadesSeleccionadas.some(s => s.id === h.id)
      );
    } else {
      this.habilidadesFiltradas = this.todasHabilidades.filter(
        h => h.nombre.toLowerCase().includes(term) && 
        !this.habilidadesSeleccionadas.some(s => s.id === h.id)
      );
    }
  }

  seleccionarHabilidad(habilidad: CatalogDTO) {
    if (!this.habilidadesSeleccionadas.some(s => s.id === habilidad.id)) {
      this.habilidadesSeleccionadas.push(habilidad);
      this.searchTerm = '';
      this.habilidadesFiltradas = this.todasHabilidades.filter(
        h => !this.habilidadesSeleccionadas.some(s => s.id === h.id)
      );
    }
  }

  deseleccionarHabilidad(habilidad: CatalogDTO) {
    this.habilidadesSeleccionadas = this.habilidadesSeleccionadas.filter(s => s.id !== habilidad.id);
    this.filtrarHabilidades({ target: { value: this.searchTerm } });
  }

  filtrarCarreras(event: any) {
    const term = event.target.value.toLowerCase().trim();
    this.carreraSearchTerm = term;
    if (!term) {
      this.carrerasFiltradas = this.carreras.filter(
        c => !this.carrerasSeleccionadas.some(s => s.id === c.id)
      );
    } else {
      this.carrerasFiltradas = this.carreras.filter(
        c => c.nombre.toLowerCase().includes(term) && 
        !this.carrerasSeleccionadas.some(s => s.id === c.id)
      );
    }
  }

  seleccionarCarrera(carrera: CatalogDTO) {
    if (!this.carrerasSeleccionadas.some(s => s.id === carrera.id)) {
      this.carrerasSeleccionadas.push(carrera);
      this.carreraSearchTerm = '';
      this.carrerasFiltradas = this.carreras.filter(
        c => !this.carrerasSeleccionadas.some(s => s.id === c.id)
      );
    }
  }

  deseleccionarCarrera(carrera: CatalogDTO) {
    this.carrerasSeleccionadas = this.carrerasSeleccionadas.filter(s => s.id !== carrera.id);
    this.filtrarCarreras({ target: { value: this.carreraSearchTerm } });
  }

  publicarOferta() {
    if (this.ofertaForm.valid && this.sesionActual) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValues = this.ofertaForm.value;
      const requisitosTexto = this.habilidadesSeleccionadas.map(h => h.nombre).join(', ');
      
      const modeloEnvio: OfertaLaboralCreate = {
        ...formValues,
        empresaId: this.sesionActual.usuarioId, 
        modalidadId: Number(formValues.modalidadId),
        salarioMin: formValues.salarioMin ? Number(formValues.salarioMin) : null,
        salarioMax: formValues.salarioMax ? Number(formValues.salarioMax) : null,
        tipoContratoId: formValues.tipoContratoId ? Number(formValues.tipoContratoId) : null,
        distritoId: formValues.distritoId ? Number(formValues.distritoId) : null,
        generoId: formValues.generoId ? Number(formValues.generoId) : null,
        licenciaId: formValues.licenciaId && formValues.licenciaId !== 'null' ? Number(formValues.licenciaId) : null,
        carreraIds: this.carrerasSeleccionadas.map(c => c.id),
        requisitos: requisitosTexto,
        habilidadIds: this.habilidadesSeleccionadas.map(h => h.id)
      };

      delete (modeloEnvio as any).departamentoId;
      delete (modeloEnvio as any).municipioId;

      console.log("Sesion actual completa: ", this.sesionActual);
      console.log("Modelo a enviar: ", modeloEnvio);


      this.ofertaService.crear(modeloEnvio).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.status) {
            this.successMessage = '¡Oferta laboral publicada!';
            this.ofertaForm.reset({}); 
            this.habilidadesSeleccionadas = [];
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
    this.catalogosService.obtenerCarreras().subscribe(res => {
      this.carreras = res.value || [];
      this.carrerasFiltradas = this.carreras;
    });
    this.catalogosService.obtenerModalidades().subscribe(res => this.modalidades = res.value);
    this.catalogosService.obtenerNivelesIdioma().subscribe(res => this.nivelesIdioma = res.value);
    this.catalogosService.obtenerGradosAcademicos().subscribe(res => this.gradosAcademicos = res.value);
    this.catalogosService.obtenerTiposContrato().subscribe(res => this.contratos = res.value);
    this.catalogosService.obtenerDepartamentos().subscribe(res => this.departamentos = res.value);
    this.catalogosService.obtenerTiposLicencia().subscribe(res => this.licencias = res.value);
    this.catalogosService.obtenerGeneros().subscribe(res => this.generos = res.value);
    this.catalogosService.obtenerHabilidades().subscribe(res => {
      this.todasHabilidades = res.value || [];
      this.habilidadesFiltradas = this.todasHabilidades;
    });
  } 

  onDepartamentoChange(event: any) {
    const departamentoId = event.target.value;
    this.municipios = [];
    this.distritos = [];
    this.ofertaForm.get('municipioId')?.setValue('');
    this.ofertaForm.get('distritoId')?.setValue('');
    if (departamentoId) {
      this.catalogosService.obtenerMunicipios(departamentoId).subscribe(res => {
        this.municipios = res.value;
      });
    }
  }

  onMunicipioChange(event: any) {
    const municipioId = event.target.value;
    this.distritos = [];
    this.ofertaForm.get('distritoId')?.setValue('');
    if (municipioId) {
      this.catalogosService.obtenerDistritos(municipioId).subscribe(res => {
        this.distritos = res.value;
      });
    }
  }

}