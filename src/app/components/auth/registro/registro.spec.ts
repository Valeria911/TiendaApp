import { TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

//mock
class UsuariosServiceMock {
  registrar(usuario: any) {
    return of({
      id: 1,
      ...usuario
    });
  }
}

describe('RegistroComponent', () => {

  let component: RegistroComponent;
  let fixture: any;
  let usuariosService: UsuariosServiceMock;
  let router: Router;

  beforeEach(async () => {
    usuariosService = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con formulario inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.form.setValue({
      nombre: '',
      correo: '',
      contrasena: ''
    });

    component.onSubmit();

    expect(component.mensajeError).toBe('Por favor complete todos los campos correctamente.');
    expect(component.mensajeOk).toBeNull();
  });

  it('debería llamar a registrar() cuando el formulario es válido', () => {

    const registrarSpy = spyOn(usuariosService, 'registrar').and.callThrough();

    component.form.setValue({
      nombre: 'Francesco',
      correo: 'ftossi@mail.com',
      contrasena: '123456'
    });

    component.onSubmit();

    expect(registrarSpy).toHaveBeenCalled();
    expect(component.mensajeError).toBeNull();
    expect(component.mensajeOk).toContain('Usuario Francesco registrado correctamente.');
  });

  it('debería manejar error si registrar() falla', () => {

    spyOn(usuariosService, 'registrar').and.returnValue(
      throwError(() => new Error('correo repetido'))
    );

    component.form.setValue({
      nombre: 'Gustavo',
      correo: 'gus@gmail.com',
      contrasena: '098765'
    });

    component.onSubmit();

    expect(component.mensajeOk).toBeNull();
    expect(component.mensajeError)
      .toBe('No fue posible registrar el usuario. Verifique el correo (no repetido)');
  });

  it('debería activar cargando al enviar formulario válido', () => {

    spyOn(usuariosService, 'registrar').and.callThrough();

    component.form.setValue({
      nombre: 'Paola',
      correo: 'paola@ymail.com',
      contrasena: '654321'
    });

    expect(component.cargando).toBeFalse();

    component.onSubmit();

    expect(component.cargando).toBeFalse();
  });

});
