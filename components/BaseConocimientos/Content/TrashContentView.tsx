// components/BaseConocimientos/Content/TrashContentView.tsx
import React, { useState } from 'react';
import { AlertTriangle, Trash2, RotateCcw, Info } from 'lucide-react';
import FoldersGrid from '../Folders/FoldersGrid';
import ThemesGrid from '../Themes/ThemesGrid';
import FilesGrid from '../Files/FilesGrid';
import ContentFilters from './ContentFilters';
import styles from './../../../styles/base-conocimientos.module.css';

interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
   isTrashView?: boolean; 
}

interface File {
  _id: string;
  file_name: string;
  type_file?: string;
  s3_path?: string;
  creation_date?: string;
  last_update?: string;
}

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
    isDraft?: boolean; // ✅ Nueva propiedad

}

interface TrashItem {
  _id: string;
  type_content: 'Carpeta' | 'Tema' | 'Archivo';
  content_id: string;
  created_at?: string;
  user_bin_id?: string; // ✅ Hacer opcional con ?
  expireAt?: string; // ✅ Agregar esta propiedad
  originalContent?: any; // ← Cambiar de "Folder | Theme | File" a "any"
  // ... otras propiedades que pueda tener
}



interface TrashContentViewProps {
  // Datos de papelera
  trashItems: TrashItem[];
  trashFolders: Folder[];
  trashThemes: Theme[];
  trashFiles: File[];
  loading?: boolean;
  error?: string | null;
  
  // Props de filtros (igual que otras vistas)
  areFiltersVisible: boolean;
  activeContentFilters: string[];
  currentSortBy: string;
  onToggleFiltersVisibility: () => void;
  onFilterClick: (filterLabel: string) => void;
  onSortOptionClick: (option: any) => void;
  
  // Handlers específicos para papelera
  onRestoreItem: (papeleraId: string, type: string) => void;
  onPermanentDelete: (papeleraId: string, type: string) => void;
  onEmptyTrash: () => void;
  onRestoreSelected: (papeleraIds: string[]) => void;
  onDeleteSelected: (papeleraIds: string[]) => void;
  
  // Handlers estándar
  onThemeSelect?: (theme: Theme) => void;
  onFolderSelect?: (folder: Folder) => void;
  onFileSelect?: (file: File) => void;
}

