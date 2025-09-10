import api from '../utils/api';

export const usuarioService = {
  getAllContentByUser: async (userId) => {
    try {
      const response = await api.get(`/usuarios/all_content/${userId}`);
      return response.data || {}; // Devuelve el objeto con archivos, carpetas y temas
    } catch (error) {
      console.error("❌ Error al obtener contenido del usuario:", error);
      throw error;
    }
  }
};
