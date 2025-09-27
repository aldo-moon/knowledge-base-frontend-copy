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
  },

  getUserById: async (userId) => {
    try {
      console.log('🔍 Obteniendo usuario con ID:', userId);
      const response = await api.get(`/usuarios/${userId}`);
      
      // Tu backend devuelve un array con Usuario.find()
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      
      console.log('✅ Datos del usuario obtenidos:', userData);
      return userData || null;
    } catch (error) {
      console.error("❌ Error al obtener datos del usuario:", error);
      // Si es 404, devolver null en lugar de lanzar error
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // 🆕 NUEVA: Actualizar usuario usando tu ruta existente
  updateUsuario: async (userId, userData) => {
    try {
      console.log('📝 Actualizando usuario:', userId, userData);
      const response = await api.put(`/usuarios/${userId}`, userData);
      
      console.log('✅ Usuario actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      throw error;
    }
  },

  // 🆕 NUEVA: Función helper para formatear datos del usuario
  formatUserData: (rawUserData) => {
    if (!rawUserData) return null;
    
    return {
      _id: rawUserData._id,
      user_id: rawUserData.user_id,
      name: rawUserData.name || rawUserData.nombre || `Usuario ${rawUserData.user_id?.toString().slice(-4) || 'Desconocido'}`,
      email: rawUserData.email || rawUserData.correo || 'usuario@empresa.com',
      first_name: rawUserData.first_name || rawUserData.nombre || '',
      last_name: rawUserData.last_name || rawUserData.apellido || '',
      avatar: rawUserData.avatar || rawUserData.profile_picture || rawUserData.foto_perfil,
      // Agregar otros campos que puedas tener en tu modelo
      phone: rawUserData.phone || rawUserData.telefono,
      department: rawUserData.department || rawUserData.departamento,
      position: rawUserData.position || rawUserData.cargo,
      status: rawUserData.status || rawUserData.estatus,
      created_at: rawUserData.created_at || rawUserData.fecha_creacion,
      updated_at: rawUserData.updated_at || rawUserData.fecha_actualizacion
    };
  }
};