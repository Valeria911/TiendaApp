import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service.js';
import { AuthService } from '../../services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrls: ['./lista-usuarios.scss']
})
export class UsuariosListaComponent implements OnInit {

  private usuariosSrv = inject(UsuariosService);
  private auth = inject(AuthService);
  private router = inject(Router);

  usuarios: any[] = [];
  error = '';

  ngOnInit(): void {
    if (this.auth.usuarioActual?.rol !== 'ADMIN') {
      this.error = 'Acceso denegado: solo un ADMIN puede ver esta sección.';
      return;
    }

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosSrv.obtenerTodos().subscribe({
      next: (data: any[]) => this.usuarios = data,
      error: () => this.error = 'Error cargando usuarios.'
    });
  }
}

