// services/chatbotService.js (FRONTEND)
import api from '../utils/api';

export const chatbotService = {
  // Enviar pregunta al chatbot
  preguntar: async (pregunta, modeloId, sessionId = null, userId = null) => {
    // ✅ Cambia esta línea para aceptar string también
    try {
      const response = await api.post('/chatbot/preguntar', {
        pregunta,
        modelo_id: modeloId,
        session_id: sessionId || null,  // ✅ Agregar esto
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al consultar chatbot:", error);
      throw error;
    }
  }
};

export default chatbotService;