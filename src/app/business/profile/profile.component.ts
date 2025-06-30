import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FacturaService } from '../../services/factura.service';
import { Cliente, Client } from '../../models/cliente.interface';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import CrearClienteComponent from './mantenimiento/crear-cliente/crear-cliente.component';
import { state, style, animate, transition, trigger } from '@angular/animations';
import { ModificarClienteComponent } from './mantenimiento/modificar-cliente/modificar-cliente.component';
import { CustomerService } from '../../core/api/customerService';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CrearClienteComponent,
    ButtonModule,
    TableModule,
  ],
  providers: [CustomerService],
  animations: [
    trigger('overlayContentAnimation', [
      state('start', style({ opacity: 0 })),
      state('end', style({ opacity: 1 })),
      transition('start <=> end', animate('300ms ease-in-out')),
    ]),
  ],
})
export default class ProfileComponent implements OnInit {
  cargando: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedCliete: Cliente[] = [];
  mensajeError: string = '';
  overlayState: string = 'start';
  clientes: Cliente[] = [];
  modalVisible = false;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.obtenerListadoClientes();
  }

  openAdd() {
    this.dialog.open(CrearClienteComponent, { width: '750px', disableClose: true })
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.obtenerListadoClientes();
        }
      });
  }


  transformarClientACliente(api: Client): Cliente {
    return {
      id_cliente: api.id,
      nombre: api.name,
      apellido: api.lastname,
      documentoIdentidad: api.dni,
      direccion: api.address,
      telefono: api.numberPhone,
      email: api.email,
      FechaRegistro: new Date(),
      estado: true
    };
  }


  obtenerListadoClientes(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.customerService.getAll().subscribe(
      (data) => {
        this.clientes = data.map(this.transformarClientACliente);
<<<<<<< HEAD
=======
        console.log("this.clientes")
        console.log(this.clientes)
         this.clientes.map((item) => {console.log(item.estado);
>>>>>>> 0f676724733c609b97c468f953edac8fdb3fee48
         });

        this.totalPages = Math.ceil(this.clientes.length / this.pageSize);
        this.updatePaginatedCliente();
        this.overlayState = 'end';
        this.cargando = false;
      },
      (error) => {
        console.error('Error al obtener los clientes', error);
        this.mensajeError = 'Error al cargar clientes';
        this.cargando = false;
      }
    );
  }

  openEdit(cliente: any): void {
    const dialogRef = this.dialog.open(ModificarClienteComponent, { data: cliente });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerListadoClientes();
      }
    });
  }

  openView(cliente: any): void {
    const dialogRef = this.dialog.open(ModificarClienteComponent, { data: { cliente, isViewMode: true } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerListadoClientes();
      }
    });
  }

  eliminarCliente(id_cliente: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.customerService.delete(id_cliente).subscribe(
        (response) => {
          this.obtenerListadoClientes();
        },
        (error) => {
          console.error('Error al eliminar el cliente', error);
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

  refreshClientesList() {
    this.obtenerListadoClientes();
    this.hideModal();
  }

  updatePaginatedCliente() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCliete = this.clientes.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCliente();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCliente();
    }
  }
}
