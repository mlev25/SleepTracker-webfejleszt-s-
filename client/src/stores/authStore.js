import {defineStore} from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
  }),

  actions: {
    setAuth(payload) {
        // 2. Szétválasztjuk a user adatokat a tokentől a mentéshez
        const user = {
            _id: payload._id,
            email: payload.email,
            role: payload.role
        };
        const token = payload.token;

        // 3. Mentés a Store-ba és a Local Storage-ba
        this.user = user;
        this.token = token;
        this.isLoggedIn = true;

        localStorage.setItem('user', JSON.stringify(user)); // Itt már a tiszta user objektumot mentjük
        localStorage.setItem('token', token);
    },

    logout() {
        this.user = null;
        this.token = null;
        this.isLoggedIn = false;

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
  },

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    getUserId: (state) => state.user?._id || null,
    getUserEmail: (state) => state.user?.email || null,
    getUser: (state) => state.user,
  }
});
