import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.scss'
})
export class ProductoLista implements OnInit {

  productos: Producto[] = [];

  productosFiltrados: Producto[] = [];

  textoBusqueda = '';

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('COMPONENTE PRODUCTOS CARGADO');

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        console.log('Productos recibidos:', data);
        this.productos = data;
        this.productosFiltrados = data;

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  filtrarProductos(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();
    if (!texto) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto) ||
      producto.precio.toString().includes(texto)
    );
  }

  eliminarProducto(id: number | undefined): void {

    if (!id) return;
    if (!this.esAdmin()) {
      alert('No tiene permisos para eliminar productos');
      return;
    }

    const confirmado = confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (!confirmado) return;

    this.productosService.deleteProducto(id).subscribe({
      next: () => {
        console.log(`Producto con id ${id} eliminado correctamente`);

        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  esVendedor(): boolean {
    return this.authService.tieneRol('VENDEDOR');
  }
}