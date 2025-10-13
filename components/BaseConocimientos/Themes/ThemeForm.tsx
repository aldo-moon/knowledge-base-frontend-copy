// components/BaseConocimientos/Themes/ThemeForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, FileImage, FileText, FileVideo, Music, Archive, File, Check, ChevronDown, Loader  } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { areaService } from '../../../services/areaService';
import { puestoService } from '../../../services/puestoService';
import { archivoService } from '../../../services/archivoService';
import { modeloIAService } from '../../../services/modeloIAService';
import { seccionService } from '../../../services/seccionService';

interface ThemeFormProps {
  onSubmit?: (formData: ThemeFormData) => void; 
  onCancel?: () => void;
  currentFolderId?: string;
  userId?: string;
  isEditMode?: boolean;
  themeToEdit?: any;
}

interface ThemeFormData {
  priority: string;
  area: string[];
  position: string[];  
  files: globalThis.File[];
  uploadedFiles: { id: string; name: string }[];
  tags: string[];  
  currentTag: string;
  aiModel: string[];  
  aiSection: string[];
  suggestInHelpDesk: boolean;
  isDraft?: boolean;
}

interface Area {
  _id: string;
  area_id: string;
  nombre: string;
  // ... otras propiedades que pueda tener el área
}

interface PuestoData {
  _id: string;
  puesto_id: string;
  nombre: string;
  total_usuarios: number;
}

interface PuestosResponse {
  nombre_area: string;
  data: PuestoData[];
}

interface ModeloIA {
  _id: string;
  nombre: string;
  url_ai: string;
}

interface Seccion {
  _id: string;
  nombre: string;
  descripcion: string;
  modelo_id: string[];
  status: boolean;
}

interface SeccionesAgrupadas {
  [modeloId: string]: {
    modeloNombre: string;
    secciones: Seccion[];
  };
}

