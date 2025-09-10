// components/BaseConocimientos/Folders/FoldersGrid.tsx
import React from 'react';
import FolderCard from './FolderCard';
import styles from '../../../styles/base-conocimientos.module.css';

interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
}

interface FoldersGridProps {
  folders: Folder[];
  loading?: boolean;
  error?: string | null;
  folderFavorites?: Set<string>; 
  onFolderSelect: (folder: Folder) => void;
  onFolderDoubleClick: (folder: Folder) => void;
  onFolderMenuAction: (action: string, folder: Folder) => void;
  onToggleFolderFavorite?: (folderId: string) => void; 
}

export const FoldersGrid: React.FC<FoldersGridProps> = ({
  folders,
  loading = false,
  error = null,
  folderFavorites = new Set(),
  onFolderSelect,
  onFolderDoubleClick,
  onFolderMenuAction,
  onToggleFolderFavorite 

}) => {
  if (loading) {
    return (
      <div className={styles.foldersSection}>
        <p>Cargando carpetas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.foldersSection}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className={styles.foldersSection}>
        <p>No hay carpetas disponibles</p>
      </div>
    );
  }

  return (
    <div className={styles.contentSection}>
      <h3 className={styles.sectionTitle}>Carpetas</h3>
      <div className={styles.foldersGrid}>
        {folders.map((folder, index) => (
          <FolderCard
            key={folder._id}
            folder={folder}
            index={index}
            isFavorite={folderFavorites.has(folder._id)}
            onSelect={onFolderSelect}
            onDoubleClick={onFolderDoubleClick}
            onMenuAction={onFolderMenuAction}
            onToggleFavorite={onToggleFolderFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FoldersGrid;