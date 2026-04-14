import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ProductoLista } from './components/producto-lista/producto-lista';
import { ProductoForm } from './components/producto-form/producto-form';
import { ProductoDetalle } from './components/producto-detalle/producto-detalle';
import { PerfilComponent } from './components/perfil/perfil';
import { RegistroComponent } from './components/registro/registro';
import { RecuperarComponent } from './components/recuperar/recuperar.component';

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
    component: ProductoLista
  },

  {
    path: 'agregar',
    component: ProductoForm
  },

  {
    path: 'editar/:id',
    component: ProductoForm
  },

  {
    path: 'detalle/:id',
    component: ProductoDetalle
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