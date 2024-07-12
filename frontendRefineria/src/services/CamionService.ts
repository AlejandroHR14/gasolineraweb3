import { Camion } from "@models/Camion";
import api from "./interceptors";

export const CamionService = {
    list: () => {
        return new Promise<Camion[]>((resolve, reject) => {
            api.get('camiones/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Camion>((resolve, reject) => {
            api.get(`camiones/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create : (camion: any) => {
        return new Promise<Camion>((resolve, reject) => {
            api.post('camiones/', camion)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (id:number, camion: any) => {
        return new Promise<Camion>((resolve, reject) => {
            api.put(`camiones/${id}/`, camion)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise<Camion>((resolve, reject) => {
            api.delete(`camiones/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}