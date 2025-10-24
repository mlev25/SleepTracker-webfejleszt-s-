<template>
  <nav class="main-nav">
    <router-link to="/" class="nav-logo">Alvásnapló</router-link>

    <button class="hamburger-btn" @click="toggleMenu" aria-label="Menü nyitása">
        <span :class="{ 'is-active': isOpen }"></span>
    </button>

    <div class="nav-links" :class="{ 'is-open': isOpen }">

      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login" class="nav-item" @click="closeMenu">Bejelentkezés</router-link>
        <router-link to="/register" class="nav-item" @click="closeMenu">Regisztráció</router-link>
      </template>

      <template v-else>
        <router-link to="/home" class="nav-item" @click="closeMenu">Home</router-link>
        <span class="welcome-message">Üdv, {{ authStore.getUserName }}</span>
        <button @click="handleLogoutAndClose" class="nav-item logout-btn">Kijelentkezés</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
    isOpen.value = false;
};

const handleLogoutAndClose = () => {
  authService.logout();
  closeMenu();
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
  padding: 4px 8px;
  border-radius: 5px;
}

.nav-logo:hover {
  color: #ffd700;
  background-color: #358fb3;
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
  font-weight: bold;
}

.nav-item:hover {
  background-color: #356db3;
  color: aqua;
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

.hamburger-btn {
    display: none; /* Alapértelmezetten elrejtve, csak mobilon látszik */
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    z-index: 100;
}

.hamburger-btn span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: white;
    position: relative;
    transition: background-color 0.3s;
}

.hamburger-btn span::before,
.hamburger-btn span::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: white;
    transition: transform 0.3s, top 0.3s;
}

.hamburger-btn span::before {
    top: -8px;
}

.hamburger-btn span::after {
    top: 8px;
}

@media (max-width: 768px) {
    .main-nav {
        flex-direction: row; /* Visszaállítjuk a sorba */
        justify-content: space-between; /* A logo és a gomb szétválasztása */
    }

    /* Megjelenítjük a hamburgert */
    .hamburger-btn {
        display: block;
    }

    /* Elrejtjük a linkeket alapértelmezetten */
    .nav-links {
        display: none;
        position: absolute;
        top: 60px; /* A header magassága alá igazítjuk */
        left: 0;
        right: 0;
        background-color: #3287fd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        flex-direction: column;
        padding-bottom: 10px;
    }

    /* 💡 Megjelenítés, ha nyitva van */
    .nav-links.is-open {
        display: flex;
    }

    .nav-item, .welcome-message {
        margin: 5px 0;
        padding: 10px 20px;
        width: auto;
        text-align: left;
    }

    /* A Logout gomb átveszi a Nav-item stílust mobilon */
    .nav-item.logout-btn {
        margin: 5px 20px;
    }
}
</style>
