
import { User } from "@models/User";
import api from "./interceptors";
import axios from "axios";

export const UserService = {
    listChoferes: async () : Promise<User[]> => {
        try {
            const users = await axios.get<User[]>('http://localhost:8000/api/users/choferes/',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return users.data;
        } catch (error) {
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
        }
    },
    get: (id: number) => {
        return new Promise<User>((resolve, reject) => {
            api.get(`users/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
}