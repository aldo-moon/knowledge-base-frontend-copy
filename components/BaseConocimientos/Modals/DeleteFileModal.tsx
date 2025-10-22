// components/BaseConocimientos/Modals/DeleteFileModal.tsx
import React from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface DeleteFileModalProps {
  isOpen: boolean;
  fileToDelete: {
    _id: string;
    file_name: string;
  } | null;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const DeleteFileModal: React.FC<DeleteFileModalProps> = ({
  isOpen,
  fileToDelete,
  onConfirmDelete,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBody}>
          <p className={styles.deleteMessage}>
            ¿Estás seguro de mover a la papelera el archivo "{fileToDelete?.file_name}"?
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.modalCancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalDeleteButton}
            onClick={onConfirmDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileModal;