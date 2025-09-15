// components/BaseConocimientos/Files/FileCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Star, Edit, Trash, FileText, Film, Music, Archive, Code, Image as ImageIcon  } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

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
}

export const FileCard: React.FC<FileCardProps> = ({
  file, 
  onSelect,
  onDoubleClick,
  onMenuAction,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const menuOptions: MenuOption[] = [
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
  if (previewError || !file.s3_path) {
    return (
      <div className={styles.fileIconFallback}>
        {getFallbackIcon()}
      </div>
    );
  }

  switch (fileType) {
    case 'image':
      return (
        <div className={styles.fileImagePreview}>
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
            <div className={styles.fileIconFallback}>
              {getFallbackIcon()}
            </div>
          )}
        </div>
      );

    case 'video':
      return (
        <div className={styles.fileVideoPreview}>
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
            <div className={styles.fileIconFallback}>
              {getFallbackIcon()}
            </div>
          )}
          <div className={styles.fileVideoOverlay}>
            <Film size={24} color="white" />
          </div>
        </div>
      );

    default:
      return (
        <div className={styles.fileIconFallback}>
          {getFallbackIcon()}
        </div>
      );
  }
};
const getFallbackIcon = () => {
  switch (fileType) {
    case 'image': return <ImageIcon size={48} color="#10b981" />;
    case 'video': return <Film size={48} color="#ef4444" />;
    case 'audio': return <Music size={48} color="#f59e0b" />;
    case 'pdf': 
    case 'document': return <FileText size={48} color="#3b82f6" />;
    default: return <FileText size={48} color="#6b7280" />;
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
  onSelect(file); 
  };

  const handleCardDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick(file);
    }
  };

  return (
    <div
      className={styles.themeCard}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
    >
      <div className={styles.themeContent}>
        <div className={styles.themeIconContainer}>
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
        </div>
      </div>
    </div>
  );
};

export default FileCard;