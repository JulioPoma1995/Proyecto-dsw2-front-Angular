import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { MatDialogModule } from '@angular/material/dialog'; // Si usas Material Dialog
import { FacturaService } from '../../../../services/factura.service';
import { Cliente } from '../../../../models/cliente.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Output, Inject, inject, OnInit } from '@angular/core';
//import { CustomerService } from '../../../../core/api/customerService';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [FacturaService]
})
export default class CrearClienteComponent implements OnInit {

  public registerForm!: FormGroup;
  public cargando: boolean = false;
  private generalService = inject(FacturaService);
  item: any;
  viewOnly: boolean = false;
  isLoadingResults = true;

  constructor(
    public dialogRef: MatDialogRef<CrearClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facturaService: FacturaService
    //private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
   this.registerForm = new FormGroup({
  nombre: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  apellido: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  documentoIdentidad: new FormControl(null, [Validators.maxLength(255)]),
  direccion: new FormControl(null, [Validators.maxLength(255)]),
  email: new FormControl(null, [Validators.email, Validators.maxLength(255)]),
  fechaRegistro: new FormControl(null, [Validators.required]),
  telefono: new FormControl(null, [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(7),
    Validators.maxLength(15)
  ]),
 });
  }

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  close() {
    this.dialogRef.close(false);
  }

createCliente() {
  if (this.registerForm.valid) {
    const cliente = this.registerForm.value;
    cliente.fechaRegistro = new Date(cliente.fechaRegistro).toISOString();

    this.facturaService.crearCliente(cliente).subscribe(
      (data) => {
        console.log('Cliente creado con éxito:', data);
        this.close();
      },
      (error) => {
        console.error('Hubo un error al crear el cliente', error);

         try {
          const errorResponse = JSON.parse(error.error);
          console.log('Error de validación:', errorResponse.message);
        } catch (e) {
          console.log('El error no es un JSON válido:', error.error);
        }
      }
    );
  }
}



}
