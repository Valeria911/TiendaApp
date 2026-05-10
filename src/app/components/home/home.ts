import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  get estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  get nombreUsuario(): string {
    return this.authService.usuarioActual?.nombre ?? '';
  }

  get rolUsuario(): string {
    return this.authService.usuarioActual?.rol ?? '';
  }

  ngOnInit(): void {
  
    if (this.estaAutenticado) {
    this.router.navigate(['/tienda']);
    }
  }

  irAProductos(): void {
    this.router.navigate(['/tienda']);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}