// services/areaService.js
import api from '../utils/api';

export const areaService = {
  // Obtener todas las áreas
  getAllAreas: async () => {
    try {
      const response = await api.get('/areas');
      return response.data;
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      throw error;
    }
  },

  // Obtener área por ID
  getAreaById: async (areaId) => {
    try {
      const response = await api.get(`/areas/${areaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener área por ID:", error);
      throw error;
    }
  },

  // Crear nueva área
  createArea: async (areaData) => {
    try {
      const response = await api.post('/areas', areaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear área:", error);
      throw error;
    }
  },

  // Actualizar área
  updateArea: async (areaId, areaData) => {
    try {
      const response = await api.put(`/areas/${areaId}`, areaData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar área:", error);
      throw error;
    }
  },

  // Eliminar área
  deleteArea: async (areaId) => {
    try {
      const response = await api.delete(`/areas/${areaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar área:", error);
      throw error;
    }
  }
};