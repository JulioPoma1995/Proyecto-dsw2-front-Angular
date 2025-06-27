export interface Cliente {
    id_cliente: number;
    nombre: string;
    apellido: string;
    documentoIdentidad: string;
    direccion: string;
    telefono: string;
    email: string;
    FechaRegistro: Date;
    estado: boolean;
    
  }

  export interface Client {
    id: number;
    name: string;
    lastname: string;
    dni: string;
    address: string;
    numberPhone: string;
    email: string;
    originDate: Date;
    status: boolean;
  }
