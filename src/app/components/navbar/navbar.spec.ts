import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.js';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '@angular/router';
import { of } from 'rxjs';

class AuthServiceMock {

  usuarioActual: any = null;

  estaAutenticado() { return !!this.usuarioActual; }
  esAdmin()       { return this.usuarioActual?.rol === 'ADMIN'; }
  esVendedor()    { return this.usuarioActual?.rol === 'VENDEDOR'; }

  login(usuario: any) { this.usuarioActual = usuario; }
  logout() { this.usuarioActual = null; }
}

describe('NavbarComponent', () => {

  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authMock: AuthServiceMock;
  let router: Router;

  beforeEach(async () => {

    authMock = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería indicar si está autenticado', () => {

    authMock.usuarioActual = null;
    expect(component.estaAutenticado).toBeFalse();

    authMock.usuarioActual = { nombre: 'Juan', rol: 'ANALISTA' };
    expect(component.estaAutenticado).toBeTrue();
  });

  it('debería identificar rol ADMIN y VENDEDOR', () => {

    authMock.usuarioActual = { nombre: 'Julio', rol: 'ADMIN' };
    expect(component.esAdmin).toBeTrue();
    expect(component.esVendedor).toBeFalse();

    authMock.usuarioActual = { nombre: 'Ana', rol: 'VENDEDOR' };
    expect(component.esAdmin).toBeFalse();
    expect(component.esVendedor).toBeTrue();
  });

  it('debería exponer nombre y rol del usuario', () => {

    authMock.usuarioActual = {
      nombre: 'Barbara',
      rol: 'ADMIN'
    };

    expect(component.nombreUsuario).toBe('Barbara');
    expect(component.rolUsuario).toBe('ADMIN');
  });

  it('debería cerrar sesión y navegar a /home', () => {

    authMock.usuarioActual = { nombre: 'Luis', rol: 'ADMIN' };

    const logoutSpy = spyOn(authMock, 'logout').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    component.cerrarSesion();

    expect(logoutSpy).toHaveBeenCalled();           
    expect(routerSpy).toHaveBeenCalledWith(['/home']); 
    expect(authMock.usuarioActual).toBeNull();      
  });

});
