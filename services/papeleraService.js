// services/papeleraService.js
import api from '../utils/api';

export const papeleraService = {
  
  // Obtener todas las papeleras (GET /)
  getAllPapeleras: async () => {
    try {
      const response = await api.get('/papeleras');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener todas las papeleras:", error);
      throw error;
    }
  },

  // Obtener papeleras por usuario (filtrado en frontend)
  getPapelerasByUser: async (userId) => {
    try {
      // Usar el endpoint con el ID del usuario
      const response = await api.get(`/papeleras/${userId}`);
      return response.data || []; // El backend ya retorna solo las papeleras del usuario
    } catch (error) {
      console.error("❌ Error al obtener papeleras del usuario:", error);
      console.error("❌ Detalles del error:", error.response?.data);
      
      // Si es 404 (papelera vacía), retornar array vacío
      if (error.response?.status === 404) {
        return [];
      }
      
      throw error;
    }
  },

  // Crear objeto en papelera (POST /:id)
  // Mover un item (tema, carpeta, archivo) a la papelera
  moveToTrash: async (contentId, typeContent) => {
    try {
      // El body debe incluir el tipo de contenido
      const requestBody = {
        type_content: typeContent // 'tema', 'carpeta', 'archivo'
      };

      const response = await api.post(`/papeleras/${contentId}`, requestBody);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al mover ${typeContent} a papelera:`, error);
      throw error;
    }
  },

  // Obtener papelera por ID (GET /:id)
  getPapeleraById: async (papeleraId) => {
    try {
      const response = await api.get(`/papeleras/${papeleraId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener papelera por ID:", error);
      throw error;
    }
  },

  // Actualizar papelera por ID (PUT /:id)
  updatePapelera: async (papeleraId, updateData) => {
    try {
      const response = await api.put(`/papeleras/${papeleraId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar papelera:", error);
      throw error;
    }
  },

  // Restaurar contenido de la papelera (DELETE /restore/:id)
  restoreFromTrash: async (papeleraId) => {
    try {
      const response = await api.delete(`/papeleras/restore/${papeleraId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restaurar de papelera:", error);
      throw error;
    }
  },

  // Eliminar permanentemente (si tienes esta funcionalidad)
  permanentDelete: async (papeleraId) => {
    try {
      const response = await api.delete(`/papeleras/${papeleraId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar permanentemente:", error);
      throw error;
    }
  },

  // Funciones helper para diferentes tipos de contenido

  // Mover tema a papelera
  moveThemeToTrash: async (themeId) => {
    return await papeleraService.moveToTrash(themeId, 'tema');
  },

  // Mover carpeta a papelera
  moveFolderToTrash: async (folderId) => {
    return await papeleraService.moveToTrash(folderId, 'carpeta');
  },

  // Mover archivo a papelera
  moveFileToTrash: async (fileId) => {
    return await papeleraService.moveToTrash(fileId, 'archivo');
  },

  // Obtener estadísticas de la papelera por tipo
  getTrashStats: async (userId) => {
    try {
      const papeleras = await papeleraService.getPapelerasByUser(userId);
      
      const stats = {
        total: papeleras.length,
        temas: papeleras.filter(item => item.type_content === 'tema').length,
        carpetas: papeleras.filter(item => item.type_content === 'carpeta').length,
        archivos: papeleras.filter(item => item.type_content === 'archivo').length
      };
      
      return stats;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas de papelera:", error);
      throw error;
    }
  },

  // Restaurar múltiples elementos
  restoreMultiple: async (papeleraIds) => {
    try {
      const promises = papeleraIds.map(id => papeleraService.restoreFromTrash(id));
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("❌ Error al restaurar múltiples elementos:", error);
      throw error;
    }
  },

  // Eliminar múltiples elementos permanentemente
  permanentDeleteMultiple: async (papeleraIds) => {
    try {
      const promises = papeleraIds.map(id => papeleraService.permanentDelete(id));
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("❌ Error al eliminar múltiples elementos permanentemente:", error);
      throw error;
    }
  },

  // Buscar en papelera
  searchInTrash: async (userId, searchTerm) => {
    try {
      const papeleras = await papeleraService.getPapelerasByUser(userId);
      
      // Si tienes información del contenido, puedes buscar por nombre
      // Por ahora filtraremos por tipo o ID
      const filtered = papeleras.filter(item => 
        item.content_id.includes(searchTerm) ||
        item.type_content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return filtered;
    } catch (error) {
      console.error("❌ Error al buscar en papelera:", error);
      throw error;
    }
  },

  // Vaciar papelera completa (eliminar todo permanentemente)
  emptyTrash: async (userId) => {
    try {
      const papeleras = await papeleraService.getPapelerasByUser(userId);
      const papeleraIds = papeleras.map(item => item._id);
      
      if (papeleraIds.length === 0) {
        return { message: 'La papelera ya está vacía' };
      }
      
      const results = await papeleraService.permanentDeleteMultiple(papeleraIds);
      return {
        message: `Se eliminaron ${papeleraIds.length} elementos permanentemente`,
        results
      };
    } catch (error) {
      console.error("❌ Error al vaciar papelera:", error);
      throw error;
    }
  }
};

export default papeleraService;