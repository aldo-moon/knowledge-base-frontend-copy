// components/BaseConocimientos/Modals/MultimediaModal.jsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, FileText, FileVideo, Music, Archive, File } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';
import { archivoService } from '../../../services/archivoService';

interface MultimediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => Promise<void>;
  currentFolderId: string;
  userId: string;
}

const MultimediaModal: React.FC<MultimediaModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentFolderId,
  userId
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Limpiar estado al cerrar
  const handleClose = () => {
    setSelectedFiles([]);
    setError('');
    setUploadProgress({});
    setIsUploading(false);
    onClose();
  };

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

  // Validar archivos
  const validateFiles = (files: File[]) => {
    const maxSize = 50 * 1024 * 1024; // 50MB por archivo
    const maxTotal = 200 * 1024 * 1024; // 200MB total
    
    // Validar tamaño individual
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      return `Archivos demasiado grandes (máx 50MB): ${oversizedFiles.map(f => f.name).join(', ')}`;
    }

    // Validar tamaño total
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotal) {
      return `El tamaño total excede 200MB (actual: ${formatFileSize(totalSize)})`;
    }

    return null;
  };

  // Manejar selección de archivos
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validationError = validateFiles(fileArray);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  // Manejar clic en área de upload
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Eliminar archivo de la lista
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Subir archivos
  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) {
      setError('Selecciona al menos un archivo');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      // Simular progreso de subida
      selectedFiles.forEach((file, index) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min(progress, 100)
          }));
        }, 200);
      });

      // Convertir array a FileList-like object
      const fileListLike = {
        length: selectedFiles.length,
        ...selectedFiles
      } as FileList;

      // Llamar función de upload del padre (que ya maneja el servicio)
      await onUpload(fileListLike);

      console.log('✅ Archivos subidos exitosamente');
      
      // Pequeño delay para mostrar progreso completo
      setTimeout(() => {
        handleClose();
      }, 1000);

    } catch (error) {
      console.error('❌ Error subiendo archivos:', error);
      setError('Error al subir archivos. Inténtalo de nuevo.');
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.multimediaModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.multimediaModalHeader}>
          <h3 className={styles.multimediaModalTitle}>Subir multimedia</h3>
          
        </div>
        
        <div className={styles.multimediaModalBody}>
          {/* Área de upload */}
          <div 
            className={`${styles.multimediaUploadArea} ${isDragOver ? styles.dragOver : ''}`}
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderColor: isDragOver ? '#7373c4' : '#6262bf',
              backgroundColor: isDragOver ? 'rgba(98, 98, 191, 0.1)' : '#1e1e2f'
            }}
          >
            <div className={styles.multimediaUploadIcon}>
              <Upload size={48} />
            </div>
            <p className={styles.multimediaUploadText}>
              {isDragOver ? 'Suelta los archivos aquí' : 'Cargar archivos o arrastra aquí'}
            </p>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.75rem', 
              margin: '0.5rem 0 0 0' 
            }}>
              Máx 50MB por archivo, 200MB total
            </p>
          </div>

          {/* Input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            style={{ display: 'none' }}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z"
          />

          {/* Lista de archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div style={{ 
              marginTop: '1rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <h4 style={{ 
                color: 'white', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem' 
              }}>
                Archivos seleccionados ({selectedFiles.length})
              </h4>
              {selectedFiles.map((file, index) => {
                const IconComponent = getFileIcon(file);
                const progress = uploadProgress[file.name] || 0;
                
                return (
                  <div key={`${file.name}-${index}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    backgroundColor: '#27293d',
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <IconComponent size={20} color="#6262bf" />
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        color: 'white', 
                        fontSize: '0.75rem', 
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {file.name}
                      </p>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '0.625rem', 
                        margin: 0 
                      }}>
                        {formatFileSize(file.size)}
                      </p>
                      {isUploading && progress > 0 && (
                        <div style={{
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#3b3f5f',
                          borderRadius: '1px',
                          marginTop: '0.25rem',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            backgroundColor: progress === 100 ? '#10b981' : '#6262bf',
                            width: `${progress}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      )}
                    </div>
                    {!isUploading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0.25rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}
        </div>
        
        <div className={styles.multimediaModalFooter}>
          <button 
            className={styles.multimediaSubirButton}
            onClick={handleUploadClick}
            disabled={isUploading || selectedFiles.length === 0}
            style={{
              opacity: isUploading || selectedFiles.length === 0 ? 0.5 : 1,
              cursor: isUploading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? 'SUBIENDO...' : `SUBIR ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultimediaModal;