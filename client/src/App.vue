<template>
  <div id="app-container">

    <TheHeader />

    <main class="content-area">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f7f6;
    min-height: 100vh;
    background: linear-gradient(-45deg, #77a4e7, #c4d2e5, #4c92b3, #d9e4f1);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

#app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.content-area {
  flex-grow: 1;
  padding: 20px;
  padding-bottom: 70px;
}
</style>
