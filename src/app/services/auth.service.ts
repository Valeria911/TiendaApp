import { Injectable, signal } from '@angular/core';
import { Usuario, RolUsuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'usuario_autenticado';

  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Felipe Gómez',
      correo: 'felipe.gomez@tiendaonline.cl',
      contrasena: 'Ventas123',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: '2025-07-12'
    },
    {
      id: 2,
      nombre: 'Maria Rodríguez',
      correo: 'maria.rodriguez@tiendaonline.cl',
      contrasena: 'Ventas123',
      rol: 'VENDEDOR',
      activo: true,
      fechaRegistro: '2025-10-09'
    },
    {
      id: 3,
      nombre: 'Daniel Fernández',
      correo: 'daniel.fernandez@tiendaonline.cl',
      contrasena: 'Ventas123',
      rol: 'ADMIN',
      activo: true,
      fechaRegistro: '2025-07-15'
    }
  ];

  usuarioActual = signal<Usuario | null>(this.obtenerUsuarioDesdeStorage());

  constructor() {}

  /**
   * @param correo correo ingresado
   * @param contrasena contraseña ingresada
   * @returns resultado del intento de autenticación
   */
  login(correo: string, contrasena: string): {
    exito: boolean;
    mensaje: string;
    usuario?: Usuario;
  } {
    const usuarioEncontrado = this.usuarios.find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase().trim()
    );

    if (!usuarioEncontrado) {
      return {
        exito: false,
        mensaje: 'No existe usuario registrado con ese correo'
      };
    }

    if (usuarioEncontrado.contrasena !== contrasena) {
      return {
        exito: false,
        mensaje: 'La contraseña ingresada es incorrecta.'
      };
    }

    if (!usuarioEncontrado.activo) {
      return {
        exito: false,
        mensaje: 'El usuario está inactivo.'
      };
    }

    this.usuarioActual.set(usuarioEncontrado);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarioEncontrado));

    return {
      exito: true,
      mensaje: `Bienvenido/a, ${usuarioEncontrado.nombre}.`,
      usuario: usuarioEncontrado
    };
  }

  registrarUsuario(nuevoUsuario: {
    nombre: string;
    correo: string;
    contrasena: string;
    rol: RolUsuario;
    activo: boolean;
  }): { exito: boolean; mensaje: string; usuario?: Usuario } {

    const existeCorreo = this.usuarios.some(
      (u) => u.correo.toLowerCase() === nuevoUsuario.correo.toLowerCase().trim()
    );

    if (existeCorreo) {
      return {
        exito: false,
        mensaje: 'Existe un usuario registrado con ese correo'
      };
    }

    const nuevoId =
      this.usuarios.length > 0
        ? Math.max(...this.usuarios.map((u) => u.id)) + 1
        : 1;

    const usuarioCreado: Usuario = {
      id: nuevoId,
      nombre: nuevoUsuario.nombre.trim(),
      correo: nuevoUsuario.correo.trim(),
      contrasena: nuevoUsuario.contrasena,
      rol: nuevoUsuario.rol,
      activo: nuevoUsuario.activo,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    this.usuarios.push(usuarioCreado);

    return {
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioCreado
    };
  }

  // Cierra la sesión actual y limpia el almacenamiento local
  logout(): void {
    this.usuarioActual.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  tieneRol(rol: RolUsuario): boolean {
    return this.usuarioActual()?.rol === rol;
  }

  obtenerUsuarios(): Usuario[] {
    return [...this.usuarios];
  }

  private obtenerUsuarioDesdeStorage(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as Usuario : null;
  }
}