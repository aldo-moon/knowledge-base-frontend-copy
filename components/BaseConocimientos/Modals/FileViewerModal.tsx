// components/BaseConocimientos/Modals/FileViewerModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, AlertCircle } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';
import { archivoService } from '../../../services/archivoService';
import { QRCodeSVG } from 'qrcode.react'; // ✅ AGREGAR ESTA LÍNEA


interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    _id: string;
    file_name: string;
    type_file?: string;
    s3_path?: string;
    url?: string;
  };
}

export const FileViewer: React.FC<FileViewerProps> = ({ isOpen, onClose, file }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [generatingToken, setGeneratingToken] = useState(false);

 useEffect(() => {
  if (isOpen) {
    setZoom(100);
    setRotation(0);
    setError('');
    
    // Usar s3_path directamente como URL
    const url = file.s3_path || file.url || '';
    console.log('🔗 URL del archivo:', url);
    setFileUrl(url);
    
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen, file]);

  if (!isOpen) return null;

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const getFileType = (fileName: string) => {
    const ext = getFileExtension(fileName);
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      return 'image';
    }
    if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(ext)) {
      return 'audio';
    }
    if (ext === 'pdf') {
      return 'pdf';
    }
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
      return 'office';
    }
    if (['txt', 'csv', 'json', 'xml'].includes(ext)) {
      return 'text';
    }
    return 'unsupported';
  };



  useEffect(() => {
  const generateTokenForVideo = async () => {
    // Solo generar token si es un video
    if (isOpen && file && getFileType(file.file_name) === 'video') {
      try {
        setGeneratingToken(true);
        const tokenData = await archivoService.generateVideoToken();
        setVideoToken(tokenData.token);
        console.log('✅ Token generado para video:', tokenData.token);
      } catch (error) {
        console.error('❌ Error generando token:', error);
      } finally {
        setGeneratingToken(false);
      }
    }
  };

  generateTokenForVideo();
}, [isOpen, file]);


  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderContent = () => {
    const fileType = getFileType(file.file_name);

    if (!fileUrl) {
      return (
        <div className={styles.fileViewerError}>
          <AlertCircle size={48} />
          <p>No se pudo cargar el archivo</p>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className={styles.fileViewerImageContainer}>
            <img
              src={fileUrl}
              alt={file.file_name}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              onError={() => setError('Error al cargar la imagen')}
            />
          </div>
        );

      case 'video':
        return (
          <video
            src={fileUrl}
            controls
            className={styles.fileViewerVideo}
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        );

      case 'audio':
        return (
          <div className={styles.fileViewerAudioContainer}>
            <audio src={fileUrl} controls className={styles.fileViewerAudio}>
              Tu navegador no soporta la reproducción de audio.
            </audio>
            <p className={styles.fileViewerFileName}>{file.file_name}</p>
          </div>
        );

      case 'pdf':
        return (
            <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className={styles.fileViewerIframe}
            title={file.file_name}
            />
        );

      case 'office':
        // Usar Google Docs Viewer para archivos de Office
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className={styles.fileViewerIframe}
            title={file.file_name}
          />
        );

      case 'text':
        return (
          <iframe
            src={fileUrl}
            className={styles.fileViewerIframe}
            title={file.file_name}
            style={{ backgroundColor: 'white' }}
          />
        );

      default:
        return (
          <div className={styles.fileViewerUnsupported}>
            <AlertCircle size={48} />
            <p>Tipo de archivo no soportado para visualización</p>
            <p className={styles.fileViewerHint}>Puedes descargar el archivo para verlo</p>
          </div>
        );
    }
  };

  const fileType = getFileType(file.file_name);
  const showImageControls = fileType === 'image';

  return (
    <div className={styles.fileViewerOverlay} onClick={onClose}>
      <div className={styles.fileViewerModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.fileViewerHeader}>
          <h3 className={styles.fileViewerTitle}>{file.file_name}</h3>
          
          <div className={styles.fileViewerControls}>
            {showImageControls && (
              <>
                <button className={styles.fileViewerButton} onClick={handleZoomOut} title="Alejar" disabled={zoom <= 50}>
                  <ZoomOut size={20} />
                </button>
                <span className={styles.fileViewerZoomLevel}>{zoom}%</span>
                <button className={styles.fileViewerButton} onClick={handleZoomIn} title="Acercar" disabled={zoom >= 200}>
                  <ZoomIn size={20} />
                </button>
                <button className={styles.fileViewerButton} onClick={handleRotate} title="Rotar">
                  <RotateCw size={20} />
                </button>
              </>
            )}

            {/* ✅ MOVER EL BOTÓN QR AQUÍ (antes del botón de cerrar) */}
            {/* Botón para generar QR (solo para videos) */}
            {getFileType(file.file_name) === 'video' && videoToken && (
              <button
                className={styles.fileViewerButton}
                onClick={() => setShowQR(!showQR)}
                disabled={generatingToken}
                title="Generar código QR"
              >
                {generatingToken ? 'Generando...' : showQR ? 'Ocultar QR' : 'Generar QR'}
              </button>
            )}
                        
            <button
              className={styles.fileViewerCloseButton}
              onClick={onClose}
              title="Cerrar"
            >
              <X size={24} />
            </button>


          </div>
        </div>
        
        {/* Content */}
        <div className={styles.fileViewerContent}>
          {error ? (
            <div className={styles.fileViewerError}>
              <AlertCircle size={48} />
              <p>{error}</p>
            </div>
          ) : showQR && videoToken ? (
            <div className={styles.qrContainer}>
              <h3>Código QR de un solo uso</h3>
              <div className={styles.qrCodeWrapper}>
                <QRCodeSVG 
                  value={`${window.location.origin}/knowledge/video-viewer?token=${videoToken}&fileId=${file._id}`
}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
{/*               <p className={styles.qrUrl}>
                {`${window.location.origin}/knowledge/video-viewer?token=${videoToken}&fileId=${file._id}`
}
              </p>  */}
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;