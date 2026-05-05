import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  get estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  get esAdmin(): boolean {
    return this.authService.esAdmin();
  }

  get esVendedor(): boolean {
    return this.authService.esVendedor();
  }

  get nombreUsuario(): string {
    return this.authService.usuarioActual?.nombre ?? '';
  }

  get rolUsuario(): string {
    return this.authService.usuarioActual?.rol ?? '';
  }

  cerrarSesion(): void {

    this.authService.logout();

    this.router.navigate(['/home']);
  }
}
