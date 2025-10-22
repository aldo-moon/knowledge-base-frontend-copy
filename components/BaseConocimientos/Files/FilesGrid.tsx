// components/BaseConocimientos/Files/FilesGrid.tsx
import React from 'react';
import FileCard from './FileCard';
import { FileCardSkeleton } from '../Skeleton/SkeletonLoaders';
import styles from '../../../styles/base-conocimientos.module.css';

interface File {
  _id: string;
  file_name: string;
  type_file?: string;
  s3_path?: string;
  creation_date?: string;
  last_update?: string;
}
interface FilesGridProps {
  files: File[];
  loading?: boolean;
  error?: string | null;
  fileFavorites?: Set<string>;
  onFileSelect?: (file: File) => void; 
  onFileDoubleClick?: (file: File) => void;
  onFileMenuAction?: (action: string, file: File) => void;
  onToggleFileFavorite?: (fileId: string) => void;
  
  // Props para vista de papelera (consistente con FoldersGrid y ThemesGrid)
  isTrashView?: boolean;
  selectedItems?: Set<string>;
  onItemSelect?: (itemId: string) => void;
}

export const FilesGrid: React.FC<FilesGridProps> = ({
  files = [],
  loading = false,
  error = null,
  fileFavorites = new Set(),
  onFileSelect,
  onFileDoubleClick,
  onFileMenuAction,
  onToggleFileFavorite,
   isTrashView = false,
  selectedItems,
  onItemSelect
}) => {

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <div className={styles.contentSection}>
        <h3 className={styles.sectionTitle}>Archivos</h3>
        <div className={styles.filesGrid}>
          {[...Array(6)].map((_, index) => (
            <FileCardSkeleton key={`skeleton-${index}`} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentSection}>
        <div className={styles.errorMessage}>
          <p>⚠️ Error al cargar archivos: {error}</p>
        </div>
      </div>
    );
  }

if (files.length === 0 && !loading) {
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
              onSelect={onFileSelect || (() => {})} // ← Proporcionar fallback
              onDoubleClick={onFileDoubleClick}
              onMenuAction={onFileMenuAction}
              onToggleFavorite={onToggleFileFavorite}
              isTrashView={isTrashView}           
              selectedItems={selectedItems}       
              onItemSelect={onItemSelect}         
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilesGrid;