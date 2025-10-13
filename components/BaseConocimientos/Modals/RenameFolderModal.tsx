// components/BaseConocimientos/Modals/RenameFolderModal.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface RenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenameFolder: (newName: string) => void;
  currentName: string;
}

export const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  isOpen,
  onClose,
  onRenameFolder,
  currentName
}) => {
  const [folderName, setFolderName] = useState(currentName);

  // Reset cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFolderName(currentName);
    }
  }, [isOpen, currentName]);

  const handleRename = () => {
    if (folderName.trim()) {
      onRenameFolder(folderName.trim());
      setFolderName('');
    }
  };

  const handleCancel = () => {
    setFolderName('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Renombrar Carpeta</h3>
        </div>
        
        <div className={styles.modalBody}>
          <input
            id="renameFolder"
            type="text"
            className={styles.modalInput}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Nuevo nombre de la carpeta"
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.modalCancelButton}
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalCreateButton}
            onClick={handleRename}
            disabled={!folderName.trim() || folderName === currentName}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;
