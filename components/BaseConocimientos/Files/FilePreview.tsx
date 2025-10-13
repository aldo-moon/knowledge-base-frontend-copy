// components/BaseConocimientos/Files/FilePreview.tsx
import { useState, useRef, useEffect } from 'react';
import { Download, ExternalLink, FileText, CirclePlay, Film, Music, MoreHorizontal, Archive, Code, Image as ImageIcon } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface AttachedFile {
  _id: string;
  file_name: string;
  type_file: string;
  s3_path: string;
  creation_date: string;
  last_update?: string;
}

interface FilePreviewProps {
  file: AttachedFile;
  onDownload: (file: AttachedFile) => void;
  className?: string;
   onSelect?: (file: AttachedFile) => void;  // ← Agregar como opcional
  onDoubleClick?: (file: AttachedFile) => void;  // ← Agregar como opcional
  onMenuAction?: (action: string, file: AttachedFile) => void; // ← Agregar esta línea
}


export const FilePreview: React.FC<FilePreviewProps> = ({ file, onDownload, onMenuAction, className, onSelect }) => {  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Determinar el tipo de archivo
  const getFileType = (fileName: string, mimeType: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Verificar por MIME type primero
    if (mimeType) {
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('video/')) return 'video';
      if (mimeType.startsWith('audio/')) return 'audio';
      if (mimeType.includes('pdf')) return 'pdf';
      if (mimeType.includes('text')) return 'text';
      if (mimeType.includes('application/zip') || mimeType.includes('application/x-rar')) return 'archive';
    }

    // Verificar por extensión
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'];
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
    const documentExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const spreadsheetExts = ['xls', 'xlsx', 'csv', 'ods'];
    const presentationExts = ['ppt', 'pptx', 'odp'];
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
    const codeExts = ['js', 'html', 'css', 'json', 'xml', 'php', 'py', 'java', 'cpp', 'c', 'sql'];

    if (imageExts.includes(extension)) return 'image';
    if (videoExts.includes(extension)) return 'video';
    if (audioExts.includes(extension)) return 'audio';
    if (extension === 'pdf') return 'pdf';
    if (documentExts.includes(extension)) return 'document';
    if (spreadsheetExts.includes(extension)) return 'spreadsheet';
    if (presentationExts.includes(extension)) return 'presentation';
    if (archiveExts.includes(extension)) return 'archive';
    if (codeExts.includes(extension)) return 'code';

    return 'other';
  };

  const fileType = getFileType(file.file_name, file.type_file);

  // Función para obtener el icono según el tipo
  const getFileIcon = () => {
    switch (fileType) {
      case 'image': return <ImageIcon size={24} />;
      case 'video': return <Film size={24} />;
      case 'audio': return <Music size={24} />;
      case 'pdf': 
      case 'document':
      case 'spreadsheet':
      case 'presentation': return <FileText size={24} />;
      case 'archive': return <Archive size={24} />;
      case 'code': return <Code size={24} />;
      default: return <FileText size={24} />;
    }
  };

  // Función para obtener el color según el tipo
  const getFileColor = () => {
    switch (fileType) {
      case 'image': return '#10b981'; // Verde
      case 'video': return '#ef4444'; // Rojo
      case 'audio': return '#f59e0b'; // Amarillo
      case 'pdf': return '#dc2626'; // Rojo oscuro
      case 'document': return '#3b82f6'; // Azul
      case 'spreadsheet': return '#059669'; // Verde oscuro
      case 'presentation': return '#f97316'; // Naranja
      case 'archive': return '#8b5cf6'; // Púrpura
      case 'code': return '#6b7280'; // Gris
      default: return '#6b7280'; // Gris
    }
  };

  const handleMenuClick = (event: React.MouseEvent) => {
  event.stopPropagation();
  setIsMenuOpen(!isMenuOpen);
};

  const handleMenuOptionClick = (action: string) => {
    if (action === 'download') {
      onDownload(file);
    } else if (action === 'open') {
      window.open(file.s3_path, '_blank');
    } else if (onMenuAction) {
      onMenuAction(action, file);
    }
    setIsMenuOpen(false);
  };

// Agregar este useEffect en tu componente
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  if (isMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isMenuOpen]);

  // Renderizar vista previa específica según el tipo
  const renderPreview = () => {
    if (previewError) {
      return (
        <div className={styles.filePreviewFallback}>
          <div className={styles.fileIconContainer} style={{ color: getFileColor() }}>
            {getFileIcon()}
          </div>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className={styles.imagePreview}>
            <img
              src={file.s3_path}
              alt={file.file_name}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setPreviewError(true);
                setIsLoading(false);
              }}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            {isLoading && (
              <div className={styles.previewLoading}>
                <div className={styles.fileIconContainer} style={{ color: getFileColor() }}>
                  {getFileIcon()}
                </div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className={styles.videoPreview}>
            <video
              src={file.s3_path}
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setPreviewError(true);
                setIsLoading(false);
              }}
              style={{ display: isLoading ? 'none' : 'block' }}
              muted
            />
            {isLoading && (
              <div className={styles.previewLoading}>
                <div className={styles.fileIconContainer} style={{ color: getFileColor() }}>
                  {getFileIcon()}
                </div>
              </div>
            )}
            <div className={styles.videoOverlay}>
              <CirclePlay size={42} color="white" />
            </div>
          </div>
        );

            case 'pdf':
        return (
            <div className={styles.filePreviewFallback}>
            <div className={styles.fileIconContainer} style={{ color: '#dc2626' }}>
                <FileText size={45} />
            </div>
            
            </div>
        );
        
      default:
        return (
          <div className={styles.filePreviewFallback}>
            <div className={styles.fileIconContainer} style={{ color: getFileColor() }}>
              {getFileIcon()}
            </div>
            <div className={styles.fileTypeLabel}>
              {fileType.toUpperCase()}
            </div>
          </div>
        );
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para obtener la extensión del archivo
  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

return (
  <div 
    className={`${styles.filePreviewCard} ${className || ''}`}
    onClick={() => onSelect && onSelect(file)}
    style={{ cursor: onSelect ? 'pointer' : 'default' }}
  >
      <div className={styles.filePreviewContainer}>
        {renderPreview()}
      </div>
      
      <div className={styles.filePreviewInfo}>

          <div className={styles.fileMetadata}>
          <span className={styles.fileExtension}>
            {getFileExtension(file.file_name)}
          </span>
          
        </div>
        <h4 className={styles.fileName} title={file.file_name}>
          {file.file_name}
        </h4>
        
      
        
        <div className={styles.filePreviewActions}>
  <div ref={menuRef}>
    <button
      className={styles.previewActionButton}
      onClick={handleMenuClick}
      title="Opciones del archivo"
    >
      <MoreHorizontal size={16} />
    </button>
    
    {isMenuOpen && (
      <div className={styles.folderContextMenu1}>
        <button
          className={styles.folderContextOption}
          onClick={() => handleMenuOptionClick('download')}
        >
          <Download size={16} />
          Descargar
        </button>
        {/* <button
          className={styles.folderContextOption}
          onClick={() => handleMenuOptionClick('open')}
        >
          <ExternalLink size={16} />
          Abrir en nueva pestaña
        </button> */}
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default FilePreview;