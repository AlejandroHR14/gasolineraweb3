// export interface Surtidor {
//     id:       number;
//     nombre:   string;
//     latitud:  string;
//     longitud: string;
// }
export interface Surtidor {
    id:           number;
    nombre:       string;
    latitud:      string;
    longitud:     string;
    bombas:       Bomba[];
    combustibles: Combustible[];
}

export interface Bomba {
    id:          number;
    tipo :       string;
    codigo:      string;
    surtidor_id: number;
    img : string | null;
}

export interface Combustible {
    id:          number;
    tipo:        string;
    surtidor_id: number;
    saldo:       number;
}

