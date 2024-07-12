import { Venta } from "@models/Venta";
import api from "./interceptors";
import { VentaCreateResponse } from "@models/VentaCreateResponse";

export const VentaService = {
    list: () => {
        return new Promise<Venta[]>((resolve, reject) => {
            api.get('ventas/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    listBySurtidor: (idSurtidor : number) => {
        return new Promise<Venta[]>((resolve, reject) => {
            api.post('ventas/surtidor/', {surtidor_id: idSurtidor})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create : (venta: any) => {
        return new Promise<VentaCreateResponse>((resolve, reject) => {
            api.post('ventas/', venta)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    anular: (id: number) => {
        return new Promise<any>((resolve, reject) => {
            api.post(`ventas/${id}/anular/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}