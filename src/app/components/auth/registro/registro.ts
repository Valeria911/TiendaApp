import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  mensajeError: string | null = null;
  mensajeOk: string | null = null;
  cargando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]  });

  onSubmit(): void {
    this.mensajeError = null;
    this.mensajeOk = null;

    if (this.form.invalid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente';
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, correo, contrasena } = this.form.value;
    if (!nombre || !correo || !contrasena) {
      this.mensajeError = 'Nombre, correo y contraseña son obligatorios';
      return;
    }

    this.cargando = true;

    this.usuariosService.registrar({
      id: 0, // El backend asignará el ID real
      nombre,
      correo,
      contrasena,
      rol: "CLIENTE",
      activo: true,
      fechaRegistro: new Date().toISOString()
    }).subscribe({
      next: (usuario: any) => {
        this.cargando = false;
        this.mensajeOk = `Usuario ${usuario.nombre} registrado correctamente. Ahora puedes iniciar sesión`;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error en registro', err);
        this.mensajeError = 'No fue posible registrar el usuario. Verifica usar un correo diferente';
      }
    });
  }
}

