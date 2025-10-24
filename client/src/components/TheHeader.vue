<template>
  <nav class="main-nav">
    <router-link to="/" class="nav-logo">Alvásnapló 🌙</router-link>

    <div class="nav-links">
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login" class="nav-item">Bejelentkezés</router-link>
        <router-link to="/register" class="nav-item">Regisztráció</router-link>
      </template>

      <template v-else>
        <span class="welcome-message">Üdv, {{ authStore.getUserEmail }}</span>
        <button @click="handleLogout" class="nav-item logout-btn">Kijelentkezés</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
/* A CSS stílusokat áthelyezzük ide az App.vue globális stílusai közül */
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: #334d6e; /* Sötétkék háttér */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-logo {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-item, .welcome-message {
  margin-left: 20px;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 0.95em;
}

.nav-item:hover {
  background-color: #556c89;
}

.nav-item.logout-btn {
  background-color: #dc3545;
  border: none;
  cursor: pointer;
}

.nav-item.logout-btn:hover {
  background-color: #c82333;
}

.welcome-message {
    color: #ffd700;
    font-weight: 600;
}
</style>
