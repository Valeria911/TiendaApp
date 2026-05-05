import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.js';
import { environment } from '../environments/environment.js';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  //para docker y pruebas locales, se puede cambiar la URL según sea necesario
  //private apiUrl = 'http://localhost:8081/api/productos';
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
 
  //obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  //obtener un producto por su ID
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  //crear un nuevo producto
  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  //actualizar un producto existente
  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  //eliminar un producto por su ID
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}