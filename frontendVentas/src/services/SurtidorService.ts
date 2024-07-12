import api from "./interceptors";
import { Bomba, Combustible, Surtidor } from "@models/Surtidor";

export const SurtidorService = {
    list: () => {
        return new Promise<Surtidor[]>((resolve, reject) => {
            api.get('surtidores/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Surtidor>((resolve, reject) => {
            api.get(`surtidores/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    listBombas: (id:number) => {
        return new Promise<Bomba[]>((resolve, reject) => {
            api.get(`surtidores/${id}/bombas/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    createBomba: (bomba: any) => {
        return new Promise<Bomba>((resolve, reject) => {
            api.post('surtidores/bomba/', bomba)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    insertTipoCombustible: (combustible: any) => {
        return new Promise<Combustible>((resolve, reject) => {
            api.post('surtidores/combustible/', combustible)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    precioActual: (data:any) => {
        return new Promise<any>((resolve, reject) => {
            api.post('surtidores/precio/', data)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}