import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8001/api/',
    withCredentials: true,
    // timeout: 5000,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
})
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error', error);
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
    });

export default api;