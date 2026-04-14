import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss'
})
export class ProductoDetalle implements OnInit {

  producto: Producto | null = null;

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      this.cargarProducto(id);
    }
  }

  cargarProducto(id: number): void {
    this.productosService.getProductoById(id).subscribe({
      next: (data) => {
        console.log('Detalle del producto recibido:', data);

        this.producto = data;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener el detalle del producto:', error);
      }
    });
  }

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }
}