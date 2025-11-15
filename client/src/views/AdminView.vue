<template>
  <div class="admin-panel">
    <h1 class="page-title">Amin Panel</h1>

    <div class="user-management-area">
      <h2>Felhasználók listája (Saját fiókon kívül)</h2>
      <p v-if="loading" class="loading-message"> Betöltés... </p>
      <p v-else-if="users.length === 0" class="empty-message">Nincs megjelenitheto adat!</p>

      <ul v-else class="user-list">
        <li v-for="user in users" :key="user._id" class="user-item">
          <div class="user-info">
              <strong>{{ user.name }}</strong>
              <span :class="['user-role', { 'is-admin': user.role === 'ADMIN' }]">
                  {{ user.role.toUpperCase() }}
              </span>
          </div>

          <button
              @click="confirmDelete(user)"
              :disabled="user._id === authStore.user?._id"
              class="delete-btn"
              :title="user._id === authStore.user?._id ? 'Önmagadat nem törölheted a felületen' : 'Felhasználó és minden adatának VÉGLEGES törlése'"
          >
              Törlés
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>

import {ref, onMounted} from 'vue';
import adminService from '@/services/adminservice';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const users = ref([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const data = await adminService.getAllUsers();
    users.value = data.filter(u => u._id !== authStore.user?._id);
  } catch (error) {
    console.error('Hiba a felhasználók betöltése során:', error);
  } finally {
    loading.value = false;
  }
}

const confirmDelete = async (user) => {
  if (user._id === authStore.user?._id) {
    alert('Önmagadat nem törölheted a felületen!');
    return;
  }

  if (confirm(`Biztosan törölni szeretnéd a következő felhasználót és minden adatát? \n\nNév: ${user.name}\nE-mail: ${user.email}`)) {
    try {
      await adminService.deleteUser(user._id);
      alert(`${user.name} nevű felhasználó sikeresen törölve.`);
      await loadUsers();
    } catch (error) {
      console.error('Hiba a felhasználó törlése során:', error);
      alert('Hiba történt a felhasználó törlése során.');
    }
  }
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-panel {
    max-width: 900px;
    margin: 40px auto;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.page-title {
    color: #007bff;
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 15px;
}

.error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
}

.user-management-area h2 {
    color: #343a40;
    margin-bottom: 20px;
}

.loading-message, .empty-message {
    color: #6c757d;
    font-style: italic;
    padding: 10px;
}

.user-list {
    list-style: none;
    padding: 0;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 5px;
    margin-bottom: 12px;
    background-color: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-info {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.user-info strong {
    color: #007bff;
}

.user-role {
    font-size: 0.85em;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 5px;
    margin-left: 15px;
    color: white;
    background-color: #6c757d;
}

.user-role.is-admin {
    background-color: #ffc107;
    color: #343a40;
}

.delete-btn {
    padding: 8px 15px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
}

.delete-btn:hover:not(:disabled) {
    background-color: #c82333;
}

.delete-btn:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    opacity: 0.7;
}
</style>
