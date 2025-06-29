import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FacturaService } from '../../services/factura.service';
import { Producto, Product } from '../../models/producto.interface';
import CrearProductoComponent from '../profile/mantenimiento/crear-producto/crear-producto.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModificarProductoComponent } from '../profile/mantenimiento/modificar-producto/modificar-producto.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CrearProductoComponent,
    ButtonModule, TableModule],
  providers: [FacturaService],
  animations: [
   trigger('overlayContentAnimation', [
      state('start', style({opacity: 0})),
      state('end', style({opacity: 1})),
      transition('start <=> end', animate('300ms ease-in-out')),
      ])
   ]
})
export default class ProfileComponent implements OnInit {
  cargando: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedProducto: Producto[] = [];
  public permision!: boolean;
  mensajeError: string = '';
  overlayState: string = 'start';
  productos: Producto[] = [];
  modalVisible = false;

  constructor(private facturaService: FacturaService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerListadoProductos();
  }

 openAdd() {
  this.dialog.open(CrearProductoComponent, {width: '750px',disableClose: true,})
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.obtenerListadoProductos();
          console.log('Modal cerrado con resultado:', result);
        }
      });
 }

  obtenerListadoProductos(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.facturaService.getListadoProductos().subscribe(
      (data) => {
        console.log("Se obtuvieron los productos")
        console.log(data)
        this.productos = data.map((Product: any) => ({
          ...Product
        }));
        this.overlayState = 'end';
        this.updatePaginatedProducto();
        this.totalPages = Math.ceil(this.productos.length / this.pageSize);
        this.cargando = false;
      },
      (error) => {
        console.error('Hubo un error al obtener los Productos', error);
        this.mensajeError = 'Error al cargar Productos';
        this.cargando = false;
      }
    );
  }

  openEdit(Product: any): void {
    const dialogRef = this.dialog.open(ModificarProductoComponent, { data: Product });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerListadoProductos();
      }
    });
  }

  openView(Product: any): void {
    const dialogRef = this.dialog.open(ModificarProductoComponent, { data: { Product, isViewMode: true } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerListadoProductos();
      }
    });
  }

  eliminarProducto(id_producto: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.facturaService.eliminarProducto(id_producto).subscribe(
        (response) => {
          this.obtenerListadoProductos();
        },
        (error) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }

  showModal() {
    this.modalVisible = true;
  }

  hideModal() {
    this.modalVisible = false;
  }

    refreshProductosList() {
    this.obtenerListadoProductos();
    this.hideModal();
  }
    updatePaginatedProducto() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducto = this.productos.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducto();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducto();
    }
  }
}
