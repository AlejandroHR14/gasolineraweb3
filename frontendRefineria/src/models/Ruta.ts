import { Surtidor } from "./Surtidor";

export interface Ruta {
    id:                 number;
    nombre:             string;
    fecha:              Date;
    camion:             Camion;
    litros_combustible: number;
    tipo_combustible:   string;
    precio_por_litro:   number;
    completado:         boolean;
    surtidores:         SurtidorSimple[] | Surtidor[];
}

export interface Camion {
    id:               number;
    nombre:           string;
    capacidad:        number;
    tipo_combustible: string;
    user_id:          number;
}

export interface SurtidorSimple {
    surtidor_id:    number;
    litros_entrega: number;
}
