<template>
  <div class="dashboard-container">

    <section class="stat-cards-grid">
      <StatCard title="Átlagos alvásidő:&nbsp" :value="authStore.getUserName" />
      <StatCard title="Beállított cél:&nbsp" :value="authStore.getPrefSleepTime" />
      <StatCard title="Átlagos alvásminőség:&nbsp" :value="authStore.getUserName" />

      <StatCard title="" value="Új alvás felvitele" action @click="openCreateModal"></StatCard>
    </section>

    <section class="main-content-grid">
        <div class="main-chart-area">
            <h3>Alvásnapló diagram</h3>
            <p v-if="loading">Adatok betoltese</p>
            <p v-else-if="sleepRecords.length === 0">Nincs betoltendo adat</p>
        </div>

        <div class="main-list-area">
            <SleepList :records="sleepRecords" @editRecord="openEditModal"></SleepList>
        </div>
    </section>

    <SleepModal
      :isOpen="isModalOpen"
      :selectedRecord="selectedRecord"
      @close="isModalOpen = false"
      @recordSaved="handleRecordSaved"
    />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import SleepList from '@/components/SleepList.vue';
import StatCard from '@/components/StatCard.vue';
import { useAuthStore } from '@/stores/authStore';
import sleepService from '@/services/sleepService';
import SleepModal from '@/components/SleepModal.vue';


// A Pinia Store példányosítása
const authStore = useAuthStore();
const sleepRecords = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const selectedRecord = ref(null);

const loadRecords = async () => {
    loading.value = true;

    try {
        const data = await sleepService.fetchAllSleepLogs();
        sleepRecords.value = data;
        console.log(sleepRecords);
        console.log(sleepRecords.value.data);
    } catch (error){
        console.error('Hiba az alvasrekordok lekerdezesekor:', error);
    } finally {
        loading.value = false;
    }
}

const openCreateModal = () => {
    selectedRecord.value = null;
    isModalOpen.value = true;
}

const handleRecordSaved = () => {
    loadRecords();
}

const openEditModal = (record) => {
    console.log("Megnyitás szerkesztésre:", record);
};

onMounted(() => {
    loadRecords();
})
</script>

<style scoped>
.dashboard-container {
    max-width: 100%;
    height: fit-content;
    padding: 13px;
    border: 1px solid #007bff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: beige;
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

.stat-cards-grid {
    display: grid;
    /* Alapértelmezett beállítás asztali gépre */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 10px;
    margin-bottom: 10px;
}

/* ---------------------------------- */
/* 💡 RESZPONZIV JAVÍTÁS: MOBIL NÉZET */
/* ---------------------------------- */
@media (max-width: 768px) {
    .stat-cards-grid {
        /* Vízszintes görgetés engedélyezése */
        display: flex; /* Váltunk Flexbox-ra a görgethetőséghez */
        overflow-x: auto; /* Vízszintes görgetés, ha túlcsordul */
        overflow-y: hidden; 
        
        /* Megakadályozzuk, hogy a kártyák összemennek */
        flex-wrap: nowrap; 
        
        /* Opcionális: Szélesebb margó a konténernek, hogy a görgetősáv ne zavarjon */
        padding-bottom: 15px; 
    }
    
    .stat-cards-grid > * {
        /* Minden kártya fix (vagy minimális) szélességet kap */
        flex-shrink: 0; /* Megakadályozza az összenyomódást */
        width: 155px; /* Példa szélesség */
        font-size: 0.8rem;
    }
    
    /* Görgősáv elrejtése (opcionális, a letisztultabb megjelenésért) */
    .stat-cards-grid::-webkit-scrollbar {
        display: none;
    }
    .stat-cards-grid {
        -ms-overflow-style: none; /* IE és Edge */
        scrollbar-width: none;  /* Firefox */
    }
}

.main-content-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr; /* Bal oldal nagyobb (Grafikon), jobb oldal kisebb (Lista) */
    gap: 10px;
}

.main-chart-area {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    min-height: 400px;
    border: 1px solid wheat;
}

.main-list-area {
    background-color: wheat;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    /* 💡 1. LÉPÉS: Állítsd be a konténert Flex-konténerként */
    display: flex;
    flex-direction: column; 
    
    /* 💡 2. LÉPÉS: Kötelező magasságot vagy maximális magasságot adunk (megegyezhet a chart-area magasságával) */
    /* Példa: max 450px magasság, utána vágódik. */
    max-height: 400px; 
    
    /* Fontos, ha a belső elemek nagyobbak, mint a konténer. Ezt a SleepList.vue görgetősávja fogja használni! */
    overflow: hidden; 
}

/* Reszponzivitás a fő tartalomra */
@media (max-width: 1150px) {
    .main-content-grid {
        grid-template-columns: 1fr; /* Egymás alá kerülnek az oszlopok */
    }
}

</style>
