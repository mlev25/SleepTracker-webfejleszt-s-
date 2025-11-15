import api from './api';

const adminService = {

  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }

};

export default adminService;
