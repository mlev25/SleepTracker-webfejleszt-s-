<template>
    <div class="list-wrapper">
        <div class="dream-scroll-area">
            <div v-if="!records || records.length === 0" class="empty-list">
                Nincs még álom rögzítve
            </div>

            <div
                v-for="record in records"
                :key="record._id"
                class="dream-card"
                @click="editDream(record)"
            >
                <div class="card-header">
                    <span class="dream-title">{{ record.title || '(Nincs cím)' }}</span>
                    <span class="dream-date">{{ formatDate(record.sleepSessionId.date) }}</span>
                </div>

                <p class="dream-description">
                    {{ record.description }}
                </p>

                <div class="card-footer">
                    <div class="dream-tags">
                        <span v-for="tag in record.tags" :key="tag" class="tag">
                            {{ tag }}
                        </span>
                    </div>
                    <span class="edit-icon">✏️ Részletek / Szerkesztés</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Ez a komponens megkapja az összes álomrekordot a HomeView-tól
defineProps({
    records: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['editDream']);

const formatDate = (dateString) => {
    if (!dateString) return 'Ismeretlen dátum';
    return new Date(dateString).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', year: 'numeric' });
}

const editDream = (record) => {
    emit('editDream', record);
}
</script>

<style scoped>
.list-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.dream-scroll-area {
    flex-grow: 1;
    overflow-y: auto;
    padding: 5px;
}

.empty-list {
    text-align: center;
    padding: 40px;
    color: #777;
    font-style: italic;
}

.dream-card {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-left: 5px solid #3f51b5;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
}

.dream-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.dream-title {
    font-weight: bold;
    font-size: 1.1em;
    color: #3f51b5;
}

.dream-date {
    font-size: 0.9em;
    color: #555;
    font-weight: bold;
}

.dream-description {
    font-size: 0.95em;
    color: #333;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.dream-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.tag {
    background-color: #eee;
    color: #555;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
}

.edit-icon {
    font-size: 0.8em;
    color: #007bff;
    visibility: hidden;
}

.dream-card:hover .edit-icon {
    visibility: visible;
}
</style>
