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
// Az App.vue-nak most már nincs szüksége a useRouter-re és useAuthStore-ra!
</script>

<style>
/* ⚠️ Globális stílusok, amik máshova nem illenek (pl. body)
 * A Navigáció stílusait már a TheHeader.vue tartalmazza
 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  min-height: 100vh; /* Fontos a footer rögzítéséhez */
}

#app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.content-area {
  flex-grow: 1; /* A tartalom veszi fel a rendelkezésre álló helyet */
  padding: 20px;
  padding-bottom: 70px; /* Hely a rögzített footer számára */
}
</style>
