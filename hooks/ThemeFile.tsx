// components/BaseConocimientos/Files/ThemeFile.tsx
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

interface ThemeFileProps {
  files: File[];
  loading?: boolean;
  error?: string | null;
  fileFavorites?: Set<string>;
  onFileSelect: (file: File) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileMenuAction?: (action: string, file: File) => void;
  onToggleFavorite?: (fileId: string) => void;  // ← Debe estar exactamente así
}

// Componente individual para cada archivo - IGUAL QUE THEMECARD
const FileCard: React.FC<{
  file: File;
  onFileSelect: (file: File) => void;
  onDoubleClick?: (file: File) => void;
  onMenuAction?: (action: string, file: File) => void;  // ← Aquí dice onMenuAction
  isFavorite?: boolean;
  onToggleFavorite?: (fileId: string) => void;  // ← Cambiar nombre aquí
}> = ({
  file, 
  onFileSelect,
  onDoubleClick,
  onMenuAction,
  isFavorite = false,
  onToggleFavorite  // ← Y aquí también
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
    onFileSelect(file);  // ← Usar onFileSelect que sí existe
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
                  {console.log('Rendering menu, isMenuOpen:', isMenuOpen, 'onMenuAction:', !!onMenuAction)} {/* Agregar este log */}
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
              onToggleFavorite?.(file._id);  // ← Usar onToggleFavorite
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
export const ThemeFile: React.FC<ThemeFileProps> = (props) => {

  
  const {
    files = [],
    loading = false,
    error = null,
    fileFavorites = new Set(),
    onFileSelect,
    onFileDoubleClick,
    onFileMenuAction,
    onToggleFavorite
  } = props;

  if (loading) {
    return (
      <div className={styles.contentSection}>
        <p>Cargando archivos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentSection}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

return (
  <div className={styles.contentSection}>
    <h3 className={styles.sectionTitle}>Multimedia</h3>
    <div className={styles.themesGrid}>
      {files.map((file) => {

        return (
          <FileCard
            key={file._id}
            file={file}
            isFavorite={fileFavorites.has(file._id)}
            onFileSelect={onFileSelect}  
            onDoubleClick={onFileDoubleClick}
            onMenuAction={onFileMenuAction}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  </div>
);
};

export default ThemeFile;