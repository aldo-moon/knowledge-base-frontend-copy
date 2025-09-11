// components/BaseConocimientos/Themes/ThemeForm.tsx
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { areaService } from '../../../services/areaService';
import { puestoService } from '../../../services/puestoService';

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

  const [areas, setAreas] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<ThemeFormData>({
    priority: 'Normal',
    area: '',
    position: '',
    files: [],
    tags: '',
    aiModel: '',
    suggestInHelpDesk: false
  });

useEffect(() => {
  const loadFormData = async () => {
    try {
      setLoadingData(true);
      console.log('🔍 Cargando áreas y puestos...');
      
      const [areasData, puestosData] = await Promise.all([
        areaService.getAllAreas(),
        puestoService.getAllPuestos()
      ]);
      
      console.log('🔍 Áreas recibidas:', areasData);
      console.log('🔍 Puestos recibidos:', puestosData);
      
      setAreas(areasData);
      setPuestos(puestosData);
    } catch (error) {
      console.error('❌ Error cargando datos del formulario:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  loadFormData();
}, []);


  const handleInputChange = (field: keyof ThemeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleInputChange('files', files);
  };



  return (
    <div className={styles.topicFormContent}>
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
            disabled={loadingData}
          >
            <option value="">
              {loadingData ? 'Cargando...' : 'Seleccionar...'}
            </option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name_area}
              </option>
            ))}
          </select>
        </div>

        {/* Puestos */}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Puestos</label>
            <select 
              className={styles.formSelect}
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={loadingData}
            >
              <option value="">
                {loadingData ? 'Cargando...' : '--'}
              </option>
              {puestos.map((puesto) => (
                <option key={puesto._id} value={puesto._id}>
                  {puesto.name_role}
                </option>
              ))}
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