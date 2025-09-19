// services/aplicacionService.js
import api from '../utils/api';

export const aplicacionService = {
  // Obtener todas las aplicaciones del endpoint
  getAllAplicaciones: async () => {
    try {
      const response = await api.get('/aplicacion/AppsList');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener aplicaciones:", error);
      console.error("❌ Detalles del error:", error.response?.data);
      throw error;
    }
  },

  // Procesar y estructurar las aplicaciones para el sidebar
  procesarAplicacionesParaSidebar: async () => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
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
        acc[grupo].push(subseccion);
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
        orden_menu: seccion.orden_menu,
        expandable: subseccionesPorGrupo[seccion.grupo]?.length > 0,
        subsecciones: subseccionesPorGrupo[seccion.grupo] || []
      }));

      return sidebarData;
    } catch (error) {
      console.error("❌ Error al procesar aplicaciones para sidebar:", error);
      return [];
    }
  },

  // Obtener aplicaciones por tipo
  getAplicacionesByTipo: async (tipo) => {
    try {
      const response = await aplicacionService.getAllAplicaciones();
      const aplicaciones = response.aplicaciones || [];
      
      return aplicaciones
        .filter(app => app.estatus === 1 && app.tipo === tipo)
        .sort((a, b) => {
          // Ordenar por orden_menu si es tipo 0, por orden_submenu si es tipo 1
          return tipo === 0 ? 
            a.orden_menu - b.orden_menu : 
            a.orden_submenu - b.orden_submenu;
        });
    } catch (error) {
      console.error(`❌ Error al obtener aplicaciones por tipo ${tipo}:`, error);
      throw error;
    }
  },

  // Obtener subsecciones por grupo
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

  // Buscar aplicaciones por nombre
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

  // Obtener estadísticas de las aplicaciones
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
        grupos: new Set(aplicaciones.map(app => app.grupo)).size
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
        grupos: 0
      };
    }
  },

  // Validar estructura de aplicación
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

    // Validar que tipo sea 0 o 1
    if (aplicacion.tipo !== 0 && aplicacion.tipo !== 1) {
      return {
        valid: false,
        message: 'El campo tipo debe ser 0 (sección principal) o 1 (subsección)'
      };
    }
    
    return { valid: true };
  },

  // Formatear icono para uso en componentes
  formatIcono: (iconoString) => {
    // Remover prefijos comunes y devolver solo el nombre del icono
    if (!iconoString) return 'FileText'; // Icono por defecto
    
    // Si ya es un icono de tim-icons, extraer solo la parte del nombre
    if (iconoString.includes('tim-icons')) {
      return iconoString.replace('tim-icons ', '').replace('icon-', '');
    }
    
    return iconoString;
  },

  // Obtener jerarquía completa (útil para breadcrumbs o navegación)
  getJerarquiaCompleta: async () => {
    try {
      const sidebarData = await aplicacionService.procesarAplicacionesParaSidebar();
      
      // Crear un mapa de jerarquía
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
  }
};