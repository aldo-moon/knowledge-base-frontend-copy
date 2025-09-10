// archivoService.js
import api from '../utils/api';

export const archivoService = {
  // Obtener archivos por ID de carpeta
  getFilesByFolderId: async (folderId) => {
    try {
      const response = await api.get(`/archivos/content/${folderId}`);
      return response.data.content || []; // Extraer solo el array de archivos
    } catch (error) {
      console.error("❌ Error al obtener archivos:", error);
      throw error;
    }
  },

  // Actualizar un archivo por ID
  updateArchivoById: async (id, data) => {
    try {
      const response = await api.put(`/archivos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar archivo:", error);
      throw error;
    }
  },

  // Eliminar un archivo por ID
  deleteArchivoById: async (id) => {
    try {
      const response = await api.delete(`/archivos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar archivo:", error);
      throw error;
    }
  },
};
