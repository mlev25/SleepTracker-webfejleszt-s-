import api from '@/services/api';

const DREAM_API_URL = '/dreamlogs';

const dreamService = {
  
  async fetchAllDreamLogs() {
        try {
            const response = await api.get(DREAM_API_URL);
            return response.data;
        } catch (error) {
            console.error('Hiba az álomnapló lekérésekor:', error);
            throw error;
        }
    },

    async createNewDreamLog(dreamData) {
        try {
            const response = await api.post(DREAM_API_URL, dreamData);
            return response.data;
        } catch (error) {
            console.error('Hiba az új álom rögzítésekor:', error);
            throw error;
        }
    },


    async updateDreamLog(dreamId, dreamData) {
        try {
            const response = await api.put(`${DREAM_API_URL}/${dreamId}`, dreamData);
            return response.data;
        } catch (error) {
            console.error(`Hiba az álom frissítésekor (ID: ${dreamId}):`, error);
            throw error;
        }
    },


    async deleteDreamLog(dreamId) {
        try {
            const response = await api.delete(`${DREAM_API_URL}/${dreamId}`);
            return response.data;
        } catch (error) {
            console.error(`Hiba az álom törlésekor (ID: ${dreamId}):`, error);
            throw error;
        }
    }
}

export default dreamService;
