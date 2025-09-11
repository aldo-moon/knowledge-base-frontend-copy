// services/puestoService.js
import api from '../utils/api';

export const puestoService = {
  // Obtener todos los puestos
  getAllPuestos: async () => {
    try {
      const response = await api.get('/puestos');
      return response.data;
    } catch (error) {
      console.error("Error al obtener puestos:", error);
      throw error;
    }
  },

  // Obtener puesto por ID
  getPuestoById: async (puestoId) => {
    try {
      const response = await api.get(`/puestos/${puestoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener puesto por ID:", error);
      throw error;
    }
  },

  // Crear nuevo puesto
  createPuesto: async (puestoData) => {
    try {
      const response = await api.post('/puestos', puestoData);
      return response.data;
    } catch (error) {
      console.error("Error al crear puesto:", error);
      throw error;
    }
  },

  // Actualizar puesto
  updatePuesto: async (puestoId, puestoData) => {
    try {
      const response = await api.put(`/puestos/${puestoId}`, puestoData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar puesto:", error);
      throw error;
    }
  },

  // Eliminar puesto
  deletePuesto: async (puestoId) => {
    try {
      const response = await api.delete(`/puestos/${puestoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar puesto:", error);
      throw error;
    }
  }
};