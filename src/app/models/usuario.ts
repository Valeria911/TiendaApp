export type RolUsuario = 'ADMIN' | 'VENDEDOR' | 'CLIENTE';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  activo: boolean;
  fechaRegistro: string;
}