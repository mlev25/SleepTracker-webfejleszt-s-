import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            if (authStore.isAuthenticated) {
                authStore.logout();
                router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
