import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../services/productos.service.js';
import { Producto } from '../../models/producto.js';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.scss']
})
export class ProductoFormComponent implements OnInit {

  form!: FormGroup;     
  editMode = false;     
  productoId?: number;  
  loading = false;      
  error = '';           

  constructor(
    private fb: FormBuilder,
    private productosSrv: ProductosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.editMode = true;
        this.productoId = +params['id'];
        this.loading = true;

        this.productosSrv.getProductoById(this.productoId).subscribe({
          next: (producto: Producto) => {
            this.form.patchValue(producto);
            this.loading = false;
          },
          error: (err: unknown) => {
            this.error = 'No se pudo cargar el producto';
            this.loading = false;
            console.error('Error obtener por ID:', err);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }

    const payload: Producto = this.form.value;

    if (this.editMode && this.productoId) {
      this.productosSrv.updateProducto(this.productoId, payload).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/productos']);
        },
        error: (err: unknown) => {
          console.error('Error al actualizar:', err);
          alert('No se pudo actualizar el producto');
        }
      });
    } else {
      this.productosSrv.createProducto(payload).subscribe({
        next: () => {
          alert('Producto creado correctamente');
          this.router.navigate(['/productos']);
        },
        error: (err: unknown) => {
          console.error('Error al crear:', err);
          alert('No se pudo crear el producto');
        }
      });
    }
  }

  //helpers
  hasError(ctrl: string, error?: string): boolean {
    const c = this.form.get(ctrl);
    if (!c) return false;

    if (!error) {
      return !!(c.invalid && (c.dirty || c.touched));
    }
    
    return !!(c.touched && c.hasError(error));
  }

}

