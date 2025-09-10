// components/BaseConocimientos/Modals/DeleteFolderModal.jsx
import React from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface DeleteFolderModalProps {
  isOpen: boolean;
  folderToDelete: {
    _id: string;
    folder_name: string;
  } | null;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  isOpen,
  folderToDelete,
  onConfirmDelete,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBody}>
          <p className={styles.deleteMessage}>
            ¿Deseas mover la carpeta "{folderToDelete?.folder_name}" a la papelera?
            </p>
            <p className={styles.deleteMessage1}>
              Incluye 76 elementos que se eliminarán definitivamente <br/> después de 30 días.
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

export default DeleteFolderModal;