<template>
    <div class="list-wrapper">
        <h3 class="list-title">Alvásnapló</h3>

        <div class="sleep-entries-scroll">
            <div v-if="records.length === 0" class="empty-list">
                Nincs még adat rögzítve
            </div>

            <div
                v-for="record in records"
                :key="record._id"
                class="list-item"
                @click="showDetails(record)">
                <div class="item-date">📅 {{ formatDate(record.date) }}</div>
                <div class="item-details">
                    <span class="item-duration">Időtartam: {{ convertMinutesToHours(record.totalSleepMinutes) }}</span>
                    <span class="item-quality">Alvás minősége: {{ record.sleepQuality }}/5 ⭐</span>
                </div>
                <div class="item-actions">
                    <span class="edit-icon">Részletek</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

defineProps({
    records: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['editRecord']);

const formatDate = (dateString) => {
  // A rekord.date valószínűleg ISO string
  if (!dateString) return 'Ismeretlen dátum';
  return new Date(dateString).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', year: 'numeric' });
}

const convertMinutesToHours = (minutes) => {
    const hour = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hour}:${mins.toString().padStart(2, '0')}`;
}

const showDetails = (record) => {
  emit('editRecord', record);
}


</script>

<style scoped>
.sleep-entries-scroll {
        flex-grow: 1;
        overflow-y: auto;
    }
.list-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.add-record-btn {
    width: 100%;
    padding: 10px;
    background-color: #5985b8;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.2s;
}

.add-record-btn:hover {
    background-color: #4a6c98;
}

.list-title {
    color: #334d6e;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.4em;
    padding-bottom: 5px;
    border-bottom: 1px solid #f0f0f0;
}

/* 💡 A GÖRGETHETŐ KONTÉNER */
.sleep-entries-scroll {
    flex-grow: 1; /* Kitölti a rendelkezésre álló helyet a gomb alatt */
    overflow-y: auto; /* Ez biztosítja a függőleges görgetést */
    padding-right: 10px; /* Hely a görgetősávnak */
}

/* Egyedi listaelem stílusa */
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item:hover {
    background-color: #f8f8f8;
}

.item-date {
    font-weight: bold;
    color: #334d6e;
    min-width: 100px;
}

.item-details {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    margin: 0 15px;
}

.item-duration {
    font-weight: 600;
}

.edit-icon {
    font-size: 1.1em;
    color: #5985b8;
}

.empty-list {
    text-align: center;
    padding: 30px 10px;
    color: #999;
}
</style>