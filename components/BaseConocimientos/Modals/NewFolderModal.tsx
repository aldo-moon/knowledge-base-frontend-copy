// components/BaseConocimientos/Modals/NewFolderModal.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
  initialName?: string;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  initialName = ''
}) => {
  const [folderName, setFolderName] = useState(initialName);

  // Reset cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFolderName(initialName);
    }
  }, [isOpen, initialName]);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
    }
  };

  const handleCancel = () => {
    setFolderName('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Nueva Carpeta</h3>
        </div>
        
        <div className={styles.modalBody}>
          <input
            id="folderName"
            type="text"
            className={styles.modalInput}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Ingresa el nombre de la carpeta"
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
            onClick={handleCreate}
            disabled={!folderName.trim()}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;