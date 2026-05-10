import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-lista.html',
  styleUrls: ['./producto-lista.scss']
})
export class ProductosListaComponent implements OnInit {

  productos: Producto[] = [];
  loading = true;
  error = '';

  // 👇 NUEVO: exponer AuthService para usar en el HTML
  public auth = inject(AuthService);

  constructor(private productosSrv: ProductosService) {}

  ngOnInit(): void {
    this.productosSrv.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      }
    });
  }

  eliminar(id?: number): void {
    if (!id) return;
    const ok = confirm('¿Seguro que deseas eliminar este producto?');
    if (!ok) return;

    this.productosSrv.deleteProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== id);
        alert('✅ Producto eliminado correctamente');
      },
      error: () => {
        alert('No se pudo eliminar el producto');
      }
    });
  }

}
