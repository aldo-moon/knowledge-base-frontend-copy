// services/seccionService.js
import api from '../utils/api';

export const seccionService = {
  
  // Crear una nueva sección
  createSeccion: async (seccionData) => {
    try {
      const response = await api.post('/seccions', seccionData);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear sección:", error);
      throw error;
    }
  },

  // Obtener todas las secciones
  getAllSeccion: async () => {
    try {
      const response = await api.get('/seccions');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener secciones:", error);
      throw error;
    }
  },

  // Obtener una sección por ID
  getSeccionById: async (id) => {
    try {
      const response = await api.get(`/seccions/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener sección por ID:", error);
      throw error;
    }
  },

  // Actualizar una sección
  updateSeccion: async (id, seccionData) => {
    try {
      const response = await api.put(`/seccions/${id}`, seccionData);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar sección:", error);
      throw error;
    }
  },

  // Eliminar una sección
  deleteSeccion: async (id) => {
    try {
      const response = await api.delete(`/seccions/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar sección:", error);
      throw error;
    }
  }
};

export default seccionService;