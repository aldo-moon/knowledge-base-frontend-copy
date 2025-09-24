// components/BaseConocimientos/Themes/ThemeForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, FileImage, FileText, FileVideo, Music, Archive, File, Check, ChevronDown } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { areaService } from '../../../services/areaService';
import { puestoService } from '../../../services/puestoService';
import { archivoService } from '../../../services/archivoService';

interface ThemeFormProps {
  onSubmit?: (formData: ThemeFormData) => void;
  onCancel?: () => void;
  currentFolderId?: string;
  userId?: string;
  isEditMode?: boolean;
  themeToEdit?: any;}

interface ThemeFormData {
  priority: string;
  area: string[];        // ← CAMBIO: de 'area' a 'areas' (array)
  position: string[];  
  files: globalThis.File[]; // Archivos nativos del navegador para upload
  uploadedFiles: { id: string; name: string }[];
  tags: string[];  
  currentTag: string;  
  aiModel: string;
  suggestInHelpDesk: boolean;
}

interface Area {
  _id: string;
  area_id: string;
  nombre: string;
  // ... otras propiedades que pueda tener el área
}

// ✅ Define la interfaz para Puesto también
interface Puesto {
  _id: string;
  puesto_id: string;
  nombre: string;
  total_usuarios?: number;
  // ... otras propiedades
}

interface PuestosPorArea {
  nombre_area: string;
  data: {
    _id: string;
    puesto_id: string;
    nombre: string;
    total_usuarios: number;
  }[];
}

