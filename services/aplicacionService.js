// services/aplicacionService.js
import api from '../utils/api';

export const aplicacionService = {
  // URL base inicial
  BASE_URL: 'https://www.aemretail.com/navreport/',

  // Obtener todas las aplicaciones del endpoint
  getAllAplicaciones: async () => {
    try {
      const response = await api.get('/aplicacions/AppsList');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener aplicaciones:", error);
      console.error("❌ Detalles del error:", error.response?.data);
      throw error;
    }
  },
  // Agregar esta función al aplicacionService
generateToken: async (id_usuario, id_cliente = null) => {
  try {
    const datos = {
      dynamic_claims: {
        id_usuario: id_usuario,
        ...(id_cliente && { id_cliente: id_cliente }) // Solo agregar id_cliente si existe
      },
      token_duration: 30,
      unit_duration: "seconds",
    };
    
    const bearerToken = "ff07d4b68ddc474a45031dbdf70f74c2e2d699d7af02c5d571b9b2ff6276434f";
    
    const response = await fetch('https://login.aemretail.com/api/v1/external-session/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(datos)
    });

    const respuesta = await response.json();
    
    if (respuesta.code === 200) {
      console.log('✅ Token generado exitosamente');
      return respuesta.data.token;
    } else {
      console.error('❌ Error generando token:', respuesta);
      return "";
    }
  } catch (error) {
    console.error('❌ Error en generateToken:', error);
    return "";
  }
},




generarUrlNavegacion: async (aplicacion, id_usuario, id_cliente) => {
  const { tipo, externo, script } = aplicacion;
  
  // Regla 1: Si tipo es 0, no hacer nada (solo separador)
  if (tipo === 0) {
    console.log('📋 Aplicación tipo 0 (separador):', aplicacion.nombre);
    return null;
  }

  // Regla 2: Si tipo es 1
  if (tipo === 1) {
    // Si externo es 0 o null - URL normal sin tokens
    if (externo === 0 || externo === null || externo === undefined) {
      // ✅ VERIFICAR si script ya es URL completa
      const url = script.startsWith('http') ? script : `${aplicacionService.BASE_URL}${script}`;
      return url;
    }
    
    // Si externo NO es 0 ni null - necesita tokens
    if (!id_usuario) {
      return 'REQUIRES_TOKEN';
    }
    
    const token = await aplicacionService.generateToken(id_usuario, id_cliente);
    if (!token) {
      console.error('❌ No se pudo generar token');
      return null;
    }
    
    // ✅ VERIFICAR si script ya es URL completa antes de concatenar
    const baseUrl = script.startsWith('http') ? script : `${aplicacionService.BASE_URL}${script}`;
    const url = `${baseUrl}?dowjdjfur=${encodeURIComponent(token)}`;
    console.log('🔗 URL generada (con tokens):', url);
    return url;
  }

  console.warn('⚠️ No se pudo generar URL para:', aplicacion);
  return null;
},

  // ✅ NUEVA FUNCIÓN: Manejar navegación
  navegarAplicacion: (aplicacion) => {
    const url = aplicacionService.generarUrlNavegacion(aplicacion);
    
    if (!url) {
      console.log('❌ No se puede navegar a:', aplicacion.nombre);
      return false;
    }

    try {
      console.log('🚀 Navegando a:', url);
      
      // Navegar en la misma pestaña
      window.location.href = url;
      return true;
    } catch (error) {
      console.error('❌ Error al navegar:', error);
      return false;
    }
  },

  // ✅ FUNCIÓN ACTUALIZADA: Procesar aplicaciones para sidebar con navegación
