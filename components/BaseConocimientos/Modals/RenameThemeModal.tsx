// components/BaseConocimientos/Modals/RenameThemeModal.tsx
import React, { useState, useEffect } from "react";
import styles from "../../../styles/base-conocimientos.module.css";

interface RenameThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenameTheme: (newName: string) => void;
  currentName: string;
}

export const RenameThemeModal: React.FC<RenameThemeModalProps> = ({
  isOpen,
  onClose,
  onRenameTheme,
  currentName,
}) => {
  const [themeName, setThemeName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setThemeName(currentName);
    }
  }, [isOpen, currentName]);

  const handleRename = () => {
    if (themeName.trim()) {
      onRenameTheme(themeName.trim());
      setThemeName("");
    }
  };

  const handleCancel = () => {
    setThemeName("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Renombrar Tema</h3>
        </div>

        <div className={styles.modalBody}>
          <input
            id="renameTheme"
            type="text"
            className={styles.modalInput}
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Nuevo nombre del tema"
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancelButton} onClick={handleCancel}>
            Cancelar
          </button>
          <button
            className={styles.modalCreateButton}
            onClick={handleRename}
            disabled={!themeName.trim() || themeName === currentName}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameThemeModal;