export const ThemeForm: React.FC<ThemeFormProps> = ({
  onSubmit,
  onCancel,
  currentFolderId = "68acb06886d455d16cceef05",
  userId = "68adc29785d92b4c84e01c5b",
  isEditMode = false,
  themeToEdit = null
}) => {

  const [areas, setAreas] = useState<Area[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [puestosPorAreas, setPuestosPorAreas] = useState<PuestosPorArea[]>([]);
  const [loadingPuestos, setLoadingPuestos] = useState(false);
  const [isAreasDropdownOpen, setIsAreasDropdownOpen] = useState(false);
  const [isPuestosDropdownOpen, setIsPuestosDropdownOpen] = useState(false);
const areasDropdownRef = useRef<HTMLDivElement>(null);
const puestosDropdownRef = useRef<HTMLDivElement>(null);
  // ✅ FUNCIÓN HELPER PARA CONVERTIR PRIORIDAD
  const getPriorityText = (priority?: number | string) => {
    const priorityNum = typeof priority === 'string' ? parseInt(priority) : priority;
    switch (priorityNum) {
      case 2: return 'Alta';
      case 1: return 'Normal';
      case 0: return 'Baja';
      default: return '';
    }
  };

  // ✅ ESTADO INICIAL BASADO EN MODO EDICIÓN:
const [formData, setFormData] = useState<ThemeFormData>({
  priority: isEditMode ? getPriorityText(themeToEdit?.priority) : '',
  area: isEditMode ? (Array.isArray(themeToEdit?.area_id) ? themeToEdit.area_id : [themeToEdit?.area_id || '']) : [], // ← CAMBIO
  position: isEditMode ? (Array.isArray(themeToEdit?.puesto_id) ? themeToEdit.puesto_id : [themeToEdit?.puesto_id || '']) : [], // ← CAMBIO
  files: [],
  uploadedFiles: [],
  tags: isEditMode ? (themeToEdit?.keywords || []) : [],
  currentTag: '',
  aiModel: '',
  suggestInHelpDesk: false
});

const [errors, setErrors] = useState({
  priority: '',
  area: '',      // <- NO areas
  position: '',  // <- NO positions  
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

const loadPuestosByArea = async (areaId: string) => {
  try {
    setPuestos([]); // Limpiar puestos actuales
    setLoadingData(true);
    const puestosData = await puestoService.getPuestosByArea(areaId);
    setPuestos(puestosData);
  } catch (error) {
    console.error('Error loading puestos by area:', error);
  } finally {
    setLoadingData(false);
  }
};

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (areasDropdownRef.current && !areasDropdownRef.current.contains(event.target as Node)) {
      setIsAreasDropdownOpen(false);
    }
    if (puestosDropdownRef.current && !puestosDropdownRef.current.contains(event.target as Node)) {
      setIsPuestosDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

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
  area: '',      // <- CAMBIO: de 'areas' a 'area'
  position: '',  // <- CAMBIO: de 'positions' a 'position'
  tags: ''
};

  if (!formData.priority || formData.priority === '') {
    newErrors.priority = 'La prioridad es obligatoria';
  }

  if (formData.area.length === 0) {
    newErrors.area = 'Debe seleccionar al menos un área';
  }

  if (formData.position.length === 0) {
    newErrors.position = 'Debe seleccionar al menos un puesto';
  }

  if (formData.tags.length === 0) {
    newErrors.tags = 'Debe agregar al menos un tag';
  }

  setErrors(newErrors); 

  return Object.values(newErrors).every(error => error === '');
};


const loadPuestosByAreas = async (selectedAreas: string[]) => {
  if (selectedAreas.length === 0) {
    setPuestosPorAreas([]);
    return;
  }

  try {
    setLoadingPuestos(true);
    const puestosData = await puestoService.getPuestosByAreas(selectedAreas);
    setPuestosPorAreas(puestosData);
  } catch (error) {
    console.error('Error loading puestos by areas:', error);
    setPuestosPorAreas([]);
  } finally {
    setLoadingPuestos(false);
  }
};

// ✅ CAMBIO 7: Funciones para manejar selecciones múltiples
const handleAreaToggle = async (areaId: string) => {
  const newAreas = formData.area.includes(areaId)
    ? formData.area.filter(id => id !== areaId)
    : [...formData.area, areaId];

  setFormData(prev => ({ ...prev, area: newAreas, position: [] })); // <- area y position
  
  if (errors.area) { // <- area
    setErrors(prev => ({ ...prev, area: '' })); // <- area
  }

  await loadPuestosByAreas(newAreas);
};

const handlePositionToggle = (positionId: string) => {
  const newPositions = formData.position.includes(positionId)
    ? formData.position.filter(id => id !== positionId)
    : [...formData.position, positionId];

  setFormData(prev => ({ ...prev, position: newPositions })); // <- position
  
  if (errors.position) { // <- position
    setErrors(prev => ({ ...prev, position: '' })); // <- position
  }
};



// ✅ AGREGAR ESTE useEffect para cargar archivos existentes en modo edición
useEffect(() => {
  if (isEditMode && themeToEdit?.files_attachment_id) {
    const loadExistingFiles = async () => {
      try {
        const existingFiles = await Promise.all(
          themeToEdit.files_attachment_id.map(async (fileId: string) => {
            try {
              const fileData = await archivoService.getArchivoById(fileId);
              return {
                id: fileData._id,
                name: fileData.file_name || 'Archivo sin nombre'
              };
            } catch (error) {
              return {
                id: fileId,
                name: 'Archivo no encontrado'
              };
            }
          })
        );

        setFormData(prev => ({
          ...prev,
          uploadedFiles: existingFiles
        }));

      } catch (error) {
        console.error('Error cargando archivos existentes:', error);
      }
    };

    loadExistingFiles();
  }
}, [isEditMode, themeToEdit]);


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
          const newUploadedFiles = response.array_file.map(([id, name]: [string, string]) => ({
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
  <div ref={areasDropdownRef} style={{ position: 'relative' }}>
    <div 
className={`${styles.formSelect} ${errors.area ? styles.formSelectError : ''}`}
      onClick={() => setIsAreasDropdownOpen(!isAreasDropdownOpen)}
      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <span>
        {formData.area.length === 0 
          ? (loadingData ? 'Cargando...' : 'Seleccionar área')
          : `${formData.area.length} área(s) seleccionada(s)`
        }
      </span>
      <ChevronDown 
        size={16} 
        style={{ 
          transition: 'transform 0.2s',
          transform: isAreasDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
      />
    </div>
    
    {isAreasDropdownOpen && (
      <div className={styles.formSelect} style={{ 
        position: 'absolute', 
        top: 'calc(100% + 4px)', 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {loadingData ? (
          <div style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>Cargando...</div>
        ) : (
          areas.map((area) => (
            <div 
              key={area._id} 
              style={{ 
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: formData.area.includes(area.area_id) ? '#2563eb' : 'transparent',
                color: formData.area.includes(area.area_id) ? 'white' : 'inherit',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleAreaToggle(area.area_id);
              }}
              onMouseEnter={(e) => {
                if (!formData.area.includes(area.area_id)) {
                  e.currentTarget.style.backgroundColor = '#2a2d47';
                }
              }}
              onMouseLeave={(e) => {
                if (!formData.area.includes(area.area_id)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{area.nombre}</span>
              {formData.area.includes(area.area_id) && <Check size={16} />}
            </div>
          ))
        )}
      </div>
    )}
  </div>
{errors.area && <span className={styles.errorMessage}>{errors.area}</span>}
</div>

{/* Puestos */}
<div className={styles.formGroup}>
  <label className={styles.formLabel}>Puestos</label>
  <div ref={puestosDropdownRef} style={{ position: 'relative' }}>
    <div 
className={`${styles.formSelect} ${errors.position ? styles.formSelectError : ''}`}
      onClick={() => setIsPuestosDropdownOpen(!isPuestosDropdownOpen)}
      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <span>
        {formData.position.length === 0 
          ? (loadingPuestos ? 'Cargando...' : 'Seleccionar puesto')
          : `${formData.position.length} puesto(s) seleccionado(s)`
        }
      </span>
      <ChevronDown 
        size={16} 
        style={{ 
          transition: 'transform 0.2s',
          transform: isPuestosDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
      />
    </div>
    
    {isPuestosDropdownOpen && (
      <div className={styles.formSelect} style={{ 
        position: 'absolute', 
        top: 'calc(100% + 4px)', 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {loadingPuestos ? (
          <div style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>Cargando...</div>
        ) : puestosPorAreas.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>Selecciona áreas para ver puestos disponibles</div>
        ) : (
          puestosPorAreas.map((areaPuestos) => (
            <div key={areaPuestos.nombre_area}>
              <div style={{ 
                fontWeight: '600',
                color: '#94a3b8',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderBottom: '1px solid #3b3f5f',
                backgroundColor: '#27293d'
              }}>
                {areaPuestos.nombre_area}
              </div>
              {areaPuestos.data.map((puesto) => (
                <div 
                  key={puesto._id}
                  style={{ 
                    padding: '0.5rem 0.75rem 0.5rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    backgroundColor: formData.position.includes(puesto.puesto_id) ? '#2563eb' : 'transparent',
                    color: formData.position.includes(puesto.puesto_id) ? 'white' : 'inherit',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: '3px solid #3b3f5f'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePositionToggle(puesto.puesto_id);
                  }}
                  onMouseEnter={(e) => {
                    if (!formData.position.includes(puesto.puesto_id)) {
                      e.currentTarget.style.backgroundColor = '#2a2d47';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formData.position.includes(puesto.puesto_id)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span>{puesto.nombre} ({puesto.total_usuarios})</span>
                  {formData.position.includes(puesto.puesto_id) && <Check size={16} />}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    )}
  </div>
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
            <option value="GPT-4">Club Chelero</option>
            <option value="Claude">Alasel</option>
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
          {uploadingFiles ? 'SUBIENDO...' : (isEditMode ? 'ACTUALIZAR' : 'CREAR')}
        </button>
      </form>
    </div>
  );
};

export default ThemeForm;