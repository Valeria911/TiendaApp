import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  correo = '';
  contrasena = '';

  mensajeError = '';
  mensajeExito = '';

  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(form: NgForm): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (form.invalid) {
      this.mensajeError = 'Debes completar los campos del formulario';
      return;
    }

    this.cargando = true;

    //prueba de carga
    setTimeout(() => {
      const resultado = this.authService.login(this.correo, this.contrasena);

      if (!resultado.exito) {
        this.mensajeError = resultado.mensaje;
        this.cargando = false;
        return;
      }

      this.mensajeExito = resultado.mensaje;
      this.cargando = false;

      this.router.navigate(['/productos']);
    }, 500);
  }

  //carga datos admin para pruebas rápidas
  cargarAdminDemo(): void {
    this.correo = 'juanperez@ymail.com';
    this.contrasena = 'Compras123';
  }

  cargarVendedorDemo(): void {
    this.correo = 'vendedor@tiendaonline.cl';
    this.contrasena = 'Ventas123';
  }
}