procesarAplicacionesParaSidebar: async (userId) => {  // ← Agregar userId
    try {
 // ✅ DESPUÉS:
    const response = await aplicacionService.getAplicacionesByUser(userId);
    
    const aplicaciones = response.aplicaciones || [];
      // Filtrar solo aplicaciones con estatus activo (estatus === 1)
      const aplicacionesActivas = aplicaciones.filter(app => app.estatus === 1);

      // Separar secciones principales (tipo 0) y subsecciones (tipo 1)
      const seccionesPrincipales = aplicacionesActivas
        .filter(app => app.tipo === 0)
        .sort((a, b) => a.orden_menu - b.orden_menu);

      const subsecciones = aplicacionesActivas
        .filter(app => app.tipo === 1)
        .sort((a, b) => a.orden_submenu - b.orden_submenu);

      // Agrupar subsecciones por grupo
const subseccionesPorGrupo = subsecciones.reduce((acc, subseccion) => {
  const grupo = subseccion.grupo;
  if (!acc[grupo]) {
    acc[grupo] = [];
  }
  acc[grupo].push({
    ...subseccion,
    navegacionUrl: null, // Se generará en el click
    navegable: subseccion.tipo === 1 // ← CAMBIAR 'aplicacion' por 'subseccion'
  });
  return acc;
}, {});

      // Construir la estructura final del sidebar
const sidebarData = seccionesPrincipales.map(seccion => ({
  id: seccion._id,
  script_id: seccion.script_id,
  nombre: seccion.nombre,
  icono: seccion.icono,
  tipo: seccion.tipo,
  grupo: seccion.grupo,
  script: seccion.script,
  externo: seccion.externo,
  orden_menu: seccion.orden_menu,
  expandable: subseccionesPorGrupo[seccion.grupo]?.length > 0,
  subsecciones: subseccionesPorGrupo[seccion.grupo] || [],
  navegacionUrl: null, // Se generará en el click
  navegable: seccion.tipo === 1 // Solo tipo 1 es navegable
}));

      return sidebarData;
    } catch (error) {
      console.error("❌ Error al procesar aplicaciones para sidebar:", error);
      return [];
    }
  },



  // Mantener todas las funciones existentes...
  getAplicacionesByTipo: async (tipo) => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
      const aplicaciones = response.aplicaciones || [];
      
      return aplicaciones
        .filter(app => app.estatus === 1 && app.tipo === tipo)
        .sort((a, b) => {
          return tipo === 0 ? 
            a.orden_menu - b.orden_menu : 
            a.orden_submenu - b.orden_submenu;
        });
    } catch (error) {
      console.error(`❌ Error al obtener aplicaciones por tipo ${tipo}:`, error);
      throw error;
    }
  },

  getSubseccionesByGrupo: async (grupo) => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
      const aplicaciones = response.aplicaciones || [];
      
      return aplicaciones
        .filter(app => app.estatus === 1 && app.tipo === 1 && app.grupo === grupo)
        .sort((a, b) => a.orden_submenu - b.orden_submenu);
    } catch (error) {
      console.error(`❌ Error al obtener subsecciones del grupo ${grupo}:`, error);
      throw error;
    }
  },

  searchAplicaciones: async (searchTerm) => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
      const aplicaciones = response.aplicaciones || [];
      
      if (!searchTerm || searchTerm.trim() === '') {
        return aplicaciones.filter(app => app.estatus === 1);
      }
      
      const term = searchTerm.toLowerCase().trim();
      return aplicaciones.filter(app => 
        app.estatus === 1 && 
        app.nombre && 
        app.nombre.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("❌ Error al buscar aplicaciones:", error);
      throw error;
    }
  },

  getEstadisticasAplicaciones: async () => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
      const aplicaciones = response.aplicaciones || [];
      
      const stats = {
        total: aplicaciones.length,
        activas: aplicaciones.filter(app => app.estatus === 1).length,
        inactivas: aplicaciones.filter(app => app.estatus === 0).length,
        seccionesPrincipales: aplicaciones.filter(app => app.estatus === 1 && app.tipo === 0).length,
        subsecciones: aplicaciones.filter(app => app.estatus === 1 && app.tipo === 1).length,
        grupos: new Set(aplicaciones.map(app => app.grupo)).size,
        navegables: aplicaciones.filter(app => app.estatus === 1 && app.tipo === 1).length
      };
      
      return stats;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error);
      return {
        total: 0,
        activas: 0,
        inactivas: 0,
        seccionesPrincipales: 0,
        subsecciones: 0,
        grupos: 0,
        navegables: 0
      };
    }
  },

  validateAplicacion: (aplicacion) => {
    const requiredFields = ['nombre', 'tipo', 'grupo'];
    const missingFields = requiredFields.filter(field => 
      aplicacion[field] === undefined || aplicacion[field] === null
    );
    
    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      };
    }

    if (aplicacion.tipo !== 0 && aplicacion.tipo !== 1) {
      return {
        valid: false,
        message: 'El campo tipo debe ser 0 (sección principal) o 1 (subsección)'
      };
    }
    
    return { valid: true };
  },

  formatIcono: (iconoString) => {
    if (!iconoString) return 'FileText';
    
    if (iconoString.includes('tim-icons')) {
      return iconoString.replace('tim-icons ', '').replace('icon-', '');
    }
    
    return iconoString;
  },

  getJerarquiaCompleta: async () => {
    try {
      const sidebarData = await aplicacionService.procesarAplicacionesParaSidebar();
      
      const jerarquia = {};
      
      sidebarData.forEach(seccion => {
        jerarquia[seccion.script_id] = {
          ...seccion,
          path: [seccion.nombre],
          level: 0
        };
        
        seccion.subsecciones.forEach(subseccion => {
          jerarquia[subseccion.script_id] = {
            ...subseccion,
            parent: seccion.script_id,
            path: [seccion.nombre, subseccion.nombre],
            level: 1
          };
        });
      });
      
      return jerarquia;
    } catch (error) {
      console.error("❌ Error al obtener jerarquía completa:", error);
      return {};
    }
  },
    
  // Obtener aplicaciones por usuario con permisos
  getAplicacionesByUser: async (userId) => {
    try {
      const response = await api.get(`/aplicacions/app_list_user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener aplicaciones por usuario:", error);
      throw error;
    }
  },

};