import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpEnterpriseComponent } from './components/sign-up-enterprise/sign-up-enterprise.component';
import { CrearOfertaComponent } from './components/crear-oferta/crear-oferta.component';
import { authGuard , empresaGuard } from './guards/auth.guard'; 
import { OfertaDetalleComponent } from './components/oferta-detalle/oferta-detalle.component';
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';

import { PerfilEmpresaComponent } from './components/perfil-empresa/perfil-empresa.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-up-enterprise', component: SignUpEnterpriseComponent },
    {
        path: 'dashboard',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'crear-oferta', component: CrearOfertaComponent, 
            canActivate: [empresaGuard] },
            { path: 'oferta/:id', component: OfertaDetalleComponent },
            { path: 'perfil-estudiante', component: PerfilEstudianteComponent },
            { path: 'perfil-empresa', component: PerfilEmpresaComponent, canActivate: [empresaGuard] }
        ]
    },
];
