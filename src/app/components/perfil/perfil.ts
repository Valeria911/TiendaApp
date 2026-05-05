import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service.js';
import { UsuariosService } from '../../services/usuarios.service.js';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.js';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent {

  private auth = inject(AuthService);
  private usuariosSrv = inject(UsuariosService);
  private router = inject(Router);

  mensaje = '';
  error = '';

  usuario: Usuario = {
    id: 0,
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'VENDEDOR',
    activo: true,
    fechaRegistro: new Date().toISOString()
  };

  constructor() {

    const sesion = this.auth.usuarioActual;

    if (!sesion) {
      this.error = 'No hay sesión activa.';
      return;
    }

    if (sesion.rol === 'VENDEDOR') {
      this.error = 'Un VENDEDOR no puede modificar perfil aquí.';
      return;
    }

    this.usuario = {
      id: sesion.id!,
      nombre: sesion.nombre,
      correo: sesion.correo,          
      contrasena: sesion.contrasena ?? '',
      rol: sesion.rol,               
      activo: sesion.activo ?? true,
      fechaRegistro: sesion.fechaRegistro ?? new Date().toISOString()
    };
  }

  guardarCambios(): void {
    this.mensaje = '';
    this.error = '';

    this.usuariosSrv.actualizarPerfil(this.usuario.id!, this.usuario).subscribe({
      next: (data: Usuario) => {
        this.mensaje = 'Perfil actualizado correctamente.';

        this.auth.loginLocal(data);

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: () => {
        this.error = 'No se pudieron guardar los cambios.';
      }
    });
  }
}