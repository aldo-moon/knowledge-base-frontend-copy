// components/BaseConocimientos/Folders/FoldersGrid.tsx
import React from 'react';
import FolderCard from './FolderCard';
import { FolderCardSkeleton } from '../Skeleton/SkeletonLoaders';
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
  onFolderDoubleClick?: (folder: Folder) => void;
  onFolderMenuAction: (action: string, folder: Folder) => void;
  onToggleFolderFavorite?: (folderId: string) => void;
  isTrashView?: boolean;
  selectedItems?: Set<string>;
  onItemSelect?: (itemId: string) => void;
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

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <div className={styles.contentSection}>
        <h3 className={styles.sectionTitle}>Carpetas</h3>
        <div className={styles.foldersGrid}>
          {[...Array(6)].map((_, index) => (
            <FolderCardSkeleton key={`skeleton-${index}`} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentSection}>
        <div className={styles.errorMessage}>
          <p>⚠️ Error al cargar carpetas: {error}</p>
        </div>
      </div>
    );
  }
if (folders.length === 0 && !loading) {
  return null; // Solo ocultar si NO está cargando
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
            onDoubleClick={onFolderDoubleClick || (() => {})}
            onMenuAction={onFolderMenuAction}
            onToggleFavorite={onToggleFolderFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FoldersGrid;