// components/BaseConocimientos/Modals/MultimediaModal.jsx
import React from 'react';
import { Upload } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface MultimediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
}

const MultimediaModal: React.FC<MultimediaModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  if (!isOpen) return null;

  const handleUploadClick = () => {
    console.log('Subiendo multimedia...');
    onUpload();
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.multimediaModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.multimediaModalHeader}>
          <h3 className={styles.multimediaModalTitle}>Subir multimedia</h3>
        </div>
        <div className={styles.multimediaModalBody}>
          <div className={styles.multimediaUploadArea}>
            <div className={styles.multimediaUploadIcon}>
              <Upload size={48} />
            </div>
            <p className={styles.multimediaUploadText}>Cargar archivos</p>
          </div>
        </div>
        <div className={styles.multimediaModalFooter}>
          <button 
            className={styles.multimediaSubirButton}
            onClick={handleUploadClick}
          >
            SUBIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultimediaModal;