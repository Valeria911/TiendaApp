import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { ProductosListaComponent } from './components/producto-lista/producto-lista';
import { ProductoFormComponent } from './components/producto-form/producto-form';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle';
import { PerfilComponent } from './components/perfil/perfil';
import { RegistroComponent } from './components/auth/registro/registro';
import { RecuperarComponent } from './components/auth/recuperar/recuperar.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'recuperar',
    component: RecuperarComponent,
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'registro',
    component: RegistroComponent
  },

  {
    path: 'productos',
    component: ProductosListaComponent
  },

  {
    path: 'agregar',
    component: ProductoFormComponent
  },

  {
    path: 'editar/:id',
    component: ProductoFormComponent
  },

  {
    path: 'detalle/:id',
    component: ProductoDetalleComponent
  },

  {
    path: 'perfil',
    component: PerfilComponent
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];