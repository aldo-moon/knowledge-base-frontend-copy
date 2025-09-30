// services/temaService.js
import api from '../utils/api';

export const temaService = {
  getTemasByFolder: async (folderId, userId) => {
    try {
      const response = await api.get(`/temas/filter/prio/${folderId}?user_id=${userId}`);
      
      // Ahora la respuesta tiene content y borrador
      return {
        content: response.data.content || [],
        borrador: response.data.borrador || []
      };
    } catch (error) {
      console.error("❌ Error al obtener temas por carpeta:", error);
      throw error;
    }
  },

  getTemaById: async (id) => {
    try {
      const response = await api.get(`/temas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el tema por ID:", error);
      throw error;
    }
  },

  getTemaByIdPapelera: async (id) => {
    try {
      const response = await api.get(`/temas/papelera/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener tema de papelera:", error);
      throw error;
    }
  },

  createTema: async (temaData) => {
    try {
      const response = await api.post('/temas', temaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el tema:", error);
      throw error;
    }
  },

  updateTema: async (id, temaData) => {
    try {
      const response = await api.put(`/temas/${id}`, temaData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el tema:", error);
      throw error;
    }
  },

  deleteTema: async (id) => {
    try {
      const response = await api.delete(`/temas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el tema:", error);
      throw error;
    }
  },

  moveToTrash: async (contentId, authorId) => {
    try {
      const requestBody = {
        author_id: authorId
      };

      const response = await api.post(`/papeleras/${contentId}`, requestBody);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al mover tema a papelera:`, error);
      throw error;
    }
  }
};