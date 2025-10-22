// components/BaseConocimientos/Modals/DeleteThemeModal.jsx
import React from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface DeleteThemeModalProps {
  isOpen: boolean;
  themeToDelete: {
    _id: string;
    title_name: string;
  } | null;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const DeleteThemeModal: React.FC<DeleteThemeModalProps> = ({
  isOpen,
  themeToDelete,
  onConfirmDelete,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBody}>
          <p className={styles.deleteMessage}>
            ¿Deseas mover el tema "{themeToDelete?.title_name}" a la papelera?
          </p>
          <p className={styles.deleteMessage1}>
              Se eliminarán definitivamente <br/> después de 30 días.
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

export default DeleteThemeModal;