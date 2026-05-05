import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service.js';
import { AuthService } from '../../../services/auth.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensajeError: string | null = null;
  cargando = false;

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]]
  });

  
  onSubmit(): void {
    this.mensajeError = null;

    if (this.form.invalid) {
      this.mensajeError = 'Por favor complete el formulario correctamente';
      this.form.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.form.value;
    if (!correo || !contrasena) {
      this.mensajeError = 'correo y contraseña son obligatorios';
      return;
    }

    this.cargando = true;

    this.usuariosService.login(correo, contrasena).subscribe({
      next: (usuario: any) => {
        this.cargando = false;
        this.authService.login(usuario);
        this.router.navigate(['/productos']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error en login', err);
        this.mensajeError = 'Credenciales inválidas';
      }
    });
  }
}
