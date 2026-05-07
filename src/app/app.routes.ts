import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpEnterpriseComponent } from './components/sign-up-enterprise/sign-up-enterprise.component';
import { CrearOfertaComponent } from './components/crear-oferta/crear-oferta.component';
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-up-enterprise', component: SignUpEnterpriseComponent },

    
    {
        path: 'dashboard',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'crear-oferta', component: CrearOfertaComponent }
        ]
    },
];
