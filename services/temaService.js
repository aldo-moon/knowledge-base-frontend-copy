// En services/temaService.js
import api from '../utils/api';

export const temaService = {
  getTemasByFolder: async (folderId) => {
    const response = await api.get(`/temas/filter/prio/${folderId}`);
    return response.data.content || []; 
  },

  getTemaById: async (id) => {
    try {
      const response = await api.get(`/temas/${id}`);
      return response.data; // Devuelve el objeto tema
    } catch (error) {
      console.error("Error al obtener el tema por ID:", error);
      throw error;
    }
  },



  // Crear nuevo tema
  createTema: async (temaData) => {
    try {
      const response = await api.post('/temas', temaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el tema:", error);
      throw error;
    }
  },

  // Actualizar tema existente
  updateTema: async (id, temaData) => {
    try {
      const response = await api.put(`/temas/${id}`, temaData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el tema:", error);
      throw error;
    }
  },

  // Eliminar tema
  deleteTema: async (id) => {
    try {
      const response = await api.delete(`/temas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el tema:", error);
      throw error;
    }
  }
};
