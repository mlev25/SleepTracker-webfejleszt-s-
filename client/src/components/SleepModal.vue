<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h3 v-if="!isEditMode">Új alvás</h3>
            <h3 v-else>Alvás módosítása</h3>

            <form @submit.prevent="saveRecord" class="sleep-form">
                <label for="date">Dátum:</label>
                <input type="date" id="date" v-model="formData.date" required>

                <label for="bedtime">Elalvás ideje:</label>
                <input type="datetime-local" id="bedtime" v-model="formData.bedtime" required>

                <label for="wakeupTime">Ébredés ideje:</label>
                <input type="datetime-local" id="wakeupTime" v-model="formData.wakeupTime" required>

                <label for="quality">Alvás minősége (1-5):</label>
                <input type="number" id="quality" v-model.number="formData.sleepQuality" min="1" max="5" required>
                <div v-if="isEditMode && selectedRecord && selectedRecord.sleepEvents && selectedRecord.sleepEvents.length" class="sleep-events-section">
                    <h4>Alvási Fázisok (Részletek)</h4>
                    <p class="summary">Teljes idő: {{ Math.floor(selectedRecord.totalSleepMinutes / 60) }} óra {{ selectedRecord.totalSleepMinutes % 60 }} perc</p>

                    <ul class="events-list">
                        <li v-for="(event, index) in selectedRecord.sleepEvents" :key="index">
                            <span :class="['event-type', event.eventType.toLowerCase()]">
                                {{ event.eventType }}
                            </span>
                             - {{ event.durationMinutes }} perc
                        </li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">
                        {{ isEditMode ? 'Mentés' : 'Rögzítés' }}
                    </button>
                    <button v-if="isEditMode" type="button" @click="deleteRecord" class="btn-danger">
                        Törlés
                    </button>
                    <button type="button" @click="$emit('close')" class="btn-secondary">Mégse</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import {ref, defineEmits, defineProps, watch} from 'vue'
import sleepService from '@/services/sleepService';

const props = defineProps({
    isOpen: Boolean,
    selectedRecord: Object //it will be needed for updating existing record
});

const emit = defineEmits(['close', 'recordSaved']);

const emptyForm = () => ({
    date: new Date().toISOString().substring(0, 10),
    bedtime: new Date().toISOString().substring(0, 16),
    wakeupTime: new Date().toISOString().substring(0, 16),
    sleepQuality: 4
});

const formData = ref(emptyForm());
const isEditMode = ref(false);

const toLocalDatetime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


watch(() => props.selectedRecord, (newRecord) => {
    if (newRecord && newRecord._id) {
        isEditMode.value = true;

        formData.value = {
            _id: newRecord._id,
            date: new Date(newRecord.date).toISOString().substring(0, 10),
            bedtime: toLocalDatetime(newRecord.bedtime),
            wakeupTime: toLocalDatetime(newRecord.wakeupTime),
            sleepQuality: newRecord.sleepQuality,
        };
    } else {
        isEditMode.value = false;
        formData.value = emptyForm();
    }
}, { immediate: true });

const saveRecord = async () => {
    try{
        if (isEditMode.value) {
            console.log('A modositott alvasrekord: ',formData.value);
            await sleepService.updateSleepLog(formData.value._id, formData.value);
            alert('Alvás rekord sikeresen frissítve!');
        } else {
            await sleepService.createNewSleepLog(formData.value);
            alert('Új alvás rekord sikeresen rögzítve!');
        }

        emit('recordSaved');
        emit('close');
    } catch (error){
        alert('Hiba történt a művelet során. Kérjük, ellenőrizze a konzolt.');
        console.error('API hiba a rögzítés/frissítés során:', error);
    }
}

const deleteRecord = async () => {
    if (!confirm('Biztosan törölni szeretnéd ezt az alvásbejegyzést? Ez a művelet nem visszavonható.')) {
        return;
    }

    try {
        if (!formData.value._id) {
            alert('Hiba: Nincs érvényes azonosító a törléshez.');
            return;
        }

        await sleepService.deleteSleepLog(formData.value._id);

        alert('Az alvás rekord sikeresen törölve.');

        emit('recordSaved');
        emit('close');

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Hiba történt a törlés során. Lásd a konzolt a részletekért.';
        alert(errorMessage);
        console.error('API hiba a törlés során:', error);
    }
}
</script>

<style scoped>
/* Modális ablak stílusai */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
}
.modal-content {
    background: white; padding: 30px; border-radius: 10px;
    width: 90%; max-width: 400px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
h3 { margin-top: 0; color: #334d6e; margin-bottom: 20px; }
.sleep-form label { display: block; margin-top: 10px; margin-bottom: 5px; font-weight: bold; color: #555; }
.sleep-form input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-primary, .btn-secondary { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background-color 0.2s; }
.btn-primary { background-color: #007bff; color: white; }
.btn-primary:hover { background-color: #0056b3; }
.btn-secondary { background-color: #f0f0f0; color: #333; }
.btn-secondary:hover { background-color: #e0e0e0; }

.modal-actions {
    display: flex;
    justify-content: space-between; /* Elválasztja a Törlés gombot a Mégse/Mentés gomboktól */
    gap: 10px;
    margin-top: 20px;
}

/* ÚJ GOMB STÍLUS: Törlés */
.btn-danger {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
    background-color: #dc3545; /* Piros szín */
    color: white;
}
.btn-danger:hover {
    background-color: #c82333;
}

/* ÚJ SZEKCIÓ STÍLUS: Alvás Események */
.sleep-events-section {
    margin-top: 20px;
    padding: 15px;
    background-color: #f7f9fc;
    border-radius: 8px;
    border-left: 3px solid #007bff;
}

.summary {
    font-weight: bold;
    color: #334d6e;
    margin-bottom: 10px;
}

.events-list {
    list-style: none;
    padding: 0;
    margin: 10px 0;
    max-height: 150px;
    overflow-y: auto; /* Görgetés, ha túl sok az esemény */
}

.events-list li {
    padding: 5px 0;
    border-bottom: 1px dashed #eee;
    font-size: 0.9em;
}

.event-type {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    min-width: 50px;
    text-align: center;
    text-transform: uppercase;
}
/* Színkódok az eseményekhez (könnyebb vizuális követés) */
.light { background-color: #4dc2f5; }
.deep { background-color: #215e98; }
.rem { background-color: #9b59b6; }
.wake { background-color: #e74c3c; }
</style>
