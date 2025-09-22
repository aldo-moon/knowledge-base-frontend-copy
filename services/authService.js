// services/authService.js
import api from '../utils/api';

export const authService = {
  // Token estático para pruebas
  //STATIC_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTgzOTA1NDcsImlkX3VzdWFyaW8iOiI2OGFkYzI5Nzg1ZDkyYjRjODRlMDFjNWIifQ.Vqy2FI6dYCiVIJBGekpO2SU5H2QlL8KuIAHM78AFrZI",
  //STATIC_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTgzOTUzMTEsImlkX3VzdWFyaW8iOiI2OGFmNzkyNTVmN2NlMzNkODZmYzY0MWUifQ.unFNi60VA2w0K7ijvOoGP-PvLxxxTDs1W6D9KQeTK9o",
  
  //STATIC_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTg2NDQ0NDMsImlkX3VzdWFyaW8iOiIyIn0.px1olPHwwqT4rg6k8NOZOdHu0Xcc9v-L8qEzuNOjfvI",
     STATIC_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTg2NDkzNzAsImlkX3VzdWFyaW8iOiIxOCJ9.g9V25p0RJHXfpSMGM0JH6JJ3vK9N7Mv1_rEjvRxMzpg",
  AUTH_BEARER_TOKEN: "ff07d4b68ddc474a45031dbdf70f74c2e2d699d7af02c5d571b9b2ff6276434f",

  // Validar token con la API externa
  validateToken: async (token = null) => {
    try {
      const tokenToValidate = token || authService.STATIC_TOKEN;
      
      console.log('🔐 Validando token...');
      
        const response = await fetch('https://login.aemretail.com/api/v1/external-session/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.AUTH_BEARER_TOKEN}`, 
        },
        body: JSON.stringify({
            Token: tokenToValidate // Token para validar 
        })
        });

      const data = await response.json();
      
        if (response.ok && data.code === 200) {
        console.log('✅ Token válido:', data);
        
        // Extraer el id_usuario de la respuesta
        const userId = data.data.dynamic_claims.id_usuario;
        
        // 🆕 Solo guardar el user_id y limpiar tokens temporales
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_id', userId);
            
            // Limpiar tokens que ya no se necesitan
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token_exp');
        }
        
        return {
          success: true,
          userId: userId,
          token: tokenToValidate,
          expiration: data.data.dynamic_claims.exp
        };
      } else {
        console.error('❌ Token inválido:', data);
        return {
          success: false,
          message: data.message || 'Token inválido'
        };
      }
    } catch (error) {
      console.error('❌ Error validando token:', error);
      return {
        success: false,
        message: 'Error de conexión al validar token'
      };
    }
  },

  // Obtener el ID del usuario desde localStorage
  getCurrentUserId: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_id');
    }
    return null;
  },

  // Obtener el token actual
    getCurrentToken: () => {
    return null; // 🆕 Ya no guardamos token
    },

  // Verificar si el usuario está autenticado
    isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    const userId = localStorage.getItem('user_id');
    
    return !!userId;
    },

  // Cerrar sesión (limpiar datos)
    logout: () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_id');
    }
    console.log('🚪 Sesión cerrada');
    },

  // Validar token automáticamente al cargar la página
  initializeAuth: async () => {
    // Verificar si ya hay un token válido
    if (authService.isAuthenticated()) {
      console.log('✅ Usuario ya autenticado:', authService.getCurrentUserId());
      return {
        success: true,
        userId: authService.getCurrentUserId(),
        fromCache: true
      };
    }
    
    // Si no hay token válido, intentar validar el token estático
    console.log('🔄 Iniciando validación automática...');
    return await authService.validateToken();
  }
};