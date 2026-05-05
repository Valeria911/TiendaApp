import { TestBed } from '@angular/core/testing';
import { ProductoFormComponent } from './producto-form.js';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Producto } from '../../models/producto.js';
import { ProductosService } from '../../services/productos.service.js';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

class ProductosServiceMock implements Partial<ProductosService> {

  getProductoById(id: number) {
    return of({
      id,
      nombre: 'producto Editado',
      descripcion: 'Descripción del producto editado',
      precio: 19.99,
      stock: 10
    } as Producto);
  }

  create(payload: Producto) {
    return of({ ...payload, id: 999 }); // simular creación
  }

  update(id: number, payload: Producto) {
    return of({ ...payload, id });
  }
}

// ======================================================================
// CREACIÓN DEL SPEC
// ======================================================================

describe('productoFormComponent (Semana 7)', () => {

  let component: ProductoFormComponent;
  let fixture: any;

  let productosSrv: ProductosServiceMock;
  let router: Router;

  beforeEach(async () => {
    productosSrv = new ProductosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        ProductoFormComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductosService, useValue: productosSrv },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}) 
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  
  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  // ======================================================================
  // 2) Formulario reactivo debería crearse con todos los campos
  // ======================================================================
  it('debería construir el formulario con validaciones', () => {
    component.ngOnInit();

    expect(component.form).toBeTruthy();
    expect(component.form.get('nombre')).toBeTruthy();
    expect(component.form.get('descripcion')).toBeTruthy();
    expect(component.form.get('precio')).toBeTruthy();
    expect(component.form.get('stock')).toBeTruthy();
  });

  it('debería entrar en modo edición y cargar datos por ID', () => {

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [
        ProductoFormComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductosService, useValue: productosSrv },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 10 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoFormComponent);
    component = fixture.componentInstance;

    component.ngOnInit();

    expect(component.editMode).toBeTrue();
    expect(component.productoId).toBe(10);

    expect(component.form.value.nombre).toBe('producto Editado');
  });

  it('debería manejar error si getProductoById falla', () => {

    spyOn(productosSrv, 'getProductoById').and.returnValue(
      throwError(() => new Error('Error getById'))
    );

    (component as any).route = {
      params: of({ id: 5 })
    };

    component.ngOnInit();

    expect(component.error).toBe('No se pudo cargar el producto');
    expect(component.loading).toBeFalse();
  });

  it('debería crear cuando el formulario es válido y no hay ID', () => {
    component.ngOnInit();

    spyOn(productosSrv, 'create').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    component.form.setValue({
      nombre: 'Nuevo producto',
      descripcion: 'Francesco',
      precio: 100,
      stock: 10
    });

    component.onSubmit();

    expect(productosSrv.create).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/productos']);
  });

  it('debería actualizar cuando editMode es true', () => {

    component.ngOnInit();
    component.editMode = true;
    component.productoId = 77;

    spyOn(productosSrv, 'update').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    component.form.setValue({
      nombre: 'Editado',
      descripcion: 'producto editado',
      precio: 150,
      stock: 5
    });

    component.onSubmit();

    expect(productosSrv.update).toHaveBeenCalledWith(77, component.form.value);
    expect(routerSpy).toHaveBeenCalledWith(['/productos']);
  });

  it('no debería enviar si el formulario es inválido', () => {
    component.ngOnInit();

    spyOn(productosSrv, 'create');

    component.form.patchValue({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: ''
    });

    component.onSubmit();

    expect(productosSrv.create).not.toHaveBeenCalled();
  });

});
