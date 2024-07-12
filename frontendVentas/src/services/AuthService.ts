import axios from "axios";

import { User } from "@models/User";
import api from "./interceptors";

export const AuthService = {
    login: async (loginRequest: any) : Promise<User> => {
        try {
            const token = await axios.post<any>('http://localhost:8000/api/token/', loginRequest);
            const res = await axios.post<User>('http://localhost:8000/api/users/login/', {}, {
                headers: {
                    Authorization: `Bearer ${token.data.access}`
                }
            });
            localStorage.setItem('token', token.data.access);
            localStorage.setItem('refresh', token.data.refresh);
            localStorage.setItem('user', JSON.stringify(res.data));
            api.defaults.headers['Authorization'] = `Bearer ${token.data.access}`;
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    // logout: () => {
    //     return new Promise<void>((resolve, reject) => {
    //         axios.post('http://127.0.0.1:3000/auth/logout/',{},{
    //             withCredentials: true,
    //         })
    //         .then(response => resolve(response.data))
    //         .catch(error => reject(error))
    //     });
    // }
}