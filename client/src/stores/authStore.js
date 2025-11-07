import {defineStore} from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
  }),

  actions: {
    setAuth(payload) {
        const user = {
            _id: payload._id,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            prefSleepTime: payload.preferredSleepTime
        };
        const token = payload.token;

        this.user = user;
        this.token = token;
        this.isLoggedIn = true;

        localStorage.setItem('user', JSON.stringify(user));
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
    getUserName: (state) => state.user?.name || 'Vendeg',
    getUserEmail: (state) => state.user?.email || null,
    getUser: (state) => state.user,
    getPrefSleepTime: (state) => state.user?.prefSleepTime || null
  }
});
