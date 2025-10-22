// services/archivoService.js
import api from '../utils/api';

export const archivoService = {
  // Subir archivos a una carpeta específica
  uploadArchivos: async (files, folderId, userAuthorId) => {
    try {
      const formData = new FormData();
      
      // Agregar archivos al FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('misArchivos', files[i]);
      }
      
      // Agregar datos adicionales
      formData.append('folder_id', folderId);
      formData.append('user_author_id', userAuthorId);
      
      const response = await api.post('/archivos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ Error al subir archivos:", error);
      throw error;
    }
  },

  // Subir archivos para tema (devuelve info básica)
  uploadArchivosParaTema: async (files, folderId, userAuthorId) => {
    try {
      const formData = new FormData();
      
      // Agregar archivos al FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('misArchivos', files[i]);
      }
      
      // Agregar datos adicionales
      formData.append('folder_id', folderId);
      formData.append('user_author_id', userAuthorId);
      
      const response = await api.post('/archivos/uploadAddTema', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ Error al subir archivos para tema:", error);
      throw error;
    }
  },

  // Obtener todos los archivos
  getAllArchivos: async () => {
    try {
      const response = await api.get('/archivos');
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener todos los archivos:", error);
      throw error;
    }
  },

  // Obtener archivo por ID
  getArchivoById: async (id) => {
    try {
      const response = await api.get(`/archivos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener archivo por ID:", error);
      throw error;
    }
  },

  // Obtener archivos por ID de carpeta (MANTENER MÉTODO EXISTENTE)
  getFilesByFolderId: async (folderId) => {
    try {
      const response = await api.get(`/archivos/content/${folderId}`);
      return response.data.content || []; // Extraer solo el array de archivos
    } catch (error) {
      console.error("❌ Error al obtener archivos:", error);
      throw error;
    }
  },

  // Obtener ruta completa de un archivo
  getRutaArchivo: async (id) => {
    try {
      const response = await api.get(`/archivos/route/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener ruta del archivo:", error);
      throw error;
    }
  },

  // Actualizar un archivo por ID (MANTENER MÉTODO EXISTENTE)
  updateArchivoById: async (id, data) => {
    try {
      const response = await api.put(`/archivos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar archivo:", error);
      throw error;
    }
  },

  // Eliminar un archivo por ID (MANTENER MÉTODO EXISTENTE)
  deleteArchivoById: async (id) => {
    try {
      const response = await api.delete(`/archivos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar archivo:", error);
      throw error;
    }
  },

  // Mover archivo a otra carpeta
  moveArchivo: async (id, newFolderId) => {
    try {
      const response = await api.put(`/archivos/${id}`, {
        folder_id: newFolderId
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al mover archivo:", error);
      throw error;
    }
  },

  // Utilidades adicionales para el frontend

  // Validar tipos de archivo en el frontend
  validateFileTypes: (files, allowedTypes = []) => {
    if (!files || files.length === 0) return { valid: false, message: "No se seleccionaron archivos" };
    
    if (allowedTypes.length === 0) return { valid: true }; // Sin restricciones
    
    const invalidFiles = Array.from(files).filter(file => 
      !allowedTypes.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      return { 
        valid: false, 
        message: `Tipos de archivo no permitidos: ${invalidFiles.map(f => f.name).join(', ')}`,
        invalidFiles 
      };
    }
    
    return { valid: true };
  },

  // Validar tamaño de archivos en el frontend
  validateFileSize: (files, maxSizeMB = 10) => {
    if (!files || files.length === 0) return { valid: false, message: "No se seleccionaron archivos" };
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = Array.from(files).filter(file => 
      file.size > maxSizeBytes
    );
    
    if (oversizedFiles.length > 0) {
      return { 
        valid: false, 
        message: `Archivos demasiado grandes (máx ${maxSizeMB}MB): ${oversizedFiles.map(f => f.name).join(', ')}`,
        oversizedFiles 
      };
    }
    
    return { valid: true };
  },

  // Formatear tamaño de archivo para mostrar
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Obtener extensión de archivo
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  },

  // Determinar tipo de archivo por extensión
  getFileType: (filename) => {
    const extension = archivoService.getFileExtension(filename).toLowerCase();
    
    const fileTypes = {
      // Documentos
      'pdf': 'document',
      'doc': 'document', 'docx': 'document',
      'txt': 'document', 'rtf': 'document',
      'odt': 'document',
      
      // Hojas de cálculo
      'xls': 'spreadsheet', 'xlsx': 'spreadsheet',
      'csv': 'spreadsheet', 'ods': 'spreadsheet',
      
      // Presentaciones
      'ppt': 'presentation', 'pptx': 'presentation',
      'odp': 'presentation',
      
      // Imágenes
      'jpg': 'image', 'jpeg': 'image', 'png': 'image',
      'gif': 'image', 'bmp': 'image', 'svg': 'image',
      'webp': 'image', 'ico': 'image',
      
      // Videos
      'mp4': 'video', 'avi': 'video', 'mov': 'video',
      'wmv': 'video', 'flv': 'video', 'webm': 'video',
      'mkv': 'video', 'm4v': 'video',
      
      // Audio
      'mp3': 'audio', 'wav': 'audio', 'flac': 'audio',
      'aac': 'audio', 'ogg': 'audio', 'wma': 'audio',
      
      // Archivos comprimidos
      'zip': 'archive', 'rar': 'archive', '7z': 'archive',
      'tar': 'archive', 'gz': 'archive',
      
      // Código
      'js': 'code', 'html': 'code', 'css': 'code',
      'json': 'code', 'xml': 'code', 'php': 'code',
      'py': 'code', 'java': 'code', 'cpp': 'code',
      'c': 'code', 'sql': 'code'
    };
    
    return fileTypes[extension] || 'other';
  },

  // Generar token de un solo uso para video
  generateVideoToken: async () => {
    try {
      const response = await api.get('/archivos/generator');
      return response.data;
    } catch (error) {
      console.error("❌ Error al generar token de video:", error);
      throw error;
    }
  },

  // Validar y consumir token de un solo uso
  accessOneTimeToken: async (token) => {
    try {
      const response = await api.get(`/archivos/abrir-link/${token}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al acceder al token:", error);
      throw error;
    }
  },

  getFilesByFolderIdWithUser: async (folderId, userId) => {
  try {
    const response = await api.get(`/archivos/content/${folderId}?user_id=${userId}`);
    return response.data.content || [];
  } catch (error) {
    console.error("❌ Error al obtener archivos filtrados:", error);
    throw error;
  }
},

  // Obtener archivos de una carpeta
  getArchivosByFolderId: async (folderId) => {
    try {
      const response = await api.get(`/archivos/content/${folderId}`);
      return response.data.content || [];
    } catch (error) {
      console.error("❌ Error obteniendo archivos de carpeta:", error);
      throw error;
    }
  }

};