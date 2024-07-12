
import { User } from "@models/User";
import api from "./interceptors";

export const UserService = {
    list: () => {
        return new Promise<User[]>((resolve, reject) => {
            api.get('users/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<User>((resolve, reject) => {
            api.get(`users/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    create: (user: any) => {
        // form data
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('password', user.password || '');
        formData.append('first_name', user.first_name);
        formData.append('last_name', user.last_name);
        formData.append('email', user.email);
        formData.append('groups', user.groups[0]);
        formData.append('surtidor_id', user.surtidor_id?.toString() || '');

        api.defaults.headers['Content-Type'] = 'multipart/form-data';

        return new Promise<User>((resolve, reject) => {
            api.post('users/', formData)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (id : number, user: User) => {
        return new Promise<User>((resolve, reject) => {
            api.put(`users/${id}/`, user)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise((resolve, reject) => {
            api.delete(`users/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}