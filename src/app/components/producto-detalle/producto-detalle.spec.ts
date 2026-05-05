import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductoDetalleComponent } from './producto-detalle.js';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { ProductosService } from '../../services/productos.service.js';
import { Producto } from '../../models/producto.js';

// Mock del servicio ProductosService
class ProductosServiceMock {
  getById(id: number): Observable<Producto> {
    // Valor por defecto, se sobrescribe en cada prueba
    return of({} as Producto);
  }
}

describe('ProductoDetalleComponent', () => {

  let component: ProductoDetalleComponent;
  let fixture: ComponentFixture<ProductoDetalleComponent>;
  let productosSrvMock: ProductosServiceMock;

  beforeEach(async () => {

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => "1"
        }
      }
    };

    productosSrvMock = new ProductosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        ProductoDetalleComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProductosService, useValue: productosSrvMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoDetalleComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar un producto correctamente en ngOnInit', () => {
    const mockProducto: Producto = {
      id: 1,
      nombre: 'Producto Test',
      descripcion: 'Producto de prueba para tests',
      precio: 99.99,
      stock: 100
    };

    spyOn(productosSrvMock, 'getById').and.returnValue(of(mockProducto));

    component.ngOnInit();

    expect(productosSrvMock.getById).toHaveBeenCalledWith(1);
    expect(component.producto).toEqual(mockProducto);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('debería manejar error si getById falla', () => {
    spyOn(productosSrvMock, 'getById')
      .and.returnValue(throwError(() => new Error('Backend error')));

    component.ngOnInit();

    expect(component.producto).toBeUndefined();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('No se pudo obtener el producto');
  });

  it('debería marcar error si el ID es inválido', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as any) = () => null;

    component.ngOnInit();

    expect(component.error).toBe('ID inválido');
    expect(component.loading).toBeFalse();
  });

});
