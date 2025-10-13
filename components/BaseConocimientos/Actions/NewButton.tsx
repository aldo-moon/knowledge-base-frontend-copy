// components/BaseConocimientos/Actions/NewButton.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, FolderPlus, MessageSquare, Camera, LayoutTemplate, FileBox } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface DropdownOption {
  icon: React.ElementType;
  label: string;
  action: string;
}

interface NewButtonProps {
  onOptionClick: (action: string) => void;
}

export const NewButton: React.FC<NewButtonProps> = ({ onOptionClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownOptions: DropdownOption[] = [
    { icon: FolderPlus, label: 'Nueva carpeta', action: 'new-folder' },
    { icon: MessageSquare, label: 'Nuevo Tema', action: 'new-topic' },
    { icon: Camera, label: 'Multimedia', action: 'multimedia' },
    { icon: LayoutTemplate, label: 'Nuevo Modelo', action: 'new-modelo' },
    { icon: FileBox, label: 'Nueva Sección', action: 'new-section' }
  ];

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    onOptionClick(option.action);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.newButtonContainer} ref={dropdownRef}>
      <button 
        className={styles.newButton}
        onClick={handleButtonClick}
      >
        <Plus size={22} />
        Nuevo
      </button>
      
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {dropdownOptions.map((option, index) => (
            <button
              key={index}
              className={styles.dropdownOption}
              onClick={() => handleOptionClick(option)}
            >
              <option.icon size={18} className={styles.optionIcon} />
              <span className={styles.optionLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewButton;