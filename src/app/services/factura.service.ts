import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Producto, Product} from '../models/producto.interface';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'https://panel-production-ad61.up.railway.app/api';

  constructor(private http: HttpClient) {
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers`);
  }

  crearCliente(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers`, client, {responseType: 'text' as 'json'});
  }

  eliminarCliente(id_cliente: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cliente/EliminarCliente/${id_cliente}`, {responseType: 'text'})
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar cliente', error);
          return throwError(error);
        })
      );
  }

  getCliente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Cliente/GetOneCliente/${id}`);
  }

  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Cliente/Update/${id}`, cliente, {responseType: 'text'});
  }

  getFacDetalle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/FacDetalle/GetOneFacDetalle/${id}`);
  }

  crearProducto(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, {responseType: 'text' as 'json'});
  }

  getListadoProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  actualizarProducto(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product, {responseType: 'text' as 'json'});
  }

  eliminarProducto(id_producto: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id_producto}`, {responseType: 'text'})
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar producto', error);
          return throwError(error);
        })
      );
  }

  getListadoClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Cliente/ListadoClientes`);
  }

  getListadoFacturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoices`);
  }

}
