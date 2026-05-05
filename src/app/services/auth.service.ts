import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.js';

const STORAGE_KEY_USUARIO = 'usuarioActual';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //reflejar cambios en tiempo real
  private usuarioActualSubject: BehaviorSubject<Usuario | null>;
  public usuarioActual$: Observable<Usuario | null>;

  constructor() {
    //usuario desde localStorage
    const usuarioGuardado = localStorage.getItem(STORAGE_KEY_USUARIO);

    const usuarioInicial: Usuario | null = usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;

    this.usuarioActualSubject = new BehaviorSubject<Usuario | null>(usuarioInicial);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  login(usuario: Usuario): void {
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
  }

  loginLocal(usuarioActualizado: Usuario): void {
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuarioActualizado));
    this.usuarioActualSubject.next(usuarioActualizado);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USUARIO);
    this.usuarioActualSubject.next(null);
  }

  estaAutenticado(): boolean {
    return !!this.usuarioActualSubject.value;
  }

  esAdmin(): boolean {
    return this.usuarioActualSubject.value?.rol === 'ADMIN';
  }

  esVendedor(): boolean {
    return this.usuarioActualSubject.value?.rol === 'VENDEDOR';
  }
}
