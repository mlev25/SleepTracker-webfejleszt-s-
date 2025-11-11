<template>
  <div class="register-container">
    <h2>Regisztráció</h2>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="handleRegister">
      <div>
        <label for="name">Név</label>
        <input type="text" id="name" v-model="name" required>
      </div>

      <div>
        <label for="email">E-mail cím</label>
        <input type="email" id="email" v-model="email" required>
      </div>

      <div>
        <label for="password">Jelszó</label>
        <input type="password" id="password" v-model="password" required>
      </div>

      <div>
        <label for="prefSleepTime">Alvási cél (óra:perc)</label>
        <input type="text" id="prefSleepTime" v-model="prefSleepTime" required>
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Regisztráció...' : 'Regisztráció' }}
      </button>

      <p class="auth-link">
        Már van fiókod?
        <router-link to="/login">Jelentkezz be!</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

const router = useRouter();

const email = ref('');
const password = ref('');
const name = ref('');
const prefSleepTime = ref('');

const isLoading = ref(false);
const error = ref(null);


const handleRegister = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const userData = {
      email: email.value,
      password: password.value,
      name: name.value,
      preferredSleepTime: prefSleepTime.value
    };


    await authService.register(userData);

    router.push('/');
  } catch (err) {
    console.error('Register Hiba:', err);
    error.value = err.response?.data?.message || 'Hiba történt a regisztráció során.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #a78888;
    background-color: #b8ecff;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
}

.error-message {
    color: #a94442;
    background-color: #f2dede;
    border: 1px solid #ebccd1;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: 600;
    color: #555;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

button {
    margin-top: 30px;
    padding: 12px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    font-size: 17px;
    transition: background-color 0.3s;
}

button:hover:not(:disabled) {
    background-color: #0056b3;
}

button:disabled {
    background-color: #a0c4ff;
    cursor: not-allowed;
}

.auth-link {
    margin-top: 25px;
    text-align: center;
    font-size: 0.9em;
    color: #666;
}

.auth-link a {
    color: #007bff;
    text-decoration: none;
}
.auth-link a:hover {
    text-decoration: underline;
}
@media (max-width: 480px) {
    .register-container {
        max-width: 100%;
        margin: 20px 10px;
        padding: 20px;
        box-shadow: none;
        border-radius: 0;
    }
}
</style>
