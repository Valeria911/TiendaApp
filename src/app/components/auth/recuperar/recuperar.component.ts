import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service.js';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent {

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);

  mensajeError: string | null = null;
  mensajeOk: string | null = null;

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    this.mensajeError = null;
    this.mensajeOk = null;

    if (this.form.invalid) {
      this.mensajeError = 'Ingrese un correo válido';
      this.form.markAllAsTouched();
      return;
    }

    const correo = this.form.value.correo!;
    this.usuariosService.recuperarPorCorreo(correo).subscribe({
      next: (usuario: any) => {
        this.mensajeOk =
          `Usuario encontrado: ${usuario.nombre} (rol ${usuario.rol}). ` +
          `Contraseña actual: ${usuario.contrasena}`;
      },
      error: (err: any) => {
        console.error('Error al recuperar contraseña', err);
        this.mensajeError = 'No se encontró un usuario con ese correo';
      }
    });
  }
}
