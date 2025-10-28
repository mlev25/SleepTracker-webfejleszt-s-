import api from '@/services/api';

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
    }

    //TODO: tovabbi funkciok (update, delete) ha szuksegesek
}

export default sleepService;