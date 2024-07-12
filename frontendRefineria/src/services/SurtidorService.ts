import axios from "axios";
import api from "./interceptors";
import { Bomba, Combustible, Surtidor } from "@models/Surtidor";

export const SurtidorService = {
    list: () => {
        // usar axios para hacer una peticion get a la url http://localhost:8000/api/surtidores/
        // retornar una promesa con la respuesta
        return new Promise<Surtidor[]>((resolve, reject) => {
            axios.get<Surtidor[]>('http://localhost:8000/api/surtidores/',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => resolve(response.data))
                .catch(async error => {
                    if (error.response?.status === 401) {
                        try {
                            await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                                refresh: localStorage.getItem('refresh')
                            }).then(
                                (response) => {
                                    localStorage.setItem('token', response.data.access)
                                    localStorage.removeItem('refresh')
                                    error.config.headers['Authorization'] = `Bearer ${response.data.access}`
                            }
                            ).catch((error) => {
                                console.log('error', error)
                                localStorage.clear()
                                window.location.href = '/'
                            })
                        } catch (authError) {
                            if (window.location.pathname !== '/') {
                                window.location.href = '/';
                            }
                            localStorage.clear()
                            console.log("auth error", authError)
                            return Promise.reject(authError)
                        }
                        return api.request(error.config)
                    }
            
                    return Promise.reject(error)
                })
        });
    },
    get: (id: number) => {
        return new Promise<Surtidor>((resolve, reject) => {
            axios.get<Surtidor>(`http://localhost:8000/api/surtidores/${id}/`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => resolve(response.data))
                .catch(async error => {
                    if (error.response?.status === 401) {
                        try {
                            await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                                refresh: localStorage.getItem('refresh')
                            }).then(
                                (response) => {
                                    localStorage.setItem('token', response.data.access)
                                    localStorage.removeItem('refresh')
                                    error.config.headers['Authorization'] = `Bearer ${response.data.access}`
                            }
                            ).catch((error) => {
                                console.log('error', error)
                                localStorage.clear()
                                window.location.href = '/'
                            })
                        } catch (authError) {
                            if (window.location.pathname !== '/') {
                                window.location.href = '/';
                            }
                            localStorage.clear()
                            console.log("auth error", authError)
                            return Promise.reject(authError)
                        }
                        return api.request(error.config)
                    }
            
                    return Promise.reject(error)
                })
        });
        // return new Promise<Surtidor>((resolve, reject) => {
        //     api.get(`surtidores/${id}/`)
        //         .then(response => resolve(response.data))
        //         .catch(error => reject(error))
        // });
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