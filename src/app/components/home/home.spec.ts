import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '@angular/router';
import { of } from 'rxjs';

class AuthServiceMock {
  usuarioActual: any = null;

  estaAutenticado() {
    return !!this.usuarioActual;
  }
}

class RouterMock {
  navigate(path: string[]) {}
}

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthServiceMock;
  let router: RouterMock;

  beforeEach(async () => {
    authService = new AuthServiceMock();
    router = new RouterMock();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería indicar NO autenticado cuando no hay usuario', () => {
    authService.usuarioActual = null;

    expect(component.estaAutenticado).toBeFalse();
  });

  it('debería indicar autenticado cuando hay usuario', () => {
    authService.usuarioActual = { nombre: 'Pedrito', rol: 'ADMIN' };

    expect(component.estaAutenticado).toBeTrue();
  });

  it('debería devolver nombre del usuario', () => {
    authService.usuarioActual = { nombre: 'Lorenzo', rol: 'VENDEDOR' };

    expect(component.nombreUsuario).toBe('Lorenzo');
  });

  it('debería devolver rol del usuario', () => {
    authService.usuarioActual = { nombre: 'X', rol: 'CLIENTE' };

    expect(component.rolUsuario).toBe('CLIENTE');
  });

  it('debería navegar a /tienda', () => {
    const spy = spyOn(router, 'navigate');
    component.irAProductos();

    expect(spy).toHaveBeenCalledWith(['/tienda']);
  });

  it('debería navegar a /login', () => {
    const spy = spyOn(router, 'navigate');
    component.irALogin();

    expect(spy).toHaveBeenCalledWith(['/login']);
  });

  it('debería navegar a /registro', () => {
    const spy = spyOn(router, 'navigate');
    component.irARegistro();

    expect(spy).toHaveBeenCalledWith(['/registro']);
  });

});
