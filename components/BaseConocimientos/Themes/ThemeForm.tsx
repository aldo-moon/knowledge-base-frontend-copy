// components/BaseConocimientos/Themes/ThemeForm.tsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface ThemeFormProps {
  onSubmit?: (formData: ThemeFormData) => void;
  onCancel?: () => void;
}

interface ThemeFormData {
  priority: string;
  area: string;
  position: string;
  files: File[];
  tags: string;
  aiModel: string;
  suggestInHelpDesk: boolean;
}

export const ThemeForm: React.FC<ThemeFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ThemeFormData>({
    priority: 'Normal',
    area: '',
    position: '',
    files: [],
    tags: '',
    aiModel: '',
    suggestInHelpDesk: false
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field: keyof ThemeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
    // Ocultar el modal después de 2 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
      onSubmit?.(formData);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleInputChange('files', files);
  };

  return (
    <div className={styles.topicFormContent}>
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e1e2f',
            padding: '30px',
            borderRadius: '10px',
            textAlign: 'center',
            maxWidth: '400px',
            margin: '20px'
          }}>
            <h2 style={{ color: '#6262bf', marginBottom: '15px' }}>¡TEMA CREADO!</h2>
            <p style={{ marginBottom: '20px' }}>El tema ha sido creado exitosamente</p>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#6262bf',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'white',
              fontSize: '20px'
            }}>
              ✓
            </div>
          </div>
        </div>
      )}

      <form className={styles.topicForm} onSubmit={(e) => e.preventDefault()}>
        {/* Prioridad */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Prioridad</label>
          <select 
            className={styles.formSelect}
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Áreas */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Áreas</label>
          <select 
            className={styles.formSelect}
            value={formData.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            <option value="Marketing">Marketing</option>
            <option value="Ventas">Ventas</option>
            <option value="Desarrollo">Desarrollo</option>
          </select>
        </div>

        {/* Puestos */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Puestos</label>
          <select 
            className={styles.formSelect}
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
          >
            <option value="">--</option>
            <option value="Director">Director</option>
            <option value="Gerente">Gerente</option>
            <option value="Analista">Analista</option>
          </select>
        </div>

        {/* Archivos */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <u>Archivos</u>
            <span className={styles.multimediaTag}>Multimedia</span>
          </label>
          <div className={styles.fileUploadArea}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{ cursor: 'pointer', width: '100%' }}>
              <div className={styles.uploadIcon}>
                <Upload size={48} />
              </div>
              <p className={styles.uploadText}>
                {formData.files.length > 0 
                  ? `${formData.files.length} archivo(s) seleccionado(s)`
                  : 'Cargar archivos'
                }
              </p>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tags</label>
          <select 
            className={styles.formSelect}
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
          >
            <option value="">Escribe palabras clave</option>
            <option value="importante">Importante</option>
            <option value="urgente">Urgente</option>
            <option value="proyecto">Proyecto</option>
          </select>
        </div>

        {/* Alimentar AI */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Alimentar AI</label>
          <select 
            className={styles.formSelect}
            value={formData.aiModel}
            onChange={(e) => handleInputChange('aiModel', e.target.value)}
          >
            <option value="">Selecciona una AI</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude">Claude</option>
          </select>
          <div className={styles.aiSuggestion}>
            <input 
              type="checkbox" 
              id="aiSuggestion" 
              className={styles.checkbox}
              checked={formData.suggestInHelpDesk}
              onChange={(e) => handleInputChange('suggestInHelpDesk', e.target.checked)}
            />
            <label htmlFor="aiSuggestion" className={styles.checkboxLabel}>
              Sugerir en help desk
            </label>
          </div>
        </div>

        {/* Botón Crear */}
        <button 
          type="button" 
          className={styles.createButton}
          onClick={handleSubmit}
        >
          CREAR
        </button>
      </form>
    </div>
  );
};

export default ThemeForm;