import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsuariosService } from './usuarios.service';
import { Usuario } from '../models/usuario';

describe('UsuariosService', () => {

  let service: UsuariosService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/usuarios';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosService]
    });

    service = TestBed.inject(UsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  //smoke test
  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar login correctamente (POST /login)', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre: 'Admin',
      correo: 'admin@mail.com',
      contrasena: '1234',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: '2024-01-01T00:00:00Z'
    };

    service.login('admin@mail.com', '1234').subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo: 'admin@mail.com', contrasena: '1234' });

    req.flush(mockUsuario);
  });

  it('debería registrar un usuario (POST /registro)', () => {
    const nuevoUsuario: Usuario = {
      id: 5,
      nombre: 'Nuevo',
      correo: 'nuevo@mail.com',
      contrasena: '1111',
      rol: 'VENDEDOR',
      activo: true,
      fechaRegistro: '2024-06-01T00:00:00Z'
    };

    service.registrar(nuevoUsuario).subscribe((resp) => {
      expect(resp).toEqual(nuevoUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoUsuario);

    req.flush(nuevoUsuario);
  });

  it('debería recuperar un usuario por correo (GET /recuperar/correo)', () => {
    const mockUsuario: Usuario = {
      id: 22,
      nombre: 'Test',
      correo: 'test@mail.com',
      contrasena: '123',
      rol: 'CLIENTE',
      activo: true,
      fechaRegistro: '2024-01-01T00:00:00Z'
    };

    service.recuperarPorcorreo('test@mail.com').subscribe((resp) => {
      expect(resp).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/recuperar/test@mail.com`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsuario);
  });

  it('debería obtener usuario por ID (GET /:id)', () => {
    const mockUsuario: Usuario = {
      id: 10,
      nombre: 'Usuario 10',
      correo: 'u10@mail.com',
      contrasena: '111',
      rol: 'VENDEDOR',
      activo: true,
      fechaRegistro: '2024-01-01T00:00:00Z'
    };

    service.obtenerPorId(10).subscribe((resp) => {
      expect(resp).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/10`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsuario);
  });

  it('debería actualizar perfil (PUT /:id/perfil)', () => {
    const cambios = {
      nombre: 'Nuevo Nombre',
      correo: 'actualizado@mail.com'
    };

    const respuesta: Usuario = {
      id: 1,
      nombre: 'Nuevo Nombre',
      correo: 'actualizado@mail.com',
      contrasena: '1',
      rol: 'CLIENTE',
      activo: true,
      fechaRegistro: '2024-01-01T00:00:00Z'
    };

    service.actualizarPerfil(1, cambios).subscribe(resp => {
      expect(resp).toEqual(respuesta);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/perfil`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush(respuesta);
  });

  it('debería obtener todos los usuarios (GET /)', () => {
    const listaMock: Usuario[] = [
      { id: 1, nombre: 'Juan Perez', correo: 'a@mail.com', contrasena: '1111111', activo: true, rol: 'ADMIN', fechaRegistro: '2024-01-01T00:00:00Z' },
      { id: 2, nombre: 'Maria Gomez', correo: 'b@mail.com', contrasena: '13333333', activo: true, rol: 'VENDEDOR', fechaRegistro: '2024-01-01T00:00:00Z' }
    ];

    service.obtenerTodos().subscribe(resp => {
      expect(resp.length).toBe(2);
      expect(resp).toEqual(listaMock);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');

    req.flush(listaMock);
  });

});
