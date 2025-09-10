// components/BaseConocimientos/Files/FilesGrid.tsx
import React from 'react';
import FileCard from './FileCard';
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
  onFileSelect: (file: File) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileMenuAction?: (action: string, file: File) => void;
  onToggleFileFavorite?: (fileId: string) => void;
}

export const FilesGrid: React.FC<FilesGridProps> = ({
  files = [],
  loading = false,
  error = null,
  fileFavorites = new Set(),
  onFileSelect,
  onFileDoubleClick,
  onFileMenuAction,
  onToggleFileFavorite
}) => {
  console.log('📁 FilesGrid recibió fileFavorites:', Array.from(fileFavorites));

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
          const isFavorite = fileFavorites.has(file._id);
          
          return (
            <FileCard
              key={file._id}
              file={file}
              isFavorite={isFavorite}
              onSelect={onFileSelect}  
              onDoubleClick={onFileDoubleClick}
              onMenuAction={onFileMenuAction}
              onToggleFavorite={onToggleFileFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilesGrid;