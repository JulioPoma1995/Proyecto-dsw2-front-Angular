import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaService } from '../../../services/factura.service';
import { CustomerService } from '../../../core/api/customerService';
import { Client } from '../../../models/cliente.interface';

interface Producto {
  id: number;
  name: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  category: string;
  price: number;
}

interface ProductoSeleccionado {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
  clientes: Client[] = [];
  productos: Producto[] = [];

  clienteSeleccionado: Client | null = null;
  productosSeleccionados: ProductoSeleccionado[] = [];
  clienteBusqueda = '';
  productoBusqueda = '';
  clientesFiltrados: Client[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  
  cargandoProductos = false;
  cargandoClientes = false;

  constructor(
    private dialogRef: MatDialogRef<FacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facturaService: FacturaService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    console.log('🏗️ Constructor FacturaComponent ejecutado');
    console.log('📦 Data recibida:', this.data);
    
    // Inicializar arrays vacíos
    this.clientesFiltrados = [];
    this.productosFiltrados = [];
    
    console.log('✅ Arrays inicializados - ClientesFiltrados:', this.clientesFiltrados.length);
    console.log('✅ Arrays inicializados - ProductosFiltrados:', this.productosFiltrados.length);
  }

  ngOnInit() {
    console.log('🚀 FacturaComponent inicializado');
    console.log('📊 Estado inicial - Productos:', this.productos.length);
    console.log('📊 Estado inicial - ProductosFiltrados:', this.productosFiltrados.length);
    console.log('📊 Estado inicial - Clientes:', this.clientes.length);
    
    this.cargarProductos();
    this.cargarClientes();
  }

  cargarProductos() {
    console.log('🔄 Iniciando carga de productos...');
    this.cargandoProductos = true;
    this.facturaService.getListadoProductos().subscribe({
      next: (response) => {
        console.log('✅ Productos cargados exitosamente:', response);
        console.log('📊 Cantidad de productos recibidos:', response.length);
        this.productos = response;
        console.log('💾 Productos asignados al array:', this.productos);
        this.filtrarProductos();
        this.cargandoProductos = false;
        console.log('🏁 Carga de productos completada');
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        this.snackBar.open('Error al cargar productos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.cargandoProductos = false;
      }
    });
  }

  cargarClientes() {
    console.log('🔄 Iniciando carga de clientes...');
    this.cargandoClientes = true;
    this.customerService.getAll().subscribe({
      next: (response) => {
        console.log('✅ Clientes cargados exitosamente:', response);
        console.log('📊 Cantidad de clientes recibidos:', response.length);
        this.clientes = response;
        console.log('💾 Clientes asignados al array:', this.clientes);
        this.filtrarClientes();
        this.cargandoClientes = false;
        console.log('🏁 Carga de clientes completada');
      },
      error: (error) => {
        console.error('❌ Error al cargar clientes:', error);
        this.snackBar.open('Error al cargar clientes', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.cargandoClientes = false;
      }
    });
  }

  filtrarClientes() {
    console.log('🔍 Filtrando clientes con término:', this.clienteBusqueda);
    if (!this.clienteBusqueda) {
      this.clientesFiltrados = [...this.clientes];
      console.log('📋 Mostrando todos los clientes:', this.clientesFiltrados.length);
      return;
    }
    const termino = this.clienteBusqueda.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.name.toLowerCase().includes(termino) ||
      c.lastname.toLowerCase().includes(termino) ||
      c.dni.toLowerCase().includes(termino)
    );
    console.log('🎯 Clientes filtrados encontrados:', this.clientesFiltrados.length);
  }

  filtrarProductos() {
    console.log('🔍 Iniciando filtrado de productos...');
    console.log('📦 Productos originales:', this.productos);
    console.log('📦 Cantidad de productos originales:', this.productos.length);
    
    // Para el combobox, mostramos todos los productos disponibles
    this.productosFiltrados = [...this.productos];
    
    console.log('🎯 Productos filtrados:', this.productosFiltrados);
    console.log('🎯 Cantidad de productos filtrados:', this.productosFiltrados.length);
    
    // Verificar si hay productos con datos válidos
    if (this.productosFiltrados.length > 0) {
      console.log('🔍 Primer producto como ejemplo:', this.productosFiltrados[0]);
      console.log('🔍 Propiedades del primer producto:', {
        id: this.productosFiltrados[0].id,
        nombre: this.productosFiltrados[0].name,
        descripcion: this.productosFiltrados[0].description,
        precio: this.productosFiltrados[0].price,
        stock: this.productosFiltrados[0].totalQuantity
      });
      
      // Verificar si hay productos con precio undefined
        const productosSinPrecio = this.productosFiltrados.filter(p => p.price === undefined || p.price === null);
      if (productosSinPrecio.length > 0) {
        console.warn('⚠️ Productos sin precio encontrados:', productosSinPrecio);
      }
      
      // Verificar si hay productos con nombre undefined
      const productosSinNombre = this.productosFiltrados.filter(p => !p.name);
      if (productosSinNombre.length > 0) {
        console.warn('⚠️ Productos sin nombre encontrados:', productosSinNombre);
      }
    }
  }

  onProductoSeleccionado() {
    console.log('🎯 onProductoSeleccionado ejecutado');
    console.log('📦 Producto seleccionado:', this.productoSeleccionado);
    
    if (this.productoSeleccionado) {
      console.log('✅ Agregando producto a la factura:', this.productoSeleccionado.name);
      this.agregarProducto(this.productoSeleccionado);
      this.productoSeleccionado = null; // Limpiar selección
      console.log('🧹 Selección limpiada');
    } else {
      console.log('⚠️ No hay producto seleccionado');
    }
  }

  seleccionarCliente(cliente: Client) {
    console.log('👤 Cliente seleccionado:', cliente);
    this.clienteSeleccionado = cliente;
    this.clienteBusqueda = '';
    console.log('✅ Cliente asignado y búsqueda limpiada');
  }

  agregarProducto(producto: Producto) {
    const existente = this.productosSeleccionados.find(p => p.producto.id === producto.id);
    if (existente) {
      existente.cantidad++;
      this.snackBar.open(`Cantidad de ${producto.name} aumentada a ${existente.cantidad}`, 'Cerrar', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.productosSeleccionados.push({ producto, cantidad: 1 });
      this.snackBar.open(`${producto.name} agregado a la factura`, 'Cerrar', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }
  }

  ajustarCantidad(index: number, cambio: number) {
    const item = this.productosSeleccionados[index];
    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad < 1) {
      this.removerProducto(index);
    } else {
      item.cantidad = nuevaCantidad;
    }
  }

  removerProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  calcularSubtotal(): number {
    return this.productosSeleccionados.reduce((total, item) =>
      total + (item.producto.price * item.cantidad), 0);
  }

  calcularIgv(): number {
    return this.calcularSubtotal() * 0.18;
  }

  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularIgv();
  }

  generarFactura() {
    if (!this.clienteSeleccionado || this.productosSeleccionados.length === 0) return;

    const factura = {
      customerId: this.clienteSeleccionado.id,
      details: this.productosSeleccionados.map(item => ({
        productId: item.producto.id,
        productName: item.producto.name,
        quantity: item.cantidad,
        price: item.producto.price
      }))
    };

    this.dialogRef.close(factura);
  }

  // Función para comparar productos en el mat-select
  compareProductos(producto1: Producto, producto2: Producto): boolean {
    return producto1 && producto2 ? producto1.id === producto2.id : producto1 === producto2;
  }

  // Función para comparar clientes en el mat-select
  compareClientes(cliente1: Client, cliente2: Client): boolean {
    return cliente1 && cliente2 ? cliente1.id === cliente2.id : cliente1 === cliente2;
  }

  // Función helper para formatear precio de manera segura
  formatearPrecio(precio: number | undefined | null): string {
    if (precio === undefined || precio === null) {
      return '0.00';
    }
    return precio.toFixed(2);
  }
}
