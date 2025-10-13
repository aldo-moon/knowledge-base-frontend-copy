// components/BaseConocimientos/Modals/MoveThemeModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import styles from './MoveThemeModal.module.css';
import { carpetaService } from '../../../services/carpetaService';

interface SubfolderItem {
  _id: string;
  folder_name: string;
}

interface MoveThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
  currentFolderId: string;
  themeName: string;
}

export const MoveThemeModal: React.FC<MoveThemeModalProps> = ({
  isOpen,
  onClose,
  onMove,
  currentFolderId,
  themeName
}) => {
  const [folders, setFolders] = useState<Record<string, SubfolderItem[]>>({});
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRootFolders();
    }
  }, [isOpen]);

  const loadRootFolders = async () => {
    try {
      setLoading(true);
      const response = await carpetaService.getFolderContent("68acb06886d455d16cceef05");
      setFolders({ root: response });
    } catch (error) {
      console.error('Error loading root folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubfolderContent = async (folderId: string) => {
    try {
      const response = await carpetaService.getFolderContent(folderId);
      setFolders(prev => ({
        ...prev,
        [folderId]: response
      }));
    } catch (error) {
      console.error('Error loading subfolder content:', error);
      setFolders(prev => ({
        ...prev,
        [folderId]: []
      }));
    }
  };

  const handleFolderExpand = async (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));

    if (!expandedFolders[folderId] && !folders[folderId]) {
      await loadSubfolderContent(folderId);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    if (folderId !== currentFolderId) {
      setSelectedFolderId(folderId);
    }
  };

  const handleMove = () => {
    if (selectedFolderId && selectedFolderId !== currentFolderId) {
      onMove(selectedFolderId);
      onClose();
    }
  };

  const renderFolder = (folder: SubfolderItem, level: number = 0) => {
    const isExpanded = expandedFolders[folder._id];
    const isSelected = selectedFolderId === folder._id;
    const isCurrent = currentFolderId === folder._id;
    const hasSubfolders = folders[folder._id] && folders[folder._id].length > 0;

    return (
      <div key={folder._id} className={styles.folderItem}>
        <div
          className={`${styles.folderRow} ${isSelected ? styles.selected : ''} ${isCurrent ? styles.disabled : ''}`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => !isCurrent && handleFolderSelect(folder._id)}
        >
          <button
            className={styles.expandButton}
            onClick={(e) => handleFolderExpand(folder._id, e)}
            disabled={isCurrent}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <Folder size={16} className={styles.folderIcon} />
          <span className={styles.folderName}>
            {folder.folder_name}
            {isCurrent && <span className={styles.currentBadge}>(Ubicación actual)</span>}
          </span>
        </div>

        {isExpanded && hasSubfolders && (
          <div className={styles.subfolders}>
            {folders[folder._id].map((subfolder) => renderFolder(subfolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cambiar ubicación de tema</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.themeName}>
            Moviendo: <strong>{themeName}</strong>
          </p>

          <div className={styles.foldersTree}>
            {loading ? (
              <p className={styles.loadingText}>Cargando carpetas...</p>
            ) : (
              folders.root?.map((folder) => renderFolder(folder, 0))
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.moveButton}
            onClick={handleMove}
            disabled={!selectedFolderId || selectedFolderId === currentFolderId}
          >
            Mover aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveThemeModal;