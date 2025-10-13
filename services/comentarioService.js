// comentarioService.js
import api from '../utils/api';

export const comentarioService = {
  // Crear un comentario
  createComentario: async (data) => {
    try {
      const response = await api.post('/comentarios', data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear comentario:", error);
      throw error;
    }
  },

  // Obtener todos los comentarios
  getAllComentarios: async () => {
    try {
      const response = await api.get('/comentarios');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener comentarios:", error);
      throw error;
    }
  },

  // Obtener un comentario por ID
  getComentarioById: async (id) => {
    try {
      const response = await api.get(`/comentarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener comentario:", error);
      throw error;
    }
  },

  // Actualizar un comentario por ID
  updateComentarioById: async (id, data) => {
    try {
      const response = await api.put(`/comentarios/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar comentario:", error);
      throw error;
    }
  },

  // Eliminar un comentario por ID
  deleteComentarioById: async (id) => {
    try {
      const response = await api.delete(`/comentarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar comentario:", error);
      throw error;
    }
  },
};