export const TrashContentView: React.FC<TrashContentViewProps> = ({
  trashItems,
  trashFolders,
  trashThemes,
  trashFiles,
  loading = false,
  error = null,
  areFiltersVisible,
  activeContentFilters,
  currentSortBy,
  onToggleFiltersVisibility,
  onFilterClick,
  onSortOptionClick,
  onRestoreItem,
  onPermanentDelete,
  onEmptyTrash,
  onRestoreSelected,
  onDeleteSelected,
  onThemeSelect,
  onFolderSelect,
  onFileSelect
}) => {
      console.log('🗂️ TrashContentView recibió:', {
    trashItems: trashItems?.length,
    trashFolders: trashFolders?.length,
    trashThemes: trashThemes?.length,
    trashFiles: trashFiles?.length
  });

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);

  // Estadísticas de papelera
  const stats = {
    total: trashItems.length,
    carpetas: trashFolders.length,
    temas: trashThemes.length,
    archivos: trashFiles.length
  };

  // Handlers para selección múltiple
  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === trashItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(trashItems.map(item => item._id)));
    }
  };

  // Handlers para acciones de papelera
  const handleTrashMenuAction = (action: string, content: any, type: string) => {
    // Buscar el item de papelera correspondiente
const trashItem = trashItems.find(item => 
  item.content_id === content._id && 
  item.type_content.toLowerCase() === type.toLowerCase()
);
    
    if (!trashItem) return;

    switch (action) {
      case 'restore':
        onRestoreItem(trashItem._id, type);
        break;
      case 'delete':
        onPermanentDelete(trashItem._id, type);
        break;
    }
  };

  const handleRestoreSelected = () => {
    const selectedArray = Array.from(selectedItems);
    onRestoreSelected(selectedArray);
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    const selectedArray = Array.from(selectedItems);
    onDeleteSelected(selectedArray);
    setSelectedItems(new Set());
  };

  const handleEmptyTrash = () => {
    setShowConfirmEmpty(true);
  };

  const confirmEmptyTrash = () => {
    onEmptyTrash();
    setShowConfirmEmpty(false);
    setSelectedItems(new Set());
  };

  if (loading) {
    return (
        
     <div className={styles.foldersSection}>
        <div className={styles.contentHeader}>
          <h2 className={styles.sectionTitle1}>Papelera</h2>
        </div>
        <div className={styles.loadingContainer}>
          <p>Cargando papelera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.foldersSection}>
      {/* Header con información de papelera */}
       <div className={styles.trashHeader}>
        <div className={styles.trashHeaderLeft}>
          <div className={styles.trashIcon}>
            <Trash2 size={24} />
          </div>
          <div className={styles.trashInfo}>
            <h2 className={styles.trashTitle}>Papelera</h2>
            <p className={styles.trashSubtitle}>
              {stats.total} elementos • {stats.carpetas} carpetas • {stats.temas} temas • {stats.archivos} archivos
            </p>
          </div>
        </div>
        
        <div className={styles.trashActions}>
          {selectedItems.size > 0 && (
            <>
              <button
                className={styles.trashActionButton}
                onClick={handleRestoreSelected}
                title="Restaurar seleccionados"
              >
                <RotateCcw size={16} />
                Restaurar ({selectedItems.size})
              </button>
              <button
                className={`${styles.trashActionButton} ${styles.dangerButton}`}
                onClick={handleDeleteSelected}
                title="Eliminar permanentemente"
              >
                <Trash2 size={16} />
                Eliminar ({selectedItems.size})
              </button>
            </>
          )}
          
          {stats.total > 0 && (
            <button
              className={`${styles.trashActionButton} ${styles.dangerButton}`}
              onClick={handleEmptyTrash}
              title="Vaciar papelera"
            >
              <AlertTriangle size={16} />
              Vaciar papelera
            </button>
          )}
        </div>
      </div> 

      {/* Filtros */}
      <div className={styles.contentHeader}>
        <ContentFilters 
          navigationPath={[{ id: 'trash', name: 'Papelera' }]}
          onNavigate={() => {}}
          areFiltersVisible={areFiltersVisible}
          activeContentFilters={activeContentFilters}
          currentSortBy={currentSortBy}
          onToggleFiltersVisibility={onToggleFiltersVisibility}
          onFilterClick={onFilterClick}
          onSortOptionClick={onSortOptionClick}
        />
      </div>

      {/* Contenido de papelera */}
      {stats.total === 0 ? (
        <div className={styles.emptyTrashContainer}>
          <div className={styles.emptyTrashIcon}>
            <Trash2 size={64} />
          </div>
          <h3 className={styles.emptyTrashTitle}>La papelera está vacía</h3>
          <p className={styles.emptyTrashText}>
            Los elementos eliminados aparecerán aquí. Puedes restaurarlos o eliminarlos permanentemente.
          </p>
        </div>
      ) : (
        <>
          {/* Información de ayuda */}
          <div className={styles.trashInfoBanner}>
            <Info size={16} />
            <span>
              Los elementos de la papelera se borrarán de forma definitiva después de 30 días
            </span>
          </div>

         
        <div className={styles.selectAllContainer}>
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectedItems.size === trashItems.length && trashItems.length > 0}
                onChange={handleSelectAll}
                className={styles.selectAllCheckbox}
              />
              Seleccionar todo ({stats.total})
            </label>
          </div> 

          <div className={styles.contentSections}>
            {/* Carpetas en papelera */}
            {trashFolders.length > 0 && (
              <FoldersGrid
                folders={trashFolders}
                loading={false}
                error={null}
                onFolderSelect={onFolderSelect ?? (() => {})} // fallback vacío
                onFolderMenuAction={(action, folder) => handleTrashMenuAction(action, folder, 'carpeta')}
                isTrashView={true}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
              />
            )}

            {/* Temas en papelera */}
            {trashThemes.length > 0 && (
              <ThemesGrid
                themes={trashThemes}
                onThemeSelect={onThemeSelect}
                onThemeMenuAction={(action, theme) => handleTrashMenuAction(action, theme, 'tema')}
                isTrashView={true}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
              />
            )}

            {/* Archivos en papelera */}
            {trashFiles.length > 0 && (
              <FilesGrid
                files={trashFiles}
                loading={false}
                error={null}
                onFileSelect={onFileSelect}
                onFileMenuAction={(action, file) => handleTrashMenuAction(action, file, 'archivo')}
                isTrashView={true}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
              />
            )}
          </div>
        </>
      )}

      {/* Modal de confirmación para vaciar papelera */}
      {showConfirmEmpty && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.modalHeader}>
              <AlertTriangle size={24} className={styles.warningIcon} />
              <h3>¿Vaciar papelera?</h3>
            </div>
            <div className={styles.modalBody}>
              <p>
                Esta acción eliminará permanentemente <strong>{stats.total} elementos</strong> de la papelera.
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmEmpty(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmButton}
                onClick={confirmEmptyTrash}
              >
                Vaciar papelera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashContentView;