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
  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [error, setError] = useState('');

  // Separar nombre y extensión cuando se abre el modal
  useEffect(() => {
    if (isOpen && currentName) {
      const lastDotIndex = currentName.lastIndexOf('.');
      
      if (lastDotIndex > 0) {
        // Tiene extensión
        const nameWithoutExt = currentName.substring(0, lastDotIndex);
        const ext = currentName.substring(lastDotIndex + 1);
        setFileName(nameWithoutExt);
        setFileExtension(ext);
      } else {
        // Sin extensión (caso raro, pero lo manejamos)
        setFileName(currentName);
        setFileExtension('');
      }
      setError('');
    }
  }, [isOpen, currentName]);

  const handleRename = () => {
    const trimmedName = fileName.trim();
    
    // Validaciones
    if (!trimmedName) {
      setError('El nombre del archivo no puede estar vacío');
      return;
    }

    // Verificar que no contenga caracteres inválidos
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedName)) {
      setError('El nombre contiene caracteres no permitidos');
      return;
    }

    // Construir el nombre completo con la extensión original
    const fullName = fileExtension 
      ? `${trimmedName}.${fileExtension}` 
      : trimmedName;

    // Verificar que no sea igual al nombre actual
    if (fullName === currentName) {
      setError('El nombre no ha cambiado');
      return;
    }

    onRenameFile(fullName);
    handleClose();
  };

  const handleClose = () => {
    setFileName('');
    setFileExtension('');
    setError('');
    onClose();
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    setError(''); // Limpiar error al escribir
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Renombrar Archivo</h3>
        </div>
        
        <div className={styles.modalBody}>
          <div style={{ marginBottom: '8px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                id="renameFile"
                type="text"
                className={styles.modalInput}
                value={fileName}
                onChange={handleFileNameChange}
                placeholder="Nombre del archivo"
                autoFocus
                onKeyDown={handleKeyDown}
                style={{ flex: 1 }}
              />
              {fileExtension && (
                <span 
                  style={{ 
                    fontSize: '16px', 
                    color: '#6b7280',
                    fontWeight: '500',
                    paddingRight: '8px'
                  }}
                >
                  .{fileExtension}
                </span>
              )}
            </div>
          </div>
          
          {error && (
            <div 
              style={{ 
                color: '#ef4444', 
                fontSize: '13px', 
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {error}
            </div>
          )}

          
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.modalCancelButton}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalCreateButton}
            onClick={handleRename}
            disabled={!fileName.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFileModal;