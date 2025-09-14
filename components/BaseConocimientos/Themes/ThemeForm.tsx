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
    priority: '',
    area: '',
    position: '',
    files: [],
    tags: '',
    aiModel: '',
    suggestInHelpDesk: false
  });

  const [errors, setErrors] = useState({
  priority: '',
  area: '',
  position: '',
  tags: ''
});

// Función de validación
const validateForm = () => {
  const newErrors = {
    priority: '',
    area: '',
    position: '',
    tags: ''
  };

  // Validar Prioridad
  if (!formData.priority || formData.priority === '') {
    newErrors.priority = 'La prioridad es obligatoria';
  }

  // Validar Área
  if (!formData.area || formData.area === '') {
    newErrors.area = 'El área es obligatoria';
  }

  // Validar Puesto
  if (!formData.position || formData.position === '') {
    newErrors.position = 'El puesto es obligatorio';
  }

  // Validar Tags
  if (!formData.tags || formData.tags === '') {
    newErrors.tags = 'Los tags son obligatorios';
  }

  setErrors(newErrors);

  // Retornar true si no hay errores
  return Object.values(newErrors).every(error => error === '');
};


useEffect(() => {
  const loadFormData = async () => {
    try {
      setLoadingData(true);

      
      const [areasData, puestosData] = await Promise.all([
        areaService.getAllAreas(),
        puestoService.getAllPuestos()
      ]);
      

      
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
  if (validateForm()) {
    onSubmit?.(formData);
  }
};

const handleInputChangeWithValidation = (field: keyof ThemeFormData, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));

  // Limpiar error del campo cuando el usuario selecciona algo
  if (errors[field as keyof typeof errors]) {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }
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
            className={`${styles.formSelect} ${errors.priority ? styles.formSelectError : ''}`}
            value={formData.priority}
            onChange={(e) => handleInputChangeWithValidation('priority', e.target.value)}
          >
            <option value="">Seleccionar prioridad</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
          </select>
          {errors.priority && <span className={styles.errorMessage}>{errors.priority}</span>}
        </div>

        {/* Áreas */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Áreas</label>
            <select 
              className={`${styles.formSelect} ${errors.area ? styles.formSelectError : ''}`}
              value={formData.area}
              onChange={(e) => handleInputChangeWithValidation('area', e.target.value)}
              disabled={loadingData}
            >
              <option value="">
                {loadingData ? 'Cargando...' : 'Seleccionar área'}
              </option>
              {areas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name_area}
                </option>
              ))}
            </select>
            {errors.area && <span className={styles.errorMessage}>{errors.area}</span>}
        </div>

        {/* Puestos */}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Puestos</label>
            <select 
              className={`${styles.formSelect} ${errors.position ? styles.formSelectError : ''}`}
              value={formData.position}
              onChange={(e) => handleInputChangeWithValidation('position', e.target.value)}
              disabled={loadingData}
            >
              <option value="">
                {loadingData ? 'Cargando...' : 'Seleccionar puesto'}
              </option>
              {puestos.map((puesto) => (
                <option key={puesto._id} value={puesto._id}>
                  {puesto.name_role}
                </option>
              ))}
            </select>
            {errors.position && <span className={styles.errorMessage}>{errors.position}</span>}
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
            <label htmlFor="fileInput" style={{ cursor: 'pointer', width: '100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
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
            className={`${styles.formSelect} ${errors.tags ? styles.formSelectError : ''}`}
            value={formData.tags}
            onChange={(e) => handleInputChangeWithValidation('tags', e.target.value)}
          >
            <option value="">Seleccionar tags</option>
            <option value="importante">Importante</option>
            <option value="urgente">Urgente</option>
            <option value="proyecto">Proyecto</option>
          </select>
          {errors.tags && <span className={styles.errorMessage}>{errors.tags}</span>}
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