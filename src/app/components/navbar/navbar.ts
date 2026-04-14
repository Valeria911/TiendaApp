import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  usuarioActual = computed(() => this.authService.usuarioActual());

  esAdmin = computed(() => this.authService.tieneRol('ADMIN'));

  esVendedor = computed(() => this.authService.tieneRol('VENDEDOR'));

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}