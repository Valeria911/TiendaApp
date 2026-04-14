// Definición de la estructura del objeto Producto
// Funciones:
// - recibir datos desde el backend
// - enviar datos al crear un producto
// - enviar datos al actualizar un producto

export interface Producto {
  // ID único del producto
  // Es opcional porque al crear un producto nuevo
  // normalmente el backend genera este valor automáticamente.
  id?: number;

  // Nombre del producto
  nombre: string;

  // Descripción del producto
  descripcion: string;

  // Precio del producto
  precio: number;

  // Stock del producto
  stock: number;
}