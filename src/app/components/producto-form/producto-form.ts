import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.scss'
})

export class ProductoForm implements OnInit {

    producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 1000,
    stock: 0
  };

  modoEdicion = false;

  idProducto: number | null = null;

  mensajeError = '';

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicion = true;
      this.idProducto = Number(idParam);
      this.cargarProducto(this.idProducto);
    }
  }

  cargarProducto(id: number): void {
    this.productosService.getProductoById(id).subscribe({
      next: (data) => {
        console.log('Producto cargado para edición:', data);
        this.producto = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar el producto para editar:', error);
        this.mensajeError = 'No se pudo cargar el producto para edición.';
        this.cdr.markForCheck();
      }
    });
  }

  guardarProducto(formulario: NgForm): void {
    this.mensajeError = '';

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    console.log('Producto a guardar:', this.producto);

    if (this.modoEdicion && this.idProducto !== null) {
      this.actualizarProducto();
    } else {
      this.crearProducto();
    }
  }

  crearProducto(): void {
    this.productosService.createProducto(this.producto).subscribe({
      next: (respuesta) => {
        console.log('Producto guardado correctamente:', respuesta);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Error al guardar el producto:', error);
        this.mensajeError = this.obtenerMensajeError(error);
        this.cdr.markForCheck();
      }
    });
  }

  actualizarProducto(): void {
    if (this.idProducto === null) return;

    this.productosService.updateProducto(this.idProducto, this.producto).subscribe({
      next: (respuesta) => {
        console.log('Producto actualizado correctamente:', respuesta);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.mensajeError = this.obtenerMensajeError(error);
        this.cdr.markForCheck();
      }
    });
  }

  obtenerMensajeError(error: any): string {
    if (error?.status === 400) {
      return 'Los datos enviados no cumplen las validaciones requeridas. Revisa el formulario.';
    }

    return 'Ocurrió un error al procesar la solicitud. Reintenta';
  }
}