<template>
  <div class="dashboard-container">
    <h1>Alvásnapló Dashboard</h1>

    <div class="user-info">
      <p>Üdvözöljük, {{ authStore.getUserEmail }}!</p>
      <p>Felhasználó ID: <code>{{ authStore.getUserId }}</code></p>
    </div>

    <button @click="handleLogout" class="logout-btn">Kijelentkezés</button>

    <div class="protected-content">
      <h2>Alvás rekordok</h2>
      <p>Ez az oldal sikeresen betöltődött, ami azt jelenti, hogy a böngésződ érvényes JWT tokent küldött a Backendnek!</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

const router = useRouter();
// A Pinia Store példányosítása
const authStore = useAuthStore();

/**
 * Kezeli a kijelentkezési folyamatot:
 * 1. Hívja az AuthService.logout()-ot (törli a Pinia-t és a localStorage-t).
 * 2. Átirányít a Login oldalra.
 */
const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #007bff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f7f7ff;
}
h1 {
    text-align: center;
    color: #007bff;
    margin-bottom: 30px;
}
.user-info {
    background-color: #e6f0ff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 25px;
    border-left: 4px solid #007bff;
}
.logout-btn {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.logout-btn:hover {
    background-color: #c82333;
}
.protected-content {
    margin-top: 2rem;
    padding: 20px;
    border: 1px dashed #007bff;
    border-radius: 5px;
    background-color: #ffffff;
}
h2 {
    border-bottom: 2px solid #ccc;
    padding-bottom: 5px;
    margin-bottom: 15px;
}
</style>
