<template>
    <div class="chart-container">
        <Bar
            v-if="chartData.datasets[0].data.length >= 7"
            :data="chartData"
            :options="chartOptions"
        />
        <p v-else class="no-data">
            Nincs elegendő adat (legalább 7 alvasrekord) a heti trend megjelenítéséhez.
        </p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

// Chart.js modulok regisztrálása
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
    sleepRecords: {
        type: Array,
        required: true,
        default: () => []
    }
});


const chartData = ref({
    labels: [],
    datasets: [{
        label: 'Alvásidő (óra:perc)',
        backgroundColor: '#007bff',
        data: []
    }]
});

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const totalMinutes = context.parsed.y;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = Math.round(totalMinutes % 60);
                    return `Alvás: ${hours}h ${minutes}m`;
                }
            }
        }
    },
    scales: {
        y: {
            ticks: {
                callback: function(value) {
                    const hours = Math.floor(value / 60);
                    return `${hours}h`;
                },
                stepSize: 60,
            },
            title: {
                display: true,
                text: 'Alvásidő (perc/óra)',
            },
            min: 0,
        }
    }
});


const processChartData = (records) => {
    const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

    const lastSevenRecords = sortedRecords.slice(-7);

    const labels = lastSevenRecords.map(record =>
        new Date(record.date).toLocaleDateString('hu-HU', { weekday: 'short', day: 'numeric', month: 'numeric' })
    );

    const data = lastSevenRecords.map(record => record.totalSleepMinutes);

    chartData.value = {
        labels: labels,
        datasets: [{
            label: 'Alvásidő (perc)',
            backgroundColor: '#007bff',
            data: data
        }]
    };
};



watch(() => props.sleepRecords, (newRecords) => {
    processChartData(newRecords);
}, { immediate: true });

</script>

<style scoped>
.chart-container {
    height: 100%;
}
.no-data {
    text-align: center;
    padding: 100px 20px;
    color: #777;
    font-style: italic;
    background-color: #f0f0f0;
    border-radius: 8px;
    min-height: 100px;
}
</style>
