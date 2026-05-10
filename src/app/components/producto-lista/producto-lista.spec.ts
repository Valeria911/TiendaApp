import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosListaComponent } from './producto-lista';

describe('ProductosListaComponent', () => {
  let component: ProductosListaComponent;
  let fixture: ComponentFixture<ProductosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
