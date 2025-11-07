import api from './api';
import { useAuthStore } from '@/stores/authStore';

const authService = {

    async register(userData) {
        const authStore = useAuthStore();

        const response = await api.post('/auth/register', userData);

        authStore.setAuth(response.data);

        return response.data;
    },

    async login(userData) {
        const authStore = useAuthStore();

        const response = await api.post('/auth/login', userData);

        authStore.setAuth(response.data);

        return response.data;
    },

    logout() {
        const authStore = useAuthStore();
        authStore.logout();
    }
};

export default authService;
