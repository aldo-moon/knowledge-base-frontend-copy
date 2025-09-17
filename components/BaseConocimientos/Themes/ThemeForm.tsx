// components/BaseConocimientos/Themes/ThemeForm.tsx
import React, { useState, useEffect } from 'react';
import { Upload, X, FileImage, FileText, FileVideo, Music, Archive, File } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { areaService } from '../../../services/areaService';
import { puestoService } from '../../../services/puestoService';
import { archivoService } from '../../../services/archivoService';

interface ThemeFormProps {
  onSubmit?: (formData: ThemeFormData) => void;
  onCancel?: () => void;
  currentFolderId?: string;
  userId?: string;
}

interface ThemeFormData {
  priority: string;
  area: string;
  position: string;
  files: File[];
  uploadedFiles: { id: string; name: string }[];
  tags: string[];  
  currentTag: string;  
  aiModel: string;
  suggestInHelpDesk: boolean;
}

export const ThemeForm: React.FC<ThemeFormProps> = ({
  onSubmit,
  onCancel,
  currentFolderId = "68acb06886d455d16cceef05",
  userId = "68adc29785d92b4c84e01c5b"
}) => {

  const [areas, setAreas] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState<ThemeFormData>({
    priority: '',
    area: '',
    position: '',
    files: [],
    uploadedFiles: [],
    tags: [],  
    currentTag: '',  
    aiModel: '',
    suggestInHelpDesk: false
  });

  const [errors, setErrors] = useState({
    priority: '',
    area: '',
    position: '',
    tags: ''
  });

  // Funciones para manejar tags:
  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
      
      // Limpiar error si había
      if (errors.tags) {
        setErrors(prev => ({
          ...prev,
          tags: ''
        }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

    // Función de validación
    const validateForm = () => {
    const newErrors = {
      priority: '',
      area: '',
      position: '',
      tags: ''
    };

    if (!formData.priority || formData.priority === '') {
      newErrors.priority = 'La prioridad es obligatoria';
    }

    if (!formData.area || formData.area === '') {
      newErrors.area = 'El área es obligatoria';
    }

    if (!formData.position || formData.position === '') {
      newErrors.position = 'El puesto es obligatorio';
    }

    // ✅ CAMBIAR validación de tags:
    if (formData.tags.length === 0) {
      newErrors.tags = 'Debe agregar al menos un tag';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  // Cargar datos iniciales
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

  // Obtener icono según el tipo de archivo
  const getFileIcon = (file: File) => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
    if (name.includes('.zip') || name.includes('.rar') || name.includes('.7z')) return Archive;
    return File;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Manejar selección de archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar archivos
    const maxSize = 10 * 1024 * 1024; // 10MB por archivo
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setUploadError(`Archivos demasiado grandes (máx 10MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    try {
      setUploadingFiles(true);
      setUploadError('');

      console.log('📁 Subiendo archivos para tema...');
      console.log('Carpeta:', currentFolderId);
      console.log('Usuario:', userId);
      console.log('Archivos:', files.length);

      // Subir archivos usando uploadArchivosParaTema
      const response = await archivoService.uploadArchivosParaTema(
        files,
        currentFolderId,
        userId
      );

      console.log('✅ Respuesta del servidor:', response);

      // Agregar archivos subidos al estado
      if (response.array_file) {
        const newUploadedFiles = response.array_file.map(([id, name]) => ({
          id,
          name
        }));

        setFormData(prev => ({
          ...prev,
          uploadedFiles: [...prev.uploadedFiles, ...newUploadedFiles],
          files: [] // Limpiar archivos seleccionados
        }));
      }

      // Limpiar input
      event.target.value = '';

    } catch (error) {
      console.error('❌ Error subiendo archivos:', error);
      setUploadError('Error al subir archivos. Inténtalo de nuevo.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Eliminar archivo subido
  const removeUploadedFile = async (fileId: string) => {
    try {
      // Eliminar archivo del servidor
      await archivoService.deleteArchivoById(fileId);
      
      // Eliminar del estado local
      setFormData(prev => ({
        ...prev,
        uploadedFiles: prev.uploadedFiles.filter(file => file.id !== fileId)
      }));

      console.log('🗑️ Archivo eliminado:', fileId);
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
    }
  };

  const handleInputChange = (field: keyof ThemeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChangeWithValidation = (field: keyof ThemeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

const handleSubmit = () => {
  if (validateForm()) {
    const formDataWithFiles = {
      ...formData,
      fileIds: formData.uploadedFiles.map(file => file.id),
      // ✅ ASEGURAR que tags sea un array simple
      tags: formData.tags // No modificar aquí
    };
    
    console.log('🏷️ Tags que se envían:', formData.tags); // Para debug
    onSubmit?.(formDataWithFiles);
  }
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
          
          {/* Área de upload */}
          <div className={styles.fileUploadArea}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="fileInput"
              disabled={uploadingFiles}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z"
            />
            <label 
              htmlFor="fileInput" 
              style={{ 
                cursor: uploadingFiles ? 'not-allowed' : 'pointer', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                opacity: uploadingFiles ? 0.5 : 1 
              }}
            >
              <div className={styles.uploadIcon}>
                <Upload size={48} />
              </div>
              <p className={styles.uploadText}>
                {uploadingFiles 
                  ? 'Subiendo archivos...' 
                  : formData.uploadedFiles.length > 0 
                    ? `${formData.uploadedFiles.length} archivo(s) adjunto(s)`
                    : 'Cargar archivos'
                }
              </p>
            </label>
          </div>

          {/* Lista de archivos subidos */}
          {formData.uploadedFiles.length > 0 && (
            <div style={{ 
              marginTop: '0.75rem',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              <h4 style={{ 
                color: 'white', 
                fontSize: '0.75rem', 
                marginBottom: '0.5rem',
                margin: 0,
                paddingBottom: '0.5rem'
              }}>
                Archivos adjuntos ({formData.uploadedFiles.length})
              </h4>
              {formData.uploadedFiles.map((file) => (
                <div key={file.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#27293d',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem'
                }}>
                  <FileText size={16} color="#6262bf" />
                  <span style={{ 
                    flex: 1,
                    color: 'white', 
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeUploadedFile(file.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error de upload */}
          {uploadError && (
            <div style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0.25rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Tags <span className={styles.formHelperText}></span>
        </label>
        
        {/* Input para agregar tags */}
        <div className={`${styles.tagInputContainer} ${errors.tags ? styles.tagInputError : ''}`}>
          <input
            type="text"
            className={styles.tagInput}
            value={formData.currentTag}
            onChange={(e) => handleInputChange('currentTag', e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            onBlur={() => {
              if (formData.currentTag.trim()) {
                addTag();
              }
            }}
            placeholder="Escribe un tag y presiona Enter..."
            disabled={formData.tags.length >= 10} // Límite de 10 tags
          />
          
         
        </div>
        
        {/* Mostrar tags agregados */}
        {formData.tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <span key={index} className={styles.tagChip}>
                {tag}
                <button
                  type="button"
                  className={styles.removeTagButton}
                  onClick={() => removeTag(tag)}
                  title="Eliminar tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Información adicional */}
        <div className={styles.tagInfo}>
          <span className={styles.tagCount}>
            {formData.tags.length}/10 tags
          </span>
          {formData.tags.length >= 10 && (
            <span className={styles.tagLimit}>Límite alcanzado</span>
          )}
        </div>
        
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
          disabled={uploadingFiles}
          style={{
            opacity: uploadingFiles ? 0.5 : 1,
            cursor: uploadingFiles ? 'not-allowed' : 'pointer'
          }}
        >
          {uploadingFiles ? 'SUBIENDO...' : 'CREAR'}
        </button>
      </form>
    </div>
  );
};

export default ThemeForm;