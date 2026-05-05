import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../services/productos.service.js';
import { Producto } from '../../models/producto.js';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-detalle.html',
  styleUrls: ['./producto-detalle.scss']
})
export class ProductoDetalleComponent implements OnInit {

  producto?: Producto;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosSrv: ProductosService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID inválido';
      this.loading = false;
      return;
    }

    this.productosSrv.getProductoById(id).subscribe({
      next: (data: Producto) => { this.producto = data; this.loading = false; },
      error: (err: unknown) => {
        this.error = 'No se pudo obtener el producto.';
        this.loading = false;
        console.error('Error obtener por ID:', err);
      }
    });
  }
}
