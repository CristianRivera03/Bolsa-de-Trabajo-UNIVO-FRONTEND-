import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpEnterpriseComponent } from './components/sign-up-enterprise/sign-up-enterprise.component';
import { CrearOfertaComponent } from './components/crear-oferta/crear-oferta.component';
import { OfertaDetalleComponent } from './components/oferta-detalle/oferta-detalle.component';
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { MisPostulacionesComponent } from './components/mis-postulaciones/mis-postulaciones.component';
import { PerfilEmpresaComponent } from './components/perfil-empresa/perfil-empresa.component';
import { PostulantesComponent } from './components/postulantes/postulantes.component';
import { AdminComponent } from './components/admin/admin.component';
import { OlvidePasswordComponent } from './components/olvide-password/olvide-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard, empresaGuard, estudianteGuard, adminGuard } from './guards/auth.guard'; 
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-up-enterprise', component: SignUpEnterpriseComponent },
    { path: 'auth/olvide-password', component: OlvidePasswordComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    {
        path: 'dashboard',
        component: LayoutComponent,
        canActivate: [authGuard], // Todo el dashboard requiere estar logueado
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent }, 
            { path: 'oferta/:id', component: OfertaDetalleComponent }, 
            { 
                path: 'crear-oferta', 
                component: CrearOfertaComponent, 
                canActivate: [empresaGuard] 
            },
            { 
                path: 'perfil-empresa', 
                component: PerfilEmpresaComponent, 
                canActivate: [empresaGuard] 
            },
            { 
                path: 'postulantes', 
                component: PostulantesComponent, 
                canActivate: [empresaGuard] 
            },
            { 
                path: 'perfil-estudiante', 
                component: PerfilEstudianteComponent, 
                canActivate: [estudianteGuard] 
            },
            { 
                path: 'mis-postulaciones', 
                component: MisPostulacionesComponent, 
                canActivate: [estudianteGuard] 
            },
            {
                path: 'admin',
                component: AdminComponent,
                canActivate: [adminGuard]
            }
        ]
    },
];
