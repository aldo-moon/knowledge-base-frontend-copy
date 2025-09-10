import api from '../utils/api';

export const carpetaService = {
  getAllCarpetas: async () => {
    const response = await api.get('/carpetas/');
    return response.data;
  },

  getCarpetaById: async (id) => {
    const response = await api.get(`/carpetas/${id}`);
    return response.data;
  },

  createCarpeta: async (carpetaData) => {
    const response = await api.post('/carpetas/', carpetaData);
    return response.data;
  },

  updateCarpeta: async (id, carpetaData) => {
    const response = await api.put(`/carpetas/${id}`, carpetaData);
    return response.data;
  },

  deleteCarpeta: async (id) => {
    const response = await api.delete(`/carpetas/${id}`);
    return response.data;
  },

  getFolderContent: async (folderId) => {
    const response = await api.get(`/carpetas/content/${folderId}`);
    return response.data.content[0]; 
  }

};