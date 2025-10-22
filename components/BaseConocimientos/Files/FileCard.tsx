// components/BaseConocimientos/Files/FileCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Star, Edit, Trash, CirclePlay, RotateCcw, Trash2, FileText, Film, Music, Archive, Code, Image as ImageIcon  } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';
import { archivoService } from '../../../services/archivoService';


interface File {
  _id: string;
  file_name: string;
  type_file?: string;
  s3_path?: string;
  creation_date?: string;
  last_update?: string;
}

interface MenuOption {
  icon: React.ElementType;
  label: string;
  action: string;
}

interface FileCardProps {
  file: File;
  onSelect: (file: File) => void;
  onDoubleClick?: (file: File) => void;
  onMenuAction?: (action: string, file: File) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (fileId: string) => void;
    isTrashView?: boolean; // ✅ AGREGAR
  selectedItems?: Set<string>; // ✅ AGREGAR
  onItemSelect?: (itemId: string) => void; // ✅ AGREGAR
}

export const FileCard: React.FC<FileCardProps> = ({
  file, 
  onSelect,
  onDoubleClick,
  onMenuAction,
  isFavorite = false,
  onToggleFavorite,
    isTrashView = false, // ✅ AGREGAR
  selectedItems, // ✅ AGREGAR
  onItemSelect // ✅ AGREGAR
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [fullFileData, setFullFileData] = useState<any>(null);
  const [loadingFileData, setLoadingFileData] = useState(true);
  const [isLoading, setIsLoading] = useState(true); 


useEffect(() => {
  const loadFileData = async () => {
    try {
      setLoadingFileData(true);
      const fileData = await archivoService.getArchivoById(file._id);
      setFullFileData(fileData);
      //console.log('Datos completos del archivo:', fileData);
    } catch (error) {
      //console.error('Error cargando datos del archivo:', error);
    } finally {
      setLoadingFileData(false);
    }
  };

  loadFileData();
}, [file._id]);

const menuOptions: MenuOption[] = isTrashView 
  ? [
      { icon: RotateCcw, label: 'Restaurar', action: 'restore' },
      { icon: Trash2, label: 'Eliminar permanentemente', action: 'delete' }
    ]
  : [
      { icon: Edit, label: 'Cambiar nombre', action: 'rename' },
      { icon: Trash, label: 'Eliminar', action: 'delete' }
    ];

  const getFileType = (fileName: string, mimeType?: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
  
  if (imageExts.includes(extension)) return 'image';
  if (videoExts.includes(extension)) return 'video';
  if (audioExts.includes(extension)) return 'audio';
  if (extension === 'pdf') return 'pdf';
  
  return 'other';
};

const fileType = getFileType(file.file_name, file.type_file);

const renderPreview = () => {
  if (loadingFileData || !fullFileData) {
  return <img src="/knowledge/Imagen.svg" alt="Archivo" className={styles.themeIcon1} />;
  }

  //console.log('Datos completos:', fullFileData);
  
  const fileType = getFileType(fullFileData.file_name, fullFileData.type_file);
  
  if (previewError || !fullFileData.s3_path) {
    return <img src="/knowledge/Imagen.svg" alt="Archivo" className={styles.themeIcon1} />;
  }

switch (fileType) {
  case 'image':
    return (
      <img
        src={fullFileData.s3_path}
        alt={fullFileData.file_name}
        className={styles.themeIcon1}
        onError={() => setPreviewError(true)}
        style={{ 
          objectFit: 'cover',
          borderRadius: '0.75rem'
        }}
      />
    );

case 'video':
  return (
    <div className={styles.videoPreview1}>
      <video
        src={fullFileData.s3_path}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setPreviewError(true);
          setIsLoading(false);
        }}
        style={{ display: isLoading ? 'none' : 'block' }}
        muted
      />
      <div className={styles.videoOverlay}>
        <CirclePlay size={42} color="white" />
      </div>
    </div>
  );


  default:
    return <img src="/knowledge/Imagen.svg" alt="Archivo" className={styles.themeIcon1} />;
  }
};



  // Cerrar menú cuando se hace clic fuera
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

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOptionClick = (action: string) => {
    if (onMenuAction) {  
      onMenuAction(action, file);  
    }
    setIsMenuOpen(false);
  };

const handleCardClick = () => {
  if (isTrashView && onItemSelect) {
    onItemSelect(file._id);
  } else {
    onSelect(file);
  }
};

  const handleCardDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick(file);
    }
  };

  return (
    <div
    className={`${styles.themeCard} ${isTrashView && selectedItems?.has(file._id) ? styles.selected : ''}`}
    onClick={handleCardClick}
    onDoubleClick={handleCardDoubleClick}
  >
      <div className={styles.themeContent}>
        <div className={styles.themeIcon1Container}>
  {renderPreview()}
</div>
        <h3 className={styles.themeName}>{file.file_name}</h3>
      </div>

      <div className={styles.themeCardHeader}>
        <div className={styles.themeActions}>
          <div ref={menuRef}>
            <button 
              className={styles.themeMenuButton}
              onClick={handleMenuClick}
            >
              <MoreHorizontal size={16} />
            </button>
            
            {isMenuOpen && onMenuAction && (
              <div className={styles.folderContextMenu1}>
                {menuOptions.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className={styles.folderContextOption}
                    onClick={() => handleMenuOptionClick(option.action)}
                  >
                    <option.icon size={16} className={styles.contextOptionIcon} />
                    <span className={styles.contextOptionLabel}>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!isTrashView && (
            <button 
              className={styles.themeStarButton}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(file._id);
              }}
            >
              <Star 
                size={16} 
                fill={isFavorite ? "#fbbf24" : "none"}
                color={isFavorite ? "#fbbf24" : "#8b8d98"}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;