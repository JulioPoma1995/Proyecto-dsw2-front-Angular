import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {FacturaComponent} from '../documento/factura.component';
import {FacturaService} from '../../../services/factura.service';
import {HttpClientModule} from '@angular/common/http';

export interface FacturaDetail {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Factura {
  id: number;
  invoiceDate: string;
  totalAmount: number;
  customerId: number;
  customerName: string;
  details: FacturaDetail[];
}

@Component({
  selector: 'app-factura-lista',
  standalone: true,
  imports: [CommonModule, MatDialogModule, HttpClientModule],
  templateUrl: './factura-lista.component.html',
  styleUrl: './factura-lista.component.scss',
  providers: [FacturaService],
})

export default class FacturaListaComponent implements OnInit {
  facturas: Factura[] = [];

  constructor(
    private facturaService: FacturaService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.obtenerListadoFacturas();
  }

  obtenerListadoFacturas(): void {
    console.log('🔄 Iniciando llamada al API para obtener listado de facturas...');
    this.facturaService.getListadoFacturas().subscribe(
      (data) => {
        console.log('✅ Respuesta exitosa del API - Facturas obtenidas:', data);
        this.facturas = data;
        console.log('📊 Total de facturas cargadas:', this.facturas.length);
      },
      (error) => {
        console.error('❌ Error al obtener las facturas del API:', error);
        console.error('🔍 Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
      }
    );
  }

  openFacturaModal(): void {
    console.log('🔄 Abriendo modal de factura...');
    console.log('📋 FacturaComponent importado:', FacturaComponent);
    console.log('🔧 MatDialog disponible:', this.dialog);
    
    try {
      const dialogRef = this.dialog.open(FacturaComponent, {
        width: '90vw',
        maxWidth: '1500px',
        height: '90vh',
        maxHeight: '800px',
        panelClass: 'factura-modal',
        disableClose: false,
        data: {}
      });

      console.log('✅ Modal abierto exitosamente:', dialogRef);

      dialogRef.afterClosed().subscribe(result => {
        console.log('📋 Modal cerrado con resultado:', result);
        if (result) {
          console.log('✅ Nueva factura creada:', result);
          // Aquí podrías agregar la lógica para guardar la factura en el backend
          // Por ahora solo la agregamos a la lista local
          const nuevaFactura: Factura = {
            id: this.facturas.length + 1,
            invoiceDate: new Date().toISOString(),
            totalAmount: result.details.reduce((total: number, detail: any) => 
              total + (detail.price * detail.quantity), 0),
            customerId: result.customerId,
            customerName: 'Cliente', // Esto debería venir del backend
            details: result.details
          };
          this.facturas.unshift(nuevaFactura);
        }
      });
    } catch (error) {
      console.error('❌ Error al abrir el modal:', error);
    }
  }
}