// ✅ Define la interfaz para Puesto también
interface Puesto {
  _id: string;
  puesto_id: string;
  nombre: string;
  total_usuarios?: number;
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
  currentFolderId,
  userId = "68adc29785d92b4c84e01c5b",
  isEditMode = false,
  themeToEdit = null
}) => {

  const [areas, setAreas] = useState<Area[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadError, setUploadError] = useState('');
  const [puestosPorAreas, setPuestosPorAreas] = useState<PuestosPorArea[]>([]);
  const [loadingPuestos, setLoadingPuestos] = useState(false);
  const [isAreasDropdownOpen, setIsAreasDropdownOpen] = useState(false);
  const [isPuestosDropdownOpen, setIsPuestosDropdownOpen] = useState(false);
const [dragCounter, setDragCounter] = useState(0); // 👈 CAMBIAR

  const [modelosIA, setModelosIA] = useState<ModeloIA[]>([]);
const [secciones, setSecciones] = useState<Seccion[]>([]);
const [seccionesFiltradas, setSeccionesFiltradas] = useState<Seccion[]>([]);
const [loadingModelos, setLoadingModelos] = useState(false);
const [loadingSecciones, setLoadingSecciones] = useState(false);
const [isModelosDropdownOpen, setIsModelosDropdownOpen] = useState(false);
const [isSeccionesDropdownOpen, setIsSeccionesDropdownOpen] = useState(false);
const modelosDropdownRef = useRef<HTMLDivElement>(null);
const seccionesDropdownRef = useRef<HTMLDivElement>(null);
const [seccionesAgrupadas, setSeccionesAgrupadas] = useState<SeccionesAgrupadas>({});

  const [selectedAllAreas, setSelectedAllAreas] = useState<string[]>([]); // Areas donde se seleccionó "Todos"
  const isAllAreaSelected = (areaPuestos: PuestosResponse): boolean => {
  return selectedAllAreas.includes(areaPuestos.nombre_area);
};
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
  area: isEditMode ? (Array.isArray(themeToEdit?.area_id) ? themeToEdit.area_id : [themeToEdit?.area_id || '']) : [],
  position: isEditMode ? (Array.isArray(themeToEdit?.puesto_id) ? themeToEdit.puesto_id : [themeToEdit?.puesto_id || '']) : [],
  files: [],
  uploadedFiles: [],
  tags: isEditMode ? (themeToEdit?.keywords || []) : [],
  currentTag: '',
  aiModel: [], // ✅ Array vacío
  aiSection: [],// ✅ Agregar este campo que faltaba
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

const handleAreaToggle = async (areaId: string) => {
  const newAreas = formData.area.includes(areaId)
    ? formData.area.filter(id => id !== areaId)
    : [...formData.area, areaId];

  // ✅ CAMBIO: Solo filtrar puestos que no pertenecen a las áreas seleccionadas
  let filteredPositions = formData.position;
  
  // Si estamos removiendo un área, filtrar sus puestos
  if (formData.area.includes(areaId) && !newAreas.includes(areaId)) {
    console.log('🔍 Removiendo área, filtrando puestos...');
    
    // Obtener puestos de todas las áreas restantes para saber cuáles conservar
    try {
      if (newAreas.length > 0) {
        const puestosDeAreasRestantes: PuestosResponse[] = await puestoService.getPuestosByAreas(newAreas);
        const puestosValidosIds = puestosDeAreasRestantes.flatMap((area: PuestosResponse) => 
          area.data.map((puesto: PuestoData) => puesto.puesto_id)
        );
        
        // Solo conservar puestos que pertenecen a las áreas que quedan
        filteredPositions = formData.position.filter((positionId: string) => 
          puestosValidosIds.includes(positionId)
        );
        
        console.log('🔍 Puestos después de filtrar:', filteredPositions);
      } else {
        // Si no quedan áreas, limpiar todos los puestos
        filteredPositions = [];
      }
    } catch (error) {
      console.error('Error filtrando puestos:', error);
      // En caso de error, mantener puestos actuales
    }
  }

  setFormData(prev => ({ 
    ...prev, 
    area: newAreas, 
    position: filteredPositions // ✅ Solo usar puestos filtrados, no array vacío
  }));
  
  if (errors.area) {
    setErrors(prev => ({ ...prev, area: '' }));
  }

  await loadPuestosByAreas(newAreas);
};

const handleAllAreaToggle = (areaPuestos: PuestosResponse) => {
  const areaName = areaPuestos.nombre_area;
  const allPuestosIds = areaPuestos.data.map(puesto => puesto.puesto_id);
  
  if (selectedAllAreas.includes(areaName)) {
    // Si ya está seleccionado "Todos", deseleccionar
    setSelectedAllAreas(prev => prev.filter(area => area !== areaName));
    
    // Quitar todos los puestos de esta área de la selección
    setFormData(prev => ({
      ...prev,
      position: prev.position.filter(positionId => 
        !allPuestosIds.includes(positionId)
      )
    }));
    
  } else {
    // Seleccionar "Todos" para esta área
    setSelectedAllAreas(prev => [...prev, areaName]);
    
    // Agregar todos los puestos de esta área (sin duplicados)
    setFormData(prev => {
      const newPositions = [...prev.position];
      allPuestosIds.forEach(id => {
        if (!newPositions.includes(id)) {
          newPositions.push(id);
        }
      });
      return { ...prev, position: newPositions };
    });
  }
  
  if (errors.position) {
    setErrors(prev => ({ ...prev, position: '' }));
  }
};


const handlePositionToggle = (positionId: string) => {
  // Encontrar a qué área pertenece este puesto
  const areaOfPuesto = puestosPorAreas.find(area => 
    area.data.some(puesto => puesto.puesto_id === positionId)
  );
  
  if (areaOfPuesto && selectedAllAreas.includes(areaOfPuesto.nombre_area)) {
    // Si se está deseleccionando un puesto individual de un área con "Todos" seleccionado,
    // quitar "Todos" de esa área
    setSelectedAllAreas(prev => prev.filter(area => area !== areaOfPuesto.nombre_area));
  }
  
  const newPositions = formData.position.includes(positionId)
    ? formData.position.filter(id => id !== positionId)
    : [...formData.position, positionId];

  setFormData(prev => ({ ...prev, position: newPositions }));
  
  if (errors.position) {
    setErrors(prev => ({ ...prev, position: '' }));
  }
};



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

  useEffect(() => {
    const loadPuestosForEditMode = async () => {
      if (isEditMode && formData.area.length > 0) {
        console.log('🔍 Modo edición: cargando puestos para áreas:', formData.area);
        await loadPuestosByAreas(formData.area);
      }
    };

    // Solo ejecutar después de que se hayan cargado las áreas iniciales
    if (!loadingData && areas.length > 0) {
      loadPuestosForEditMode();
    }
  }, [loadingData, areas.length, isEditMode]); // Dependencias: cuando termine de cargar áreas y estemos en modo edición

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
  
  await processFiles(files);
  event.target.value = '';
};

