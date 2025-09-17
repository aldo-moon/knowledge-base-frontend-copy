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

  getCarpetaByIdPapelera: async (id) => {
    try {
      const response = await api.get(`/carpetas/papelera/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener carpeta de papelera:", error);
      throw error;
    }
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


  moveToTrash: async (folderId, userId) => {
    try {
      const requestBody = {
        user_id: userId
      };

      const response = await api.post(`/papeleras/${folderId}`, requestBody);
      return response.data;
    } catch (error) {
      console.error("❌ Error al mover carpeta a la papelera:", error);
      throw error;
    }
  },


  getFolderContent: async (folderId) => {
    const response = await api.get(`/carpetas/content/${folderId}`);
    return response.data.content[0]; 
  }

};