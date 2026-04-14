import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RolUsuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class RegistroComponent {

  nombre = '';
  correo = '';
  contrasena = '';
  confirmarContrasena = '';
  rol: RolUsuario = 'VENDEDOR';
  activo = true;

  mensajeError = '';
  mensajeExito = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(form: NgForm): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (form.invalid) {
      this.mensajeError = 'Completa los campos obligatorios';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mensajeError = 'La contraseña no coincide';
      return;
    }

    const validacionContrasena = this.validarContrasena(this.contrasena);
    if (!validacionContrasena.valida) {
      this.mensajeError = validacionContrasena.mensaje;
      return;
    }

    const resultado = this.authService.registrarUsuario({
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      rol: this.rol,
      activo: this.activo
    });

    if (!resultado.exito) {
      this.mensajeError = resultado.mensaje;
      return;
    }

    this.mensajeExito = resultado.mensaje;

    form.resetForm({
      rol: 'VENDEDOR',
      activo: true
    });

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  //validaciones de contrasña
  validarContrasena(password: string): { valida: boolean; mensaje: string } {
    if (password.length < 6) {
      return { valida: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
    }

    if (password.length > 12) {
      return { valida: false, mensaje: 'La contraseña no debe superar los 12 caracteres' };
    }

    if (!/[A-Za-z]/.test(password)) {
      return { valida: false, mensaje: 'La contraseña debe incluir al menos una letra' };
    }

    if (!/[0-9]/.test(password)) {
      return { valida: false, mensaje: 'La contraseña debe incluir al menos un número' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\/\[\];'+=]/.test(password)) {
      return { valida: false, mensaje: 'La contraseña debe incluir al menos un carácter especial' };
    }

    return { valida: true, mensaje: 'Contraseña válida' };
  }
}
