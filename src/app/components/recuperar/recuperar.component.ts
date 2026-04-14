import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
  
})
export class RecuperarComponent {

  formRecuperar!: FormGroup;

  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder) {
    this.formRecuperar = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recuperar() {
    this.mensaje = '';
    this.error = '';

    if (this.formRecuperar.invalid) {
      this.formRecuperar.markAllAsTouched();
      return;
    }

    const email = this.formRecuperar.value.email;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
      this.error = 'Usuario no encontrado con ese correo.';
    } else {
      this.mensaje = `Hola ${usuario.nombre}, tu contraseña es: ${usuario.password}`;
    }
  }

  limpiar() {
    this.formRecuperar.reset();
    this.error = '';
    this.mensaje = '';
  }
}
