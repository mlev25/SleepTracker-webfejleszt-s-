<template>
    <div class="chart-container">
        <Bar
            v-if="chartData.datasets[0].data.length"
            :data="chartData"
            :options="chartOptions"
        />
        <p v-else class="no-data">
            Nincs elegendő adat (legalább 7 nap) a heti trend megjelenítéséhez.
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
    // Az összes alvásrekord a HomeView-ból érkezik
    sleepRecords: {
        type: Array,
        required: true,
        default: () => []
    }
});

// --- Állapotok (State) ---

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
            // Segítségével óra:perc formátumra alakítjuk a tooltip-et
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
            // Y tengely címkéinek formázása óra:perc-re
            ticks: {
                callback: function(value) {
                    const hours = Math.floor(value / 60);
                    const minutes = Math.round(value % 60);
                    return `${hours}h ${minutes}m`;
                },
                stepSize: 60, // Lépték 1 óra (60 perc)
            },
            title: {
                display: true,
                text: 'Alvásidő (perc/óra)',
            },
            min: 0,
        }
    }
});

// --- Adatfeldolgozás (Logika) ---

const processChartData = (records) => {
    // 1. Az adatok rendezése a dátum alapján, hogy a legfrissebb legyen az utolsó
    const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. Kiszűrjük az utolsó 7 napot (vagy az utolsó 7 rekordot)
    // A logikát egyszerűsíthetjük, ha csak az utolsó 7 rekordot vesszük.
    const lastSevenRecords = sortedRecords.slice(-7);

    // 3. Formázás Chart.js-nek
    const labels = lastSevenRecords.map(record =>
        new Date(record.date).toLocaleDateString('hu-HU', { weekday: 'short', day: 'numeric', month: 'numeric' })
    );

    // Az adatokat percekben tároljuk
    const data = lastSevenRecords.map(record => record.totalSleepMinutes);

    // 4. Frissítjük a ref-eket
    chartData.value = {
        labels: labels,
        datasets: [{
            label: 'Alvásidő (perc)', // Belsőleg perc
            backgroundColor: '#007bff',
            data: data
        }]
    };
};

// --- Watcher ---

// Figyeli, ha az alvásrekordok megváltoznak (pl. új felvitel, törlés)
watch(() => props.sleepRecords, (newRecords) => {
    processChartData(newRecords);
}, { immediate: true }); // Futtassa le az első rendereléskor is

</script>

<style scoped>
.chart-container {
    height: 100%;
    /* Mivel a HomeView-ban a main-chart-area min-height: 600px,
       ez kitölti a rendelkezésre álló helyet. */
}
.no-data {
    text-align: center;
    padding: 100px 20px;
    color: #777;
    font-style: italic;
    background-color: #f0f0f0;
    border-radius: 8px;
    min-height: 560px; /* Kitölti a helyet, ha nincs adat */
}
</style>
