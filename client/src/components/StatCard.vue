<template>
    <div class="stat-card">
        <div class="card-content">
            <p class="card-title">{{ title }}</p>
            <p class="card-val">{{ value }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    }
})
</script>

<style scoped>
.stat-card {
    justify-content: space-evenly;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    background-color: #a5d9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-left: 5px solid #007bff;
}

.card-content{
    display: flex;
    flex-direction: row;
    align-items: center;
}

.card-title {
    margin: 0;
    font-size: 0.9em;
    color: #666;
}
.card-val {
    color: #334d6e;
    font-weight: bold;
}
</style>
