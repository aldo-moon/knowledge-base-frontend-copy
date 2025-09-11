// components/BaseConocimientos/Themes/ThemeEditor.tsx
import React, { useState } from 'react';
import { ChevronLeft, Image } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import dynamic from 'next/dynamic';

// Importación dinámica para evitar SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>Cargando editor...</div>
});

// Mantener el import del CSS
import 'react-quill/dist/quill.snow.css';

interface ThemeEditorProps {
  onBack: () => void;
  onSave?: (themeData: ThemeData) => void;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

interface ThemeData {
  title: string;
  description: string;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  onBack,
  onSave,
  title,
  description,
  onTitleChange,
  onDescriptionChange
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



const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['image', 'video', 'link'],
      ['document'], // Botón personalizado para documentos
      ['clean']
    ],
    handlers: {
      'document': function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.pptx';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            // Crear un enlace para el documento
            const fileName = file.name;
            const range = this.quill.getSelection();
            
            // Insertar un enlace con el nombre del archivo
            this.quill.insertText(range.index, `📄 ${fileName}`, {
              'color': '#6262bf',
              'bold': true
            });
            
            // Opcional: También puedes hacer algo con el archivo aquí
            console.log('Archivo seleccionado:', file);
          }
        };
        input.click();
      }
    }
  }
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'align',
  'blockquote', 'code-block', 'image', 'video'
];

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
              value={title}  // ← Cambiar de themeTitle a title
              onChange={(e) => onTitleChange?.(e.target.value)}  // ← Cambiar
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