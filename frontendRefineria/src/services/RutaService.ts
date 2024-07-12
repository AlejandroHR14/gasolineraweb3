import { Camion } from "@models/Camion";
import api from "./interceptors";
import { Ruta } from "@models/Ruta";

export const RutaService = {
    list: () => {
        return new Promise<Ruta[]>((resolve, reject) => {
            api.get('rutas/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    listByChofer: (id: number) => {
        return new Promise<Ruta[]>((resolve, reject) => {
            api.post(`rutas/chofer/`, {id})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Ruta>((resolve, reject) => {
            api.get(`rutas/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create : (ruta: any) => {
        return new Promise<Camion>((resolve, reject) => {
            api.post('rutas/', ruta)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Camion>((resolve, reject) => {
            api.delete(`rutas/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    marcarComoEntregado: (surtidorId: number, rutaId : number) => {
        return new Promise<any>((resolve, reject) => {
            api.post(`rutas/entregado/`,{surtidor_id: surtidorId, ruta_id: rutaId})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}