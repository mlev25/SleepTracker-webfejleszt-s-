<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h3 v-if="!isEditMode">Új álom rögzítése</h3>
            <h3 v-else>Álom szerkesztése</h3>

            <form @submit.prevent="saveRecord" class="dream-form">

                <label for="sleepSessionId">Melyik éjszakához kapcsolódik?</label>
                <select id="sleepSessionId" v-model="formData.sleepSessionId" required>
                    <option value="" disabled>Válassz egy rögzített alvást...</option>
                    <option
                        v-for="record in sleepRecords"
                        :key="record._id"
                        :value="record._id"
                    >
                        {{ formatRecordDisplay(record) }}
                    </option>
                </select>

                <label for="date">Dátum (Automatikus):</label>
                <input type="date" id="date" v-model="formData.date" required disabled />

                <label for="title">Álom címe (Opcionális):</label>
                <input type="text" id="title" v-model="formData.title" maxlength="50" />

                <label for="description">Leírás:</label>
                <textarea id="description" v-model="formData.description" required rows="4"></textarea>

                <label for="tags">Címkék (vesszővel elválasztva):</label>
                <input type="text" id="tags" v-model="formData.tagsInput" placeholder="pl.: repülés, rémálom" />

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
import { ref, defineEmits, defineProps, watch } from 'vue';
import dreamService from '@/services/dreamService';

const props = defineProps({
    isOpen: Boolean,
    selectedRecord: Object,
    sleepRecords: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'dreamSaved']);


const emptyForm = () => ({
    sleepSessionId: '',
    date: new Date().toISOString().substring(0, 10),
    title: '',
    description: '',
    isLucid: false,
    tagsInput: '',
    tags: []
});

const formData = ref(emptyForm());
const isEditMode = ref(false);


const formatMinutesToHours = (totalMinutes) => {
    if (typeof totalMinutes !== 'number' || totalMinutes <= 0) return '0h 0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

const formatRecordDisplay = (record) => {
    if (!record || !record.date) return 'Ismeretlen rekord';
    const dateStr = new Date(record.date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', year: 'numeric' });
    const duration = formatMinutesToHours(record.totalSleepMinutes);
    return `${dateStr} (${duration} alvás)`;
};

const prepareDataForSave = () => {
    const dataToSave = {...formData.value};
    dataToSave.tags = dataToSave.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    delete dataToSave.tagsInput;
    return dataToSave;
}


watch(() => props.selectedRecord, (newRecord) => {
    if (newRecord && newRecord._id) {
        isEditMode.value = true;
        const sleepId = newRecord.sleepSessionId?._id || newRecord.sleepSessionId;

        formData.value = {
            _id: newRecord._id,
            sleepSessionId: sleepId,
            date: new Date(newRecord.date).toISOString().substring(0, 10),
            title: newRecord.title,
            description: newRecord.description,
            isLucid: newRecord.isLucid,
            tagsInput: newRecord.tags ? newRecord.tags.join(', ') : '',
            tags: newRecord.tags || []
        };
    } else {
        isEditMode.value = false;
        formData.value = emptyForm();

        if(props.sleepRecords && props.sleepRecords.length > 0){
             formData.value.sleepSessionId = props.sleepRecords[0]._id;
             formData.value.date = new Date(props.sleepRecords[0].date).toISOString().substring(0, 10);
        }
    }
}, { immediate: true });

watch(() => formData.value.sleepSessionId, (newId) => {
    if (isEditMode.value) return;

    const selectedSleep = props.sleepRecords.find(r => r._id === newId);
    if (selectedSleep) {
        formData.value.date = new Date(selectedSleep.date).toISOString().substring(0, 10);
    }
});

const saveRecord = async () => {
    try {
        const dataToSave = prepareDataForSave();

        if (isEditMode.value) {
            await dreamService.updateDreamLog(formData.value._id, dataToSave);
            alert('Álom bejegyzés frissítve!');
        } else {
            await dreamService.createNewDreamLog(dataToSave);
            alert('Új álom rögzítve!');
        }
        emit('dreamSaved');
        emit('close');
    } catch (error) {
        alert(error.response?.data?.message || 'Hiba történt a mentés során.');
    }
}

const deleteRecord = async () => {
    if (!confirm('Biztosan törlöd ezt az álom bejegyzést?')) return;
    try {
        await dreamService.deleteDreamLog(formData.value._id);
        alert('Álom bejegyzés törölve.');
        emit('dreamSaved');
        emit('close');
    } catch (error) {
        alert('Hiba történt a törlés során.' + error.message);
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
}
.modal-content {
    background: #ffffff; padding: 30px; border-radius: 10px;
    width: 90%; max-width: 500px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.dream-form label {
    display: block; margin-top: 10px; margin-bottom: 5px;
    font-weight: bold; color: #555;
}
.dream-form input:not([type="checkbox"]),
.dream-form textarea,
.dream-form select {
    width: 100%; padding: 10px; margin-bottom: 15px;
    border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;
    background: #f9f9f9;
}
.dream-form input[disabled] {
    background: #eee;
    color: #777;
}
.dream-form textarea {
    resize: vertical; min-height: 100px;
}
.checkbox-container {
    display: flex; align-items: center; margin-bottom: 15px;
    font-weight: normal;
}
.checkbox-container input[type="checkbox"] {
    width: auto; margin-left: 10px;
}
.modal-actions {
    display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;
}

.btn-primary, .btn-secondary, .btn-danger {
    padding: 10px 15px; border: none; border-radius: 5px;
    cursor: pointer; font-weight: bold; transition: background-color 0.2s;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  margin-left: auto;
}
</style>
