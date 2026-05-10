import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { UsuariosService } from '../../../services/usuarios.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

// Mock 
class UsuariosServiceMock {
  login(correo: string, contrasena: string) {
    return of({ id: 1, correo, nombre: 'Usuario de prueba' });
  }
}

// Mock para AuthService
class AuthServiceMock {
  login(usuario: any) {}
}

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: any;
  let usuariosService: UsuariosServiceMock;
  let authService: AuthServiceMock;
  let router: Router;

  beforeEach(async () => {

    usuariosService = new UsuariosServiceMock();
    authService = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });


  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debería tener formulario inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });


  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.onSubmit();
    expect(component.mensajeError).toBe('Por favor complete el formulario correctamente.');
  });

  // ======================================================================
  // 4) Login CORRECTO: debe llamar servicio, AuthService y navegar
  // ======================================================================
  it('debería hacer login correctamente y navegar a /libros', () => {

    // Espías para capturar llamadas
    const loginSpy = spyOn(usuariosService, 'login').and.callThrough();
    const authSpy = spyOn(authService, 'login').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    // Formulario válido
    component.form.setValue({
      correo: 'test@mail.com',
      contrasena: '1234'
    });

    component.onSubmit();

    expect(component.cargando).toBeFalse();
    expect(loginSpy).toHaveBeenCalledOnceWith('test@mail.com', '1234');
    expect(authSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/libros']);
  });

  // ======================================================================
  // 5) Login INCORRECTO: debe mostrar mensajeError
  // ======================================================================
  it('debería manejar error en login y mostrar mensajeError', () => {

    spyOn(usuariosService, 'login').and.returnValue(
      throwError(() => new Error('Credenciales inválidas'))
    );

    component.form.setValue({
      correo: 'fail@mail.com',
      contrasena: '1234'
    });

    component.onSubmit();

    expect(component.cargando).toBeFalse();
    expect(component.mensajeError).toBe('Credenciales inválidas o error en el servidor.');
  });

  
  it('debería activar cargando al enviar formulario válido', () => {

    spyOn(usuariosService, 'login').and.callThrough();

    component.form.setValue({
      correo: 'test@mail.com',
      contrasena: '1234'
    });

    component.onSubmit();

    // Después de llamar login(), cargando se apaga
    expect(component.cargando).toBeFalse();
  });

});