const handleSubmitWithDraft = async (isDraft: boolean) => {
  if (!validateForm()) {
    return;
  }

  // ✅ Incluir fileIds de los archivos subidos
  const formDataWithDraft = {
    ...formData,
    isDraft,
    fileIds: formData.uploadedFiles.map(file => file.id) // ✅ Agregar los IDs de los archivos
  };

  console.log('📎 Archivos a guardar:', formDataWithDraft.fileIds);
  console.log('📋 FormData completo:', formDataWithDraft);

  if (onSubmit) {
    onSubmit(formDataWithDraft);
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

/* const handleSubmit = () => {
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
}; */



// Agregar este useEffect para cargar los modelos IA al montar el componente:
useEffect(() => {
  const loadModelosIA = async () => {
    try {
      setLoadingModelos(true);
      const response = await modeloIAService.getAllModeloIA();
      setModelosIA(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar modelos IA:', error);
    } finally {
      setLoadingModelos(false);
    }
  };

  loadModelosIA();
}, []);

// Agregar este useEffect para cargar todas las secciones:
useEffect(() => {
  const loadSecciones = async () => {
    try {
      setLoadingSecciones(true);
      const response = await seccionService.getAllSeccion();
      setSecciones(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    } finally {
      setLoadingSecciones(false);
    }
  };

  loadSecciones();
}, []);

// Agregar este useEffect para filtrar secciones cuando se selecciona un modelo:
useEffect(() => {
  if (formData.aiModel.length > 0) {
    // Agrupar secciones por modelo
    const agrupadas: SeccionesAgrupadas = {};
    
    formData.aiModel.forEach(modeloId => {
      const modelo = modelosIA.find(m => m._id === modeloId);
      if (modelo) {
        const seccionesDelModelo = secciones.filter(seccion => 
          seccion.status && 
          seccion.modelo_id.includes(modeloId)
        );
        
        if (seccionesDelModelo.length > 0) {
          agrupadas[modeloId] = {
            modeloNombre: modelo.nombre,
            secciones: seccionesDelModelo
          };
        }
      }
    });
    
    setSeccionesAgrupadas(agrupadas);
    
    // Limpiar secciones seleccionadas que ya no son válidas
    const seccionesValidas = Object.values(agrupadas)
      .flatMap(grupo => grupo.secciones.map(s => s._id));
    
    setFormData(prev => ({
      ...prev,
      aiSection: prev.aiSection.filter(id => seccionesValidas.includes(id))
    }));
  } else {
    setSeccionesAgrupadas({});
    setFormData(prev => ({ ...prev, aiSection: [] }));
  }
}, [formData.aiModel, secciones, modelosIA]);



// ✅ AGREGAR funciones para manejar selección de modelos:
const handleModeloToggle = (modeloId: string) => {
  setFormData(prev => ({
    ...prev,
    aiModel: prev.aiModel.includes(modeloId)
      ? prev.aiModel.filter(id => id !== modeloId)
      : [...prev.aiModel, modeloId]
  }));
};

const handleSelectAllModelos = () => {
  if (formData.aiModel.length === modelosIA.length) {
    setFormData(prev => ({ ...prev, aiModel: [] }));
  } else {
    setFormData(prev => ({ ...prev, aiModel: modelosIA.map(m => m._id) }));
  }
};

// ✅ AGREGAR funciones para manejar selección de secciones:
const handleSeccionToggle = (seccionId: string) => {
  setFormData(prev => ({
    ...prev,
    aiSection: prev.aiSection.includes(seccionId)
      ? prev.aiSection.filter(id => id !== seccionId)
      : [...prev.aiSection, seccionId]
  }));
};

const handleSelectAllSeccionesDelModelo = (modeloId: string) => {
  const seccionesDelModelo = seccionesAgrupadas[modeloId]?.secciones.map(s => s._id) || [];
  const todasSeleccionadas = seccionesDelModelo.every(id => formData.aiSection.includes(id));
  
  if (todasSeleccionadas) {
    // Deseleccionar todas
    setFormData(prev => ({
      ...prev,
      aiSection: prev.aiSection.filter(id => !seccionesDelModelo.includes(id))
    }));
  } else {
    // Seleccionar todas
      const nuevasSelecciones = Array.from(new Set([...formData.aiSection, ...seccionesDelModelo]));    setFormData(prev => ({
      ...prev,
      aiSection: nuevasSelecciones
    }));
  }
};

// ✅ AGREGAR useEffect para cerrar dropdowns al hacer clic fuera:
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (modelosDropdownRef.current && !modelosDropdownRef.current.contains(event.target as Node)) {
      setIsModelosDropdownOpen(false);
    }
    if (seccionesDropdownRef.current && !seccionesDropdownRef.current.contains(event.target as Node)) {
      setIsSeccionesDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


// Prevenir comportamiento por defecto
// Cambiar el estado isDragging por un contador

// Modificar las funciones de drag:
const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  if (!uploadingFiles) {
    setDragCounter(prev => prev + 1);
  }
};

const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setDragCounter(prev => prev - 1);
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setDragCounter(0); // 👈 RESETEAR el contador

  if (uploadingFiles) return;

  const files = Array.from(e.dataTransfer.files);
  if (files.length === 0) return;

  await processFiles(files);
};

// Función auxiliar para procesar archivos (refactorizar handleFileUpload)
const processFiles = async (files: File[]) => {
  const maxSize = 500 * 1024 * 1024;
  const oversizedFiles = files.filter(file => file.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    setUploadError(`Archivos demasiado grandes (máx 500MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
    return;
  }

  try {
    setUploadingFiles(true);
    setUploadProgress(0);
    setUploadError('');

    const folderIdToUse = isEditMode && themeToEdit?.folder_id ? themeToEdit.folder_id : currentFolderId;

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    const response = await archivoService.uploadArchivosParaTema(
      files,
      folderIdToUse,
      userId
    );

    clearInterval(progressInterval);
    setUploadProgress(100);

    if (response.array_file) {
      const newUploadedFiles = response.array_file.map(([id, name]: [string, string]) => ({
        id,
        name
      }));

      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newUploadedFiles],
        files: []
      }));
    }

  } catch (error) {
    console.error('❌ Error subiendo archivos:', error);
    setUploadError('Error al subir archivos. Inténtalo de nuevo.');
  } finally {
    setUploadingFiles(false);
    setUploadProgress(0);
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
              className={`${styles.formSelect} ${styles.multiSelectTrigger} ${errors.area ? styles.formSelectError : ''}`}
              onClick={() => setIsAreasDropdownOpen(!isAreasDropdownOpen)}
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
              <div className={`${styles.formSelect} ${styles.dropdownScroll}`}>
                {loadingData ? (
                  <div className={styles.loadingState}>Cargando...</div>
                ) : (
                  areas.map((area) => (
                    <div 
                      key={area._id} 
                      className={`${styles.areaItem} ${formData.area.includes(area.area_id) ? styles.selected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAreaToggle(area.area_id);
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
              className={`${styles.formSelect} ${styles.multiSelectTrigger} ${errors.position ? styles.formSelectError : ''}`}
              onClick={() => setIsPuestosDropdownOpen(!isPuestosDropdownOpen)}
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
              <div className={`${styles.formSelect} ${styles.dropdownScroll}`}>
                {loadingPuestos ? (
                  <div className={styles.loadingState}>Cargando...</div>
                ) : puestosPorAreas.length === 0 ? (
                  <div className={styles.emptyDropdownState}>
                    Selecciona áreas para ver puestos disponibles
                  </div>
                ) : (
                  puestosPorAreas.map((areaPuestos) => (
                    <div key={areaPuestos.nombre_area}>
                      {/* Header del área */}
                      <div className={styles.areaGroupHeader}>
                        {areaPuestos.nombre_area}
                      </div>
                      
                      {/* Opción "Todos los puestos" */}
                      <div 
                        className={`${styles.allPuestosOption} ${isAllAreaSelected(areaPuestos) ? styles.selected : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAllAreaToggle(areaPuestos);
                        }}
                      >
                        <span>Todos los puestos</span>
                        {isAllAreaSelected(areaPuestos) && <Check size={16} />}
                      </div>
                      
                      {/* Puestos individuales */}
                      {areaPuestos.data.map((puesto) => (
                        <div 
                          key={puesto._id}
                          className={`${styles.puestoItem} ${formData.position.includes(puesto.puesto_id) ? styles.selected : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePositionToggle(puesto.puesto_id);
                          }}
                        >
                          <span>{puesto.nombre}</span>
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
          <div 
            className={`${styles.fileUploadArea} ${dragCounter > 0 ? styles.dragging : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
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
                opacity: uploadingFiles ? 0.5 : 1,
                pointerEvents: uploadingFiles ? 'none' : 'auto'
              }}
            >
              <div className={styles.uploadIcon}>
                {uploadingFiles ? (
                  <Loader size={48} className={styles.spinningIcon} />
                ) : (
                  <Upload size={48} />
                )}
              </div>
              <p className={styles.uploadText}>
                {uploadingFiles 
                  ? `Subiendo archivos... ${uploadProgress}%`
                  : dragCounter > 0
                    ? '¡Suelta los archivos aquí!'
                    : formData.uploadedFiles.length > 0 
                      ? `${formData.uploadedFiles.length} archivo(s) adjunto(s)`
                      : 'Arrastra archivos aquí o haz clic para seleccionar'
                }
              </p>
              {uploadingFiles && (
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
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

        {/* Modelos IA - Selección Múltiple */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <u>Alimentar IA</u>
          </label>
          <div ref={modelosDropdownRef} style={{ position: 'relative' }}>
            <div 
              className={`${styles.formSelect} ${styles.multiSelectTrigger}`}
              onClick={() => setIsModelosDropdownOpen(!isModelosDropdownOpen)}
            >
              <span>
                {loadingModelos 
                  ? 'Cargando modelos...'
                  : formData.aiModel.length === 0 
                    ? 'Seleccionar modelos de IA'
                    : `${formData.aiModel.length} modelo${formData.aiModel.length !== 1 ? 's' : ''} seleccionado${formData.aiModel.length !== 1 ? 's' : ''}`
                }
              </span>
              <ChevronDown size={16} style={{ 
                transform: isModelosDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} />
            </div>

            {isModelosDropdownOpen && !loadingModelos && (
              <div className={styles.multiSelectDropdown}>
                {/* Opción "Seleccionar todos" */}
                <div
                  className={`${styles.selectAllOption} ${formData.aiModel.length === modelosIA.length ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAllModelos();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.aiModel.length === modelosIA.length}
                    onChange={() => {}}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Seleccionar todos
                </div>

                {modelosIA.map((modelo) => (
                  <div
                    key={modelo._id}
                    className={`${styles.dropdownItem} ${formData.aiModel.includes(modelo._id) ? styles.selected : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModeloToggle(modelo._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.aiModel.includes(modelo._id)}
                      onChange={() => {}}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span>{modelo.nombre}</span>
                    {formData.aiModel.includes(modelo._id) && <Check size={16} style={{ marginLeft: 'auto', color: '#10b981' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Secciones - Solo se muestra si hay modelos seleccionados */}
        {formData.aiModel.length > 0 && Object.keys(seccionesAgrupadas).length > 0 && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Secciones
            </label>
            <div ref={seccionesDropdownRef} style={{ position: 'relative' }}>
              <div 
                className={styles.formSelect}
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => setIsSeccionesDropdownOpen(!isSeccionesDropdownOpen)}
              >
                <span>
                  {formData.aiSection.length === 0 
                    ? 'Seleccionar secciones'
                    : `${formData.aiSection.length} sección${formData.aiSection.length !== 1 ? 'es' : ''} seleccionada${formData.aiSection.length !== 1 ? 's' : ''}`
                  }
                </span>
                <ChevronDown size={16} style={{ 
                  transform: isSeccionesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </div>

              {isSeccionesDropdownOpen && (
                <div className={`${styles.multiSelectDropdown} ${styles.multiSelectDropdownSections}`}>
                  {Object.entries(seccionesAgrupadas).map(([modeloId, grupo]) => (
                    <div key={modeloId} className={styles.sectionGroup}>
                      {/* Header del grupo con nombre del modelo */}
                      <div
                        className={styles.groupHeader}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAllSeccionesDelModelo(modeloId);
                        }}
                      >
                        <span> {grupo.modeloNombre}</span>
                        <span className={styles.groupCounter}>
                          ({grupo.secciones.filter(s => formData.aiSection.includes(s._id)).length}/{grupo.secciones.length})
                        </span>
                      </div>

                      {/* Secciones del modelo */}
                      {grupo.secciones.map((seccion) => (
                        <div
                          key={seccion._id}
                          className={`${styles.sectionItem} ${formData.aiSection.includes(seccion._id) ? styles.selected : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeccionToggle(seccion._id);
                          }}
                        >
                          <div className={styles.sectionContent}>
                            <input
                              type="checkbox"
                              checked={formData.aiSection.includes(seccion._id)}
                              onChange={() => {}}
                            />
                            <span style={{ fontWeight: 500 }}>{seccion.nombre}</span>
                            {formData.aiSection.includes(seccion._id) && (
                              <Check size={14} style={{ marginLeft: 'auto', color: '#10b981' }} />
                            )}
                          </div>
                          {seccion.descripcion && (
                            <span className={styles.sectionDescription}>
                              {seccion.descripcion}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Botones - diferentes según el modo */}
        <div className={styles.formActions} style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexDirection: "column"  }}>
          
        {isEditMode ? (
          // MODO EDICIÓN
          <>
            <button
              type="button"
              onClick={() => handleSubmitWithDraft(themeToEdit?.is_draft ?? false)}
              disabled={uploadingFiles}
              className={styles.createButton}
            >
              {uploadingFiles ? 'Guardando...' : 'Guardar cambios'}
            </button>
            
            {/* Mostrar botón Publicar solo si es borrador */}
            {themeToEdit?.is_draft && (
              <button
                type="button"
                onClick={() => handleSubmitWithDraft(false)}
                disabled={uploadingFiles}
                className={styles.createButton}
                style={{ backgroundColor: '#10b981' }}
              >
                {uploadingFiles ? 'Publicando...' : 'Publicar Tema'}
              </button>
            )}
          </>
        ) : (
          // MODO CREACIÓN: Dos botones (Borrador y Publicar)
          <>
            <button
              type="button"
              onClick={() => handleSubmitWithDraft(true)}
              disabled={uploadingFiles}
              className={styles.createButton}
              style={{ backgroundColor: '#6b7280' }}
            >
              {uploadingFiles ? 'Subiendo...' : 'Crear Borrador'}
            </button>
            
            <button
              type="button"
              onClick={() => handleSubmitWithDraft(false)}
              disabled={uploadingFiles}
              className={styles.createButton}
              style={{ backgroundColor: '#2563eb' }}
            >
              {uploadingFiles ? 'Subiendo...' : 'Publicar Tema'}
            </button>
          </>
        )}
        </div>
      </form>
    </div>
  );
};

export default ThemeForm;