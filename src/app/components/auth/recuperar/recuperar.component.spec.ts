import { TestBed } from '@angular/core/testing';
import { RecuperarComponent } from './recuperar.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UsuariosService } from '../../../services/usuarios.service';
import { of, throwError } from 'rxjs';

//mock
class UsuariosServiceMock {
  recuperarPorCorreo(correo: string) {
    return of({
      nombre: 'Usuario Test',
      rol: 'admin',
      contrasena: '1234'
    });
  }
}

describe('RecuperarComponent', () => {

  let component: RecuperarComponent;
  let fixture: any;
  let usuariosService: UsuariosServiceMock;

  beforeEach(async () => {

    usuariosService = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        RecuperarComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarComponent);
    component = fixture.componentInstance;
  });

  //crear
  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  //error
  it('debería mostrar error si el formulario es inválido', () => {
    component.form.setValue({ correo: '' });

    component.onSubmit();

    expect(component.mensajeError).toBe('Ingresa un correo válido');
    expect(component.mensajeOk).toBeNull();
  });

  //correcto
  it('debería llamar a recuperarPorcorreo si el formulario es válido', () => {

    const spyRecuperar = spyOn(usuariosService, 'recuperarPorcorreo').and.callThrough();

    component.form.setValue({
      correo: 'test@mail.com'
    });

    component.onSubmit();

    expect(spyRecuperar).toHaveBeenCalledOnceWith('test@mail.com');
    expect(component.mensajeError).toBeNull();
    expect(component.mensajeOk).toContain('Usuario encontrado: Usuario Test');
  });

  it('debería manejar error si recuperarPorcorreo falla', () => {

    spyOn(usuariosService, 'recuperarPorcorreo').and.returnValue(
      throwError(() => new Error('No existe'))
    );

    component.form.setValue({
      correo: 'fail@mail.com'
    });

    component.onSubmit();

    expect(component.mensajeOk).toBeNull();
    expect(component.mensajeError).toBe('No se encontró un usuario con ese correo.');
  });


  it('debería marcar touched si el formulario es inválido', () => {
    const correoCtrl = component.form.get('correo')!;
    expect(correoCtrl.touched).toBeFalse();

    component.onSubmit();

    // Ahora debería estar touched
    expect(correoCtrl.touched).toBeTrue();
  });

});
