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
  onFolderDoubleClick?: (folder: Folder) => void; // ← Hacer opcional
  onFolderMenuAction: (action: string, folder: Folder) => void;
  onToggleFolderFavorite?: (folderId: string) => void;
  // Props para vista de papelera
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

  // Donde pases las carpetas a FoldersGrid o similar:
console.log('📁 Pasando folders a FoldersGrid:', folders);
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
console.log('🎯 FoldersGrid va a renderizar:', folders?.length, 'carpetas');

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
  onDoubleClick={onFolderDoubleClick || (() => {})} // ← Proporcionar fallback
  onMenuAction={onFolderMenuAction}
  onToggleFavorite={onToggleFolderFavorite}
  // Props de papelera si las necesitas

/>
        ))}
      </div>
    </div>
  );
};

export default FoldersGrid;