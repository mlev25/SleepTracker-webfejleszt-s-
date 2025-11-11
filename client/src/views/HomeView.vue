<template>
  <div class="dashboard-container">

    <section class="stat-cards-grid">
      <StatCard title="Átlagos alvásidő:&nbsp" :value="averageSleepTime" :warning="isAvgLessThanPref"/>
      <StatCard title="Beállított cél:&nbsp" :value="authStore.getPrefSleepTime" />
      <StatCard title="Átlagos alvásminőség:&nbsp" :value="sleepService.calculateAverageSleepQuality(sleepRecords)" />

      <StatCard title="Felvitt álmok száma:&nbsp" :value=dreamCount></StatCard>
    </section>

    <section class="main-content-grid">
      <div class="main-chart-area">
        <h3 class="chart-title">Alvásmennyiség (Utolsó 7 nap)</h3>

        <p v-if="loading" class="chart-loading">Adatok betöltése...</p>
        <div v-else class="chart-wrapper">
            <SleepChart :sleepRecords="sleepRecords" />
        </div>
    </div>

      <div class="main-list-area">

        <div class="tab-navigation">
          <button
            :class="['tab-button', { active: activeTab === 'sleep' }]"
            @click="activeTab = 'sleep'"
          >
            Alvásnapló
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'dream' }]"
            @click="activeTab = 'dream'"
          >
            Álomnapló
          </button>
          <button class="new-sleep-btn" @click="openNewItemModal" title="Új bejegyzés felvitele"> + </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'sleep'">
            <SleepList
              :records="sleepRecords"
              @editRecord="openEditModal"
            />
          </div>

          <div v-if="activeTab === 'dream'">
            <DreamList
              :records="dreamRecords"
              @editDream="openDreamModal"
            />
          </div>
        </div>

      </div>
    </section>

    <SleepModal
      :isOpen="isModalOpen"
      :selectedRecord="selectedRecord"
      @close="isModalOpen = false"
      @recordSaved="refreshData"
    />
    <DreamModal
      :isOpen="isDreamModalOpen"
      :selectedRecord="selectedDreamRecord"
      :sleepRecords="sleepRecords"
      @close="isDreamModalOpen = false"
      @dreamSaved="refreshData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import sleepService from '@/services/sleepService';
import dreamService from '@/services/dreamService';

import SleepList from '@/components/SleepList.vue';
import StatCard from '@/components/StatCard.vue';
import SleepModal from '@/components/SleepModal.vue';
import DreamList from '@/components/DreamList.vue';
import DreamModal from '@/components/DreamModal.vue';
import SleepChart from '@/components/SleepChart.vue';

const authStore = useAuthStore();

const sleepRecords = ref([]);
const dreamRecords = ref([]);
const dreamCount = ref(0);
const loading = ref(true);

const activeTab = ref('sleep');

const isModalOpen = ref(false);
const selectedRecord = ref(null);

const isDreamModalOpen = ref(false);
const selectedDreamRecord = ref(null);

const averageSleepTime = ref('N/A');
const averageSleepQuality = ref('N/A');

const isAvgLessThanPref = ref(false);



const formatMinutesToHours = (totalMinutes) => {
    if (totalMinutes === 0) return '0h 0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
};


const loadAllData = async () => {
    loading.value = true;
    try {
        const [sleepData, dreamDataResponse] = await Promise.all([
            sleepService.fetchAllSleepLogs(),
            dreamService.fetchAllDreamLogs()
        ]);

        sleepRecords.value = sleepData;
        averageSleepTime.value = formatMinutesToHours(sleepService.calculateAverageSleepTime(sleepData));
        averageSleepQuality.value = sleepService.calculateAverageSleepQuality(sleepData);

        dreamRecords.value = dreamDataResponse.data;
        dreamCount.value = dreamDataResponse.count;

        if (averageSleepTime.value && authStore.getPrefSleepTime) {
            const calculatedAvg = sleepService.calculateAverageSleepTime(sleepData);
            const prefParts = authStore.getPrefSleepTime.split(':');
            const prefTotalMinutes = parseInt(prefParts[0]) * 60 + parseInt(prefParts[1]);
            isAvgLessThanPref.value = calculatedAvg < prefTotalMinutes;
        }

    } catch (error){
        console.error('Hiba az adatok (alvás vagy álom) lekérdezésekor:', error);
    } finally {
        loading.value = false;
    }
}

const refreshData = () => {
    loadAllData();
}

const openCreateModal = () => {
    selectedRecord.value = null;
    isModalOpen.value = true;
}

const openEditModal = (record) => {
    selectedRecord.value = record;
    isModalOpen.value = true;
};

const openDreamModal = (record) => {
    selectedDreamRecord.value = record;
    isDreamModalOpen.value = true;
};

const openNewItemModal = () => {
    if (activeTab.value === 'sleep') {
        openCreateModal();
    } else if (activeTab.value === 'dream') {
        openDreamModal(null);
    }
};

onMounted(() => {
    loadAllData();
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    .stat-cards-grid {
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        flex-wrap: nowrap;
        padding-bottom: 15px;
    }

    .stat-cards-grid > * {
        flex-shrink: 0;
        width: 155px;
        font-size: 0.8rem;
    }

    .stat-cards-grid::-webkit-scrollbar {
        display: none;
    }
    .stat-cards-grid {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
}

.main-content-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 10px;
}

.main-chart-area {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    min-height: 500px;
    border: 1px solid wheat;
    display: flex;
    flex-direction: column;
}

.main-list-area {
    background-color: wheat;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    display: flex;
    flex-direction: column;
    max-height: 300px;

    overflow: hidden;
}

.main-list-area {
    background-color: wheat;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow: hidden;
    padding: 0;
}

.tab-navigation {
    display: flex;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 8px;
    gap: 8px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.tab-button {
    flex: 1;
    padding: 10px;
    border: none;
    background-color: transparent;
    font-size: 1.1em;
    font-weight: bold;
    color: #555;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
}

.tab-button:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

.tab-button.active {
    background-color: #ffffff;
    color: #007bff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-sleep-btn {
    flex-basis: 40px;
    font-size: 1.5em;
    font-weight: bold;
    color: #007bff;
    background-color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.new-sleep-btn:hover {
    background-color: #e9f5ff;
}

.tab-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
}

@media (max-width: 1150px) {
    .main-content-grid {
        grid-template-columns: 1fr;
    }

    .main-chart-area {
        overflow-x: hidden;
        width: 100%;
        box-sizing: border-box;
    }
}

.chart-title {
    margin-bottom: 15px;
    color: #333;
    text-align: center;
}

.chart-wrapper {
    flex-grow: 1;
}
.less{
  background-color: red;
}
</style>
