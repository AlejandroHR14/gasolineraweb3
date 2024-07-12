export interface Surtidor {
    id: number;
    nombre: string;
    latitud: string;
    longitud: string;
    combustibles: Combustible[];
  }
  
  export interface Combustible {
    id: number;
    tipo: string;
    saldo: number;
    surtidor: number;
    img: string;
  }
