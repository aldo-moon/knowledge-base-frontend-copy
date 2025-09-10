// components/BaseConocimientos/Themes/ThemeEditor.tsx
import React, { useState } from 'react';
import { ChevronLeft, Image } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface ThemeEditorProps {
  onBack: () => void;
  onSave?: (themeData: ThemeData) => void;
}

interface ThemeData {
  title: string;
  description: string;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  onBack,
  onSave
}) => {
  const [themeTitle, setThemeTitle] = useState('');
  const [themeDescription, setThemeDescription] = useState('');

  const handleSave = () => {
    if (themeTitle.trim() && themeDescription.trim()) {
      onSave?.({
        title: themeTitle,
        description: themeDescription
      });
    }
  };

  const handleCancel = () => {
    setThemeTitle('');
    setThemeDescription('');
    onBack();
  };

  return (
    <div className={styles.topicEditorSection}>
      <div className={styles.topicEditorHeader}>
        <h2 className={styles.topicEditorTitle}>Crear nuevo tema</h2>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <ChevronLeft size={20} />
          Volver
        </button>
      </div>
      
      <div className={styles.topicEditorContent}>
        <div className={styles.topicTitleSection}>
          <label className={styles.topicLabel}>Título del tema</label>
          <input
            type="text"
            className={styles.topicTitleInput}
            value={themeTitle}
            onChange={(e) => setThemeTitle(e.target.value)}
            placeholder="Elige un nombre"
          />
        </div>
        
        <div className={styles.topicDescriptionSection}>
          <label className={styles.topicLabel}>Descripción</label>
          <div className={styles.topicEditor}>
            <textarea
              className={styles.topicTextarea}
              value={themeDescription}
              onChange={(e) => setThemeDescription(e.target.value)}
              placeholder="Escribe una descripción..."
            />
            <div className={styles.editorToolbar}>
              <select className={styles.fontSelect}>
                <option>Sans Serif</option>
              </select>
              <select className={styles.sizeSelect}>
                <option>TT</option>
              </select>
              
              <div className={styles.toolbarDivider}></div>
              
              <button className={styles.formatButton} title="Negrita">
                <strong>B</strong>
              </button>
              <button className={styles.formatButton} title="Cursiva">
                <em>I</em>
              </button>
              <button className={styles.formatButton} title="Subrayado">
                <u>U</u>
              </button>
              <button className={styles.formatButton} title="Color de texto">
                A
              </button>
              
              <div className={styles.toolbarDivider}></div>
              
              <button className={styles.formatButton} title="Lista con viñetas">
                •
              </button>
              <button className={styles.formatButton} title="Lista numerada">
                1.
              </button>
              <button className={styles.formatButton} title="Cita">
                "
              </button>
              
              <div className={styles.toolbarDivider}></div>
              
              <button className={styles.formatButton} title="Adjuntar imagen">
                <Image size={16} />
              </button>
              <button className={styles.formatButton} title="Adjuntar archivo">
                📎
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;