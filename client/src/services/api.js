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

        // Ha van token, beillesztjük az Authorization headert
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Visszaadjuk a módosított konfigurációt
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ha a válasz 401 Unauthorized és nem a login/register hívás volt
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();

            // Csak akkor kell kijelentkezni, ha a token lejárt, nem pedig a rossz login kísérletnél
            if (authStore.isAuthenticated) {
                authStore.logout(); // Kijelentkezés a Pinia-ban
                router.push('/login'); // Átirányítás a Login oldalra
            }
        }
        return Promise.reject(error); // Továbbítjuk a hibát a komponens catch blokkjának
    }
);

export default api;
