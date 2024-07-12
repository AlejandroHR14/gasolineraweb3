import axios from "axios";
import api from "./interceptors";
import { Bomba, Combustible, Surtidor } from "@models/Surtidor";

export const SurtidorService = {
    list: (tipo_id : number) => {
        return new Promise<Surtidor[]>((resolve, reject) => {
            axios.post('http://localhost:8001/api/surtidores/lista/',{tipo_id: tipo_id})
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
    }
}