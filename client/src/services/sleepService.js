import api from '@/services/api';

const calculateAverageSleepTime = (records) => {
    if (!records || records.length === 0) {
        return 0;
    }
    const validRecords = records.filter(r => r.totalSleepMinutes !== undefined && r.totalSleepMinutes !== null);

    if (validRecords.length === 0) {
        return 0;
    }

    const totalMinutes = validRecords.reduce((sum, record) => sum + record.totalSleepMinutes, 0);
    const averageMinutes = Math.round(totalMinutes / validRecords.length);

    const hour = Math.floor(averageMinutes/60);
    const mins = averageMinutes % 60;
    return `${hour}:${mins.toString().padStart(2, '0')}`;
};

const calculateAverageSleepQuality = (records) => {
    if (!records || records.length === 0) {
        return '0.0';
    }

    const validRecords = records.filter(r => r.sleepQuality !== undefined && r.sleepQuality !== null);

    if (validRecords.length === 0) {
        return '0.0';
    }

    const totalQuality = validRecords.reduce((sum, record) => sum + record.sleepQuality, 0);
    const averageQuality = totalQuality / validRecords.length;

    return averageQuality.toFixed(1);
};

const sleepService = {
    //1 alvasnaplo adatainak lekerese
    async fetchAllSleepLogs(){
        try {
            const response = await api.get('/sleepsessions');
            return response.data;
        } catch (error){
            console.error('Error fetching sleep logs:', error);
            throw error;
        }
    },

    //2 uj alvasnaplo adat felvitele
    async createNewSleepLog(recordData){
        try {
            const response = await api.post('/sleepsessions', recordData);
            return response.data;
        } catch (error){
            console.error('Error creating new sleep log:', error);
            throw error;
        }
    },

    //3 alvas modositasa
    async updateSleepLog(sleepId, sleepData){
      try {
        const response = await api.put(`/sleepsessions/${sleepId}`, sleepData);
        return response.data;
      } catch (error) {
        console.error(`Error updating sleep with id ${sleepId}:`, error);
      }
    },

    //4 alvas torlese
    async deleteSleepLog(sleepId){
      try {
        const response = await api.delete(`/sleepsessions/${sleepId}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting sleep log with id:${sleepId}`,error);
        throw error;
      }
    },


    calculateAverageSleepTime,
    calculateAverageSleepQuality
}

export default sleepService;
