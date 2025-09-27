// services/authService.js
export const authService = {
  // Bearer token para validación externa
  AUTH_BEARER_TOKEN: "ff07d4b68ddc474a45031dbdf70f74c2e2d699d7af02c5d571b9b2ff6276434f",

  // Función para obtener datos de cookies
  getCookieValue: (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  },

  // Función para establecer cookies
  setCookieValue: (name, value, days = 7) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  // Verificar token de URL
  verificarToken: async (token) => {
    try {
      const datos = { token: token };
      
      const response = await fetch('https://login.aemretail.com/api/v1/external-session/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.AUTH_BEARER_TOKEN}`,
        },
        body: JSON.stringify(datos)
      });

      const respuesta = await response.json();
      
      if (respuesta.code === 200) {
        const claims = respuesta.data.dynamic_claims;
        
        // Guardar en cookies
        authService.setCookieValue('id_usuario', claims.id_usuario);
        if (claims.id_cliente) {
          authService.setCookieValue('id_cliente', claims.id_cliente);
        }
        
        console.log('✅ Token verificado y cookies actualizadas');
        return {
          success: true,
          id_usuario: claims.id_usuario,
          id_cliente: claims.id_cliente
        };
      } else {
        console.error('❌ Token inválido');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Error verificando token:', error);
      return { success: false };
    }
  },

  // Obtener IDs desde cookies
  getAuthFromCookies: () => {
    const id_usuario = authService.getCookieValue('id_usuario');
    const id_cliente = authService.getCookieValue('id_cliente');
    
    return {
      id_usuario,
      id_cliente,
      isAuthenticated: !!id_usuario
    };
  },

  // Inicialización principal de autenticación
  initializeAuth: async () => {
    try {
      // 1. Verificar si hay token en URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('dowjdjfur');
      
      if (token) {
        console.log('🔑 Token encontrado en URL, verificando...');
        const result = await authService.verificarToken(token);
        
        if (result.success) {
          
          return {
            success: true,
            id_usuario: result.id_usuario,
            id_cliente: result.id_cliente,
            source: 'url_token'
          };
        }
      }
      
      // 2. Si no hay token válido en URL, verificar cookies
      const cookieAuth = authService.getAuthFromCookies();
      
      if (cookieAuth.isAuthenticated) {
        console.log('🍪 Autenticación encontrada en cookies');
        return {
          success: true,
          id_usuario: cookieAuth.id_usuario,
          id_cliente: cookieAuth.id_cliente,
          source: 'cookies'
        };
      }
      
      // 3. No hay autenticación válida
      console.log('❌ No se encontró autenticación válida');
      return { success: false };
      
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      return { success: false };
    }
  },

  // Obtener ID del usuario desde cookies
  getCurrentUserId: () => {
    return authService.getCookieValue('id_usuario');
  },

  // Obtener ID del cliente desde cookies
  getCurrentClientId: () => {
    return authService.getCookieValue('id_cliente');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const id_usuario = authService.getCookieValue('id_usuario');
    return !!id_usuario;
  },

  // Cerrar sesión (limpiar cookies y datos)
 logout: () => {
  console.log('🚪 Iniciando cierre de sesión...');
  
  // Función para borrar TODAS las cookies
  const clearAllCookies = () => {
    if (typeof document !== 'undefined') {
      // Obtener todas las cookies
      const cookies = document.cookie.split(";");
      
      // Borrar cada cookie individualmente
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Borrar en diferentes paths y dominios para asegurar eliminación completa
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
      
      console.log('🍪 Todas las cookies eliminadas');
    }
  };
  
  // Limpiar todas las cookies
  clearAllCookies();
  
  // Limpiar localStorage completamente
  if (typeof window !== 'undefined') {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('💾 Storage local limpiado');
    } catch (error) {
      console.warn('⚠️ Error limpiando storage:', error);
    }
  }
  
  console.log('✅ Sesión cerrada completamente');
  
  // Redirigir a la página de logout
  setTimeout(() => {
    window.location.href = 'https://www.aemretail.com/navreport/logout.php';
  }, 100); // Pequeño delay para asegurar que se ejecute la limpieza
},
};