// components/BaseConocimientos/Content/ThemeDetailView.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Edit2, Trash2, Star, Calendar, User, Tag, Eye, Image, FileText, Download, ExternalLink } from 'lucide-react';
import { archivoService } from '../../../services/archivoService';
import styles from './../../../styles/base-conocimientos.module.css';
import { temaService } from '../../../services/temaService';
import FilePreview from '../Files/FilePreview'
import { authService } from '../../../services/authService';
import FileViewer from '../Modals/FileViewerModal';


interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
  author_topic_id?: {
    user_id: number;
    nombre: string;
    aPaterno: string;
  } | string;
  area_id?: string;
  puesto_id?: string;
  files_attachment_id?: string[];
    isDraft?: boolean;

}

interface ThemeDetailViewProps {
  themeId: string;
  onBack: () => void;
  onEdit?: (theme: Theme) => void;
  onDelete?: (theme: Theme) => void;
  onToggleFavorite?: (themeId: string) => void;
  isFavorite?: boolean;
}

interface AttachedFile {
  _id: string;
  file_name: string;
  type_file: string;
  s3_path: string;
  creation_date: string;
  last_update?: string;
}

export const ThemeDetailView: React.FC<ThemeDetailViewProps> = ({
  themeId,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const [fileViewerOpen, setFileViewerOpen] = useState(false);
const [fileToView, setFileToView] = useState<AttachedFile | null>(null);
  const [attachments, setAttachments] = useState<{images: string[], documents: string[]}>({
  images: [],
  documents: []
});

  const getLocalViews = (themeId: string): number => {
  if (typeof window === 'undefined') return 0;
  const key = `theme_views_${themeId}`;
  return parseInt(localStorage.getItem(key) || '0');
};

const incrementLocalViews = (themeId: string): number => {
  if (typeof window === 'undefined') return 0;
  const key = `theme_views_${themeId}`;
  const currentViews = parseInt(localStorage.getItem(key) || '0');
  const newViews = currentViews + 1;
  localStorage.setItem(key, newViews.toString());
  return newViews;
};

const calculatePercentage = (views: number): number => {
  // Meta de ejemplo: 725 vistas
  const goal = 725;
  return Math.min(Math.round((views / goal) * 100), 100);
};

const handleFileClick = (file: AttachedFile) => {
  console.log('Click en archivo:', file.file_name);
  setFileToView(file);
  setFileViewerOpen(true);
};

const loadAttachedFiles = async (fileIds: string[]) => {
  try {
    setLoadingFiles(true);
    console.log('📁 Cargando archivos adjuntos:', fileIds);
    
    // Obtener información de cada archivo
    const filePromises = fileIds.map(async (fileId) => {
      try {
        return await archivoService.getArchivoById(fileId);
      } catch (error) {
        console.error(`Error cargando archivo ${fileId}:`, error);
        return null;
      }
    });
    
    const filesData = await Promise.all(filePromises);
    const validFiles = filesData.filter(file => file !== null);
    
    setAttachedFiles(validFiles);
    console.log('✅ Archivos cargados:', validFiles);
    
  } catch (error) {
    console.error('❌ Error cargando archivos adjuntos:', error);
  } finally {
    setLoadingFiles(false);
  }
};




const handleFileDownload = (file: AttachedFile) => {
  if (file.s3_path) {
    window.open(file.s3_path, '_blank');
  } else {
    console.warn('No hay URL de descarga disponible para el archivo:', file.file_name);
  }
};

// Agregar función helper después de los imports y antes del componente
const extractAttachments = (htmlContent: string) => {
  if (!htmlContent) return { images: [], documents: [] };
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extraer imágenes
  const images = Array.from(doc.querySelectorAll('img')).map(img => {
    return img.getAttribute('alt') || 
           img.getAttribute('title') || 
           img.getAttribute('data-filename') || 
           'Imagen sin nombre';
  });
  
  // Extraer documentos (texto que contiene 📄)
  const textNodes = doc.body.innerText || '';
  const documentMatches = textNodes.match(/📄\s*([^📄\n]+)/g) || [];
  const documents = documentMatches.map(match => 
    match.replace('📄', '').trim()
  );
  
  return { images, documents };
};

// Función para procesar el HTML y agregar nombres encima de las imágenes
const processImagesWithCaptions = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = doc.querySelectorAll('img');
  
  images.forEach(img => {
    const imageName = img.getAttribute('alt') || 
                     img.getAttribute('title') || 
                     img.getAttribute('data-filename') || 
                     'Imagen sin nombre';
    
    // Crear contenedor para imagen con caption
    const container = doc.createElement('div');
    container.className = 'imageWithCaption';
    
    // Crear caption
    const caption = doc.createElement('div');
    caption.className = 'imageCaption';
    caption.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg> ${imageName}`;
    
    // Insertar el contenedor antes de la imagen
if (img.parentNode) {
  img.parentNode.insertBefore(container, img);
}    
    // Mover caption e imagen al contenedor
    container.appendChild(caption);
    container.appendChild(img);
  });
  
  return doc.body.innerHTML;
};



    useEffect(() => {
      loadTheme();
    }, [themeId]);

useEffect(() => {
  const userId = authService.getCurrentUserId(); // Obtiene 'id_usuario' de las cookies
  setCurrentUserId(userId || null); // ✅ Convertir undefined a null
  //console.log('🔍 Current User ID desde cookies:', userId);
}, []);

    const loadTheme = async () => {
    try {
        setLoading(true);
        setError(null);
        const themeData = await temaService.getTemaById(themeId);
        setTheme(themeData);
        
        // Extraer archivos adjuntos
        const extracted = extractAttachments(themeData.description || '');
        setAttachments(extracted);
        
        // Incrementar contador local
        const newViews = incrementLocalViews(themeId);
        setViewsCount(newViews);
       
        if (themeData.files_attachment_id && themeData.files_attachment_id.length > 0) {
  await loadAttachedFiles(themeData.files_attachment_id);
}
        
    } catch (err) {
        setError('Error al cargar el tema');
        console.error('Error loading theme:', err);
    } finally {
        setLoading(false);
    }
    };

    const formatDate = (dateString?: string) => {
      if (!dateString) return 'No disponible';
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getPriorityText = (priority?: number | string) => {
      // Convertir a número si es string
      const priorityNum = typeof priority === 'string' ? parseInt(priority) : priority;
      
      switch (priorityNum) {
        case 2: return 'Alta';
        case 1: return 'Media';
        case 0: return 'Baja';
        default: return 'No definida';
      }
    };

    const getPriorityColor = (priority?: number | string) => {
      // Convertir a número si es string
      const priorityNum = typeof priority === 'string' ? parseInt(priority) : priority;
      
      switch (priorityNum) {
        case 2: return '#dc2626'; // Rojo
        case 1: return '#f59e0b'; // Amarillo
        case 0: return '#10b981'; // Verde
        default: return '#6b7280'; // Gris
      }
    };

  if (loading) {
    return (
     <div className={styles.themeDetailContainer}>
      <div className={styles.themeDetailHeader}>
       <h2 className={styles.sectionTitle1}>Tema</h2>
      </div>
      <div className={styles.loadingContainer}>
        <p>Cargando tema...</p>
      </div>
     </div>
    );
  }

  if (error || !theme) {
    return (
      <div className={styles.errorContainer}>
        <p>{error || 'Tema no encontrado'}</p>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <ChevronLeft size={20} />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles.themeDetailContainer}>
      {/* Header */}
      <div className={styles.themeDetailHeader}>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <ChevronLeft size={20} />
          Volver
        </button>
        
        <div className={styles.themeDetailActions}>
          {onToggleFavorite && (
            <button
              className={`${styles.actionButton} ${isFavorite ? styles.favoriteActive : ''}`}
              onClick={() => onToggleFavorite(theme._id)}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Star size={20} fill={isFavorite ? '#6262bf' : 'none'} />
            </button>
          )}
          

          {onEdit && currentUserId && typeof theme?.author_topic_id === 'object' && theme.author_topic_id.user_id === parseInt(currentUserId) && (
            <button
              className={styles.actionButton}
              onClick={() => onEdit(theme)}
              title="Editar tema"
            >
              <Edit2 size={20} />
            </button>
          )}
          
          {onDelete && currentUserId && typeof theme?.author_topic_id === 'object' && theme.author_topic_id.user_id === parseInt(currentUserId) && (
          <button
            className={styles.actionButton}
            onClick={() => onDelete(theme)}
            title="Eliminar tema"
          >
            <Trash2 size={20} />
          </button>
        )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.themeDetailContent}>
        {/* Título y metadata */}
        <div className={styles.themeDetailMeta}>
          <h1 className={styles.themeDetailTitle}>{theme.title_name}</h1>
          
          <div className={styles.themeMetadata}>
            <div className={styles.metadataItem}>
              <Calendar size={16} />
              <span>Creado: {formatDate(theme.creation_date)}</span>
            </div>
            
            {theme.author_topic_id && (
                <div className={styles.metadataItem}>
                    <User size={16} />
                    <span>Autor: {
                    typeof theme.author_topic_id === 'object' 
                        ? `${theme.author_topic_id.nombre} ${theme.author_topic_id.aPaterno}`
                        : theme.author_topic_id
                    }</span>
                </div>
                )}
            
            <div className={styles.metadataItem}>
              <div 
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(theme.priority) }}
              >
                Prioridad: {getPriorityText(theme.priority)}
              </div>
            </div>

            {theme.keywords && theme.keywords.length > 0 && (
              <div className={styles.metadataItem}>
                <Tag size={16} />
                <div className={styles.keywordsList}>
                  {theme.keywords.map((keyword, index) => (
                    <span key={index} className={styles.keywordTag}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido del tema */}
        <div className={styles.themeDetailBody}>
            {theme.description ? (
            <div className={styles.themeContentWrapper}>
                <div 
                className={styles.themeContent1}
                dangerouslySetInnerHTML={{ 
                    __html: processImagesWithCaptions(theme.description)
                }}
                />
                
                {(attachedFiles.length > 0 || loadingFiles) && (
                  <div className={styles.attachmentsSection}>
                    <h3 className={styles.attachmentsTitle}>Archivos</h3>
                    
                    {loadingFiles ? (
                      <div className={styles.loadingFiles}>
                        <p>Cargando archivos...</p>
                      </div>
                    ) : (
                      <div className={styles.filesGrid1}>
                      {attachedFiles.map((file) => (
                        <FilePreview
                          key={file._id}
                          file={file}
                          onDownload={handleFileDownload}
                          onSelect={handleFileClick}
                        />
                      ))}
                    </div>
                    )}
                  </div>
                )}
                
                {/* Contador de vistas al final */}
                <div className={styles.viewsCounter}>
                <div className={styles.viewsInfo}>
                    <div className={styles.viewsLeft}>
                    <Eye size={20} />
                    <span className={styles.viewsNumber}>{viewsCount}</span>
                    <span>/725</span>
                    <span className={styles.viewsText}>VISTAS REQUERIDAS</span>
                    </div>
                    <span className={styles.viewsPercentage}>{calculatePercentage(viewsCount)}%</span>
                </div>
                
                <div className={styles.progressBar}>
                    <div 
                    className={styles.progressFill}
                    style={{ width: `${calculatePercentage(viewsCount)}%` }}
                    />
                </div>
                </div>
            </div>
            ) : (
            <div className={styles.emptyContent}>
                <p>Este tema no tiene contenido.</p>
            </div>
            )}
        </div>

      </div>
            {/* File Viewer Modal */}
      {fileViewerOpen && fileToView && (
        <FileViewer
          isOpen={fileViewerOpen}
          onClose={() => {
            setFileViewerOpen(false);
            setFileToView(null);
          }}
          file={fileToView}
        />
      )}
    </div>
  );
};

export default ThemeDetailView;