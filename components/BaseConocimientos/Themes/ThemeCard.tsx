// components/BaseConocimientos/Themes/ThemeCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Star, Edit, Trash, FolderOpen, RotateCcw, Trash2 } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
}

interface MenuOption {
  icon: React.ElementType;
  label: string;
  action: string;
}

interface ThemeCardProps {
  theme: Theme;
  onSelect: (theme: Theme) => void;
  onThemeDoubleClick?: (theme: Theme) => void;
  onMenuAction?: (action: string, theme: Theme) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (themeId: string) => void;
  isDraft?: boolean; // ✅ Nueva prop
    isTrashView?: boolean; // ✅ AGREGAR
  selectedItems?: Set<string>; // ✅ AGREGAR  
  onItemSelect?: (itemId: string) => void; // ✅ AGREGAR
 
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onSelect,
  onThemeDoubleClick,
  onMenuAction,
  isFavorite = false,
  onToggleFavorite,
  isDraft = false,
    isTrashView = false, // ✅ AGREGAR
  selectedItems, // ✅ AGREGAR
  onItemSelect // ✅ AGREGAR

}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

const menuOptions: MenuOption[] = isTrashView
  ? [
      { icon: RotateCcw, label: 'Restaurar', action: 'restore' },
      { icon: Trash2, label: 'Eliminar permanentemente', action: 'delete' }
    ]
  : 
    [
  { icon: Edit, label: 'Cambiar nombre', action: 'rename' },
  { icon: FolderOpen, label: 'Cambiar ubicación', action: 'move' }, // ✅ Nueva opción
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
      onMenuAction(action, theme);
    }
    setIsMenuOpen(false);
  };

  const handleCardClick = () => {
    if (isTrashView && onItemSelect) {
      onItemSelect(theme._id);
    } else {
      onSelect(theme);
    }
  };

  const handleCardDoubleClick = () => {
    if (onThemeDoubleClick) {
      onThemeDoubleClick(theme);
    }
  };

    return (
      <div
        className={`${styles.themeCard} ${isDraft ? styles.draftTheme : ''} ${isTrashView && selectedItems?.has(theme._id) ? styles.selected : ''}`}
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
      >
        <div className={styles.themeContent}>
          <div className={styles.themeIconContainer}>
          <img src="/knowledge/Tema.svg" alt="Tema" className={styles.themeIcon} />
          </div>
          <h3 className={styles.themeName}>{theme.title_name}</h3>
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
              <button className={styles.themeStarButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(theme._id);
                }}>
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

export default ThemeCard;