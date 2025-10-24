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
    background-color: #f4f7f6; /* Alapértelmezett szín */
    min-height: 100vh;

    /* ---------------------------------- */
    /* 💡 GRADIENT HÁTTÉR BEÁLLÍTÁSA */
    /* ---------------------------------- */
    /* 1. Különböző árnyalatok a kellemes átmenethez (pl. kék, lila, türkiz) */
    background: linear-gradient(-45deg, #77a4e7, #c4d2e5, #4c92b3, #d9e4f1);
    background-size: 400% 400%; /* A méret megnövelése az animációhoz */

    /* 2. Animáció alkalmazása */
    animation: gradientShift 15s ease infinite; /* 15 másodperces, lassú, ismétlődő animáció */
}

/* 3. Animációs Kulcskockák (keyframes) */
@keyframes gradientShift {
    0% {
        background-position: 0% 50%; /* Kezdő pozíció */
    }
    50% {
        background-position: 100% 50%; /* Középső pozíció */
    }
    100% {
        background-position: 0% 50%; /* Vissza a kezdő pozícióhoz */
    }
}

#app-container {
    /* ... (meglévő App.vue stílusok) ... */
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
