import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.js';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth.service.js';
import { UsuariosService } from '../../services/usuarios.service.js';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

class AuthServiceMock {
  usuarioActual: any = null;
  loginLocal(usuario: any) {
    this.usuarioActual = usuario;
  }
}

class UsuariosServiceMock {
  actualizarPerfil(id: number, data: any) {
    return of(data);
  }
}

describe('PerfilComponent', () => {

  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authMock: AuthServiceMock;
  let usuariosMock: UsuariosServiceMock;
  let router: Router;

  beforeEach(async () => {

    authMock = new AuthServiceMock();
    usuariosMock = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        PerfilComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: UsuariosService, useValue: usuariosMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error si NO hay sesión activa', () => {

    authMock.usuarioActual = null;

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('No hay sesión activa.');
  });

  it('debería mostrar error si es VENDEDOR', () => {

    authMock.usuarioActual = {
      id: 1,
      nombre: 'Daniela',
      correo: 'daniela@test.com',
      rol: 'VENDEDOR'
    };

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('Un VENDEDOR no puede hacer modificaciones');
  });

  it('debería cargar datos si el usuario es ADMIN', () => {

    authMock.usuarioActual = {
      id: 5,
      nombre: 'Ana',
      correo: 'ana@test.com',
      contrasena: 'abc',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: new Date().toDateString()
    };

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('');
    expect(component.usuario.id).toBe(5);
    expect(component.usuario.nombre).toBe('Ana');
    expect(component.usuario.correo).toBe('ana@test.com');
    expect(component.usuario.contrasena).toBe('abc');
    expect(component.usuario.rol).toBe('ADMIN');
  });

  it('debería actualizar perfil y navegar a home', () => {

    authMock.usuarioActual = {
      id: 10,
      nombre: 'Jorge',
      correo: 'jorge@test.com',
      contrasena: '',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: new Date().toDateString()
    };

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const usuarioActualizado = {
      id: 10,
      nombre: 'George',
      correo: 'george@test.com',
      contrasena: '1234',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: new Date().toDateString()
    };

    spyOn(usuariosMock, 'actualizarPerfil').and.returnValue(of(usuarioActualizado));
    const routerSpy = spyOn(router, 'navigate');

    component.guardarCambios();

    expect(component.mensaje).toBe('Perfil actualizado correctamente.');
    expect(authMock.usuarioActual.nombre).toBe('George');
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar error al actualizar perfil', () => {

    authMock.usuarioActual = {
      id: 10,
      nombre: 'George',
      correo: 'george@test.com',
      contrasena: '',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: new Date().toDateString()
    };

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(usuariosMock, 'actualizarPerfil')
      .and.returnValue(throwError(() => new Error('Error de servidor')));

    component.guardarCambios();

    expect(component.error).toBe('No se pudieron guardar los cambios');
  });

});
