import api from './api'; // ⬅️ Az Axios példányunk, ami a tokent is csatolja
import { useAuthStore } from '@/stores/authStore'; // ⬅️ A Pinia Store

const authService = {
    /**
     * POST kérés a /api/auth/register végpontra.
     * @param {object} userData - A regisztrációs adatok (email, password).
     */
    async register(userData) {
        const authStore = useAuthStore();

        // 1. Backend hívás
        const response = await api.post('/auth/register', userData);

        // 2. Pinia Store frissítése (menti a tokent és a usert)
        authStore.setAuth(response.data);

        return response.data;
    },

    /**
     * POST kérés a /api/auth/login végpontra.
     * @param {object} userData - A bejelentkezési adatok (email, password).
     */
    async login(userData) {
        const authStore = useAuthStore();

        // 1. Backend hívás
        const response = await api.post('/auth/login', userData);

        // 2. Pinia Store frissítése
        authStore.setAuth(response.data);

        return response.data;
    },

    /**
     * Kijelentkezteti a felhasználót a Store-ban és a localStorage-ban.
     */
    logout() {
        const authStore = useAuthStore();
        authStore.logout();
    }
};

export default authService;
