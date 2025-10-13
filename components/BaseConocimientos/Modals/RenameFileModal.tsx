// components/BaseConocimientos/Modals/RenameFileModal.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface RenameFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenameFile: (newName: string) => void;
  currentName: string;
}

export const RenameFileModal: React.FC<RenameFileModalProps> = ({
  isOpen,
  onClose,
  onRenameFile,
  currentName
}) => {
  const [fileName, setFileName] = useState(currentName);

  // Reset cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFileName(currentName);
    }
  }, [isOpen, currentName]);

  const handleRename = () => {
    if (fileName.trim()) {
      onRenameFile(fileName.trim());
      setFileName('');
    }
  };

  const handleCancel = () => {
    setFileName('');
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
          <h3 className={styles.modalTitle}>Renombrar Archivo</h3>
        </div>
        
        <div className={styles.modalBody}>
          <input
            id="renameFile"
            type="text"
            className={styles.modalInput}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Nuevo nombre del archivo"
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
            disabled={!fileName.trim() || fileName === currentName}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFileModal;