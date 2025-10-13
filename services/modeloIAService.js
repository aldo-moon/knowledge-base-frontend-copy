// services/modeloIAService.js
import api from '../utils/api';

export const modeloIAService = {
  
  // Crear un nuevo modelo IA
  createModeloIA: async (modeloData) => {
    try {
      const response = await api.post('/modeloIA', modeloData);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear modelo IA:", error);
      throw error;
    }
  },

  // Obtener todos los modelos IA
  getAllModeloIA: async () => {
    try {
      const response = await api.get('/modeloIA');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener modelos IA:", error);
      throw error;
    }
  },

  // Obtener un modelo IA por ID
  getModeloIAById: async (id) => {
    try {
      const response = await api.get(`/modeloIA/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener modelo IA por ID:", error);
      throw error;
    }
  },

  // Actualizar un modelo IA
  updateModeloIA: async (id, modeloData) => {
    try {
      const response = await api.put(`/modeloIA/${id}`, modeloData);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar modelo IA:", error);
      throw error;
    }
  },

  // Eliminar un modelo IA
  deleteModeloIA: async (id) => {
    try {
      const response = await api.delete(`/modeloIA/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar modelo IA:", error);
      throw error;
    }
  }
};

export default modeloIAService;