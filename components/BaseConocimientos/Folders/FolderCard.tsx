// components/BaseConocimientos/Folders/FolderCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Folder, MoreHorizontal, Star, Edit, Trash } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
}

interface MenuOption {
  icon: React.ElementType;
  label: string;
  action: string;
}

interface FolderCardProps {
  folder: Folder;
  index: number;
  onSelect: (folder: Folder) => void;
  onDoubleClick: (folder: Folder) => void;
  onMenuAction: (action: string, folder: Folder) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (folderId: string) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  index,
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
    onMenuAction(action, folder);
    setIsMenuOpen(false);
  };

  const handleCardClick = () => {
    onSelect(folder);
  };

  const handleCardDoubleClick = () => {
    onDoubleClick(folder);
  };

  return (
    <div
      className={styles.folderCard}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
    >
      <div className={styles.folderCardHeader}>
        <div className={styles.folderInfo}>
          <Folder className={styles.folderIcon} size={24} />
          <h3 className={styles.folderName}>{folder.folder_name}</h3>
        </div>

        <div className={styles.folderActions}>
          <div className={styles.folderMenuContainer} ref={menuRef}>
            <button 
              className={styles.folderMenuButton}
              onClick={handleMenuClick}
            >
              <MoreHorizontal size={18} />
            </button>
            
            {isMenuOpen && (
              <div className={styles.folderContextMenu}>
                {menuOptions.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className={styles.folderContextOption}
                    data-action={option.action}
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
            className={styles.folderStarButton}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Star clicked, onToggleFavorite exists:', !!onToggleFavorite);
              console.log('Folder ID:', folder._id);
              onToggleFavorite?.(folder._id);
            }}
          >
            <Star 
              size={18} 
              className={styles.folderStarIcon}
              fill={isFavorite ? "#fbbf24" : "none"}
              color={isFavorite ? "#fbbf24" : "#8b8d98"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;