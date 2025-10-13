import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>Cargando editor...</div>
});

import 'react-quill/dist/quill.snow.css';

// ✅ Configuración de módulos simplificada
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['image', 'video', 'link'],
    ['clean']
  ]
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'blockquote', 'code-block', 'image', 'video', 'link'
];

interface ThemeData {
  title: string;
  description: string;
}

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
}

interface ThemeEditorProps {
  onBack: () => void;
  onSave?: (themeData: ThemeData) => void;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  isEditMode?: boolean;
  themeToEdit?: Theme;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  onBack,
  onSave,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  isEditMode = false,
  themeToEdit
}) => {
  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave?.({
        title: title,
        description: description
      });
    }
  };

  const handleCancel = () => {
    onTitleChange?.('');
    onDescriptionChange?.('');
    onBack();
  };

  return (
    <div className={styles.topicEditorSection}>
      <div className={styles.topicEditorHeader}>
        <h2 className={styles.topicEditorTitle}>
          {isEditMode ? 'Editar tema' : 'Crear nuevo tema'}
        </h2>
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
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="Elige un nombre"
          />
        </div>
        
        <div className={styles.topicDescriptionSection}>
          <label className={styles.topicLabel}>Descripción</label>
          <div className={styles.customQuillEditor}>
            <ReactQuill
              value={description}
              onChange={onDescriptionChange}
              modules={modules}
              formats={formats}
              placeholder="Escribe una descripción..."
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default ThemeEditor;