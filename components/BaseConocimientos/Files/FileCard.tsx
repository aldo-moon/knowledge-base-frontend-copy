// components/BaseConocimientos/Files/FileCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Star, Edit, Trash } from 'lucide-react';
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

  const menuOptions: MenuOption[] = [
    { icon: Edit, label: 'Cambiar nombre', action: 'rename' },
    { icon: Trash, label: 'Eliminar', action: 'delete' }
  ];

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
          <img src="/Imagen.svg" alt="Archivo" className={styles.themeIcon} />
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
              console.log('Star clicked, onToggleFavorite exists:', !!onToggleFavorite);
              console.log('File ID:', file._id);
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