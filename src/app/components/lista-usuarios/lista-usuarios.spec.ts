import { TestBed } from '@angular/core/testing';
import { UsuariosListaComponent } from './lista-usuarios';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError, Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';

class AuthServiceMock {

  usuarioActual: Usuario | null = {
    id: 1,
    nombre: 'Admin Test',
    correo: 'admin@test.cl',
    contrasena: '1234',
    rol: 'ADMIN',
    activo: true,
    fechaRegistro: '2024-01-01T00:00:00Z'
  };

  estaAutenticado() { return true; }
  esAdmin() { return this.usuarioActual?.rol === 'ADMIN'; }
  esVendedor() { return this.usuarioActual?.rol === 'VENDEDOR'; }
}

class UsuariosServiceMock {

  obtenerTodos(): Observable<Usuario[]> {
    return of([] as Usuario[]);
  }
}


describe('UsuariosListaComponent', () => {

  let component: UsuariosListaComponent;
  let fixture: any;
  let authMock: AuthServiceMock;
  let usuariosMock: UsuariosServiceMock;

  beforeEach(async () => {

    authMock = new AuthServiceMock();
    usuariosMock = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        UsuariosListaComponent,      
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthServiceMock, useValue: authMock },
        { provide: UsuariosServiceMock, useValue: usuariosMock },

        { provide: 'AuthService', useExisting: AuthServiceMock },
        { provide: 'UsuariosService', useExisting: UsuariosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosListaComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería denegar acceso si el usuario no es ADMIN', () => {
    authMock.usuarioActual!.rol = 'VENDEDOR';

    component.ngOnInit();

    expect(component.error).toBe('Acceso denegado: solo un ADMIN puede ver esta sección');
    expect(component.usuarios.length).toBe(0);
  });

  
  it('debería cargar usuarios cuando el usuario ES admin', () => {

    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: 'Admin', correo: 'a@a.com', contrasena: '1', rol: 'ADMIN', activo: true, fechaRegistro: '2024-01-01T00:00:00Z' },
      { id: 2, nombre: 'Vendedor', correo: 'b@b.com', contrasena: '1', rol: 'VENDEDOR', activo: true, fechaRegistro: '2024-01-01T00:00:00Z' }
    ];

    spyOn(usuariosMock, 'obtenerTodos').and.returnValue(of(mockUsuarios));

    component.ngOnInit(); 

    expect(component.error).toBe('');
    expect(component.usuarios.length).toBe(2);
    expect(component.usuarios).toEqual(mockUsuarios);
  });


  it('debería manejar error cuando el servicio falla', () => {

    spyOn(usuariosMock, 'obtenerTodos').and.returnValue(
      throwError(() => new Error('Fallo servidor'))
    );

    component.ngOnInit();

    expect(component.error).toBe('Error cargando usuarios');
  });

});
