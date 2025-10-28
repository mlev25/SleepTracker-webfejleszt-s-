<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h3>Új alvás</h3>

            <form @submit.prevent="saveRecord" class="sleep-form">
                <label for="date">Dátum:</label>
                <input type="date" id="date" v-model="formData.date" required>

                <label for="bedtime">Elalvás ideje:</label>
                <input type="datetime-local" id="bedtime" v-model="formData.bedtime" required>

                <label for="wakeupTime">Ébredés ideje:</label>
                <input type="datetime-local" id="wakeupTime" v-model="formData.wakeupTime" required>

                <label for="quality">Alvás minősége (1-5):</label>
                <input type="number" id="quality" v-model.number="formData.sleepQuality" min="1" max="5" required>
                <div class="modal-actions">
                <button type="submit" class="btn-primary">Rögzítés</button>
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

watch(() => props.isOpen, (newValue) => {
    if(newValue){
        formData.value = emptyForm();
    }
});

const saveRecord = async () => {
    try{
        await sleepService.createNewSleepLog(formData.value);

        emit('recordSaved');
        emit('close');
    } catch (error){
        alert('Hiba tortent a rekord rogzitesekor');
        console.error('Hiba tortent rekord letrehozasakor: ', error);
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
</style>