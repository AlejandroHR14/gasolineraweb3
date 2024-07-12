import api from "./interceptors";
import { Surtidor } from "@models/Surtidor";

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
    create: (surtidor: any) => {
        return new Promise<Surtidor>((resolve, reject) => {
            api.post('surtidores/', surtidor)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (id:number, surtidor: any) => {
        return new Promise<Surtidor>((resolve, reject) => {
            api.put(`surtidores/${id}/`, surtidor)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise((resolve, reject) => {
            api.delete(`surtidores/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}