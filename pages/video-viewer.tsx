// pages/video-viewer.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { archivoService } from '../services/archivoService';

export default function VideoViewer() {
  const router = useRouter();
  const { token, fileId } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tokenUsed, setTokenUsed] = useState(false);
  const [fileData, setFileData] = useState<any>(null);

  useEffect(() => {
    const validateAndLoadVideo = async () => {
      if (!token || !fileId) return;

      try {
        setLoading(true);
        setError('');

        console.log('🔑 Validando token:', token);
        const tokenResponse = await archivoService.accessOneTimeToken(token as string);
        
        if (!tokenResponse || tokenResponse.error) {
          setError(' Este enlace ya fue utilizado o ha expirado');
          setTokenUsed(true);
          return;
        }

        console.log('📁 Cargando archivo:', fileId);
        const fileResponse = await archivoService.getArchivoById(fileId as string);
        
        if (!fileResponse || !fileResponse.s3_path) {
          setError('❌ No se pudo cargar el video');
          return;
        }

        setFileData(fileResponse);
        setVideoUrl(fileResponse.s3_path);

      } catch (err: any) {
        console.error('❌ Error:', err);
        
        if (err.response?.status === 404 || err.response?.status === 410) {
          setError('Este enlace ya fue utilizado o ha expirado');
          setTokenUsed(true);
        } else {
          setError('❌ Error al cargar el video');
        }
      } finally {
        setLoading(false);
      }
    };

    validateAndLoadVideo();
  }, [token, fileId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando video...</p>
        </div>
      </div>
    );
  }

  if (error || tokenUsed) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Enlace no disponible</h2>
          <p style={styles.errorMessage}>{error}</p>
          {tokenUsed && (
            <div style={styles.tokenUsedInfo}>
              <p>Si necesitas ver el video nuevamente, solicita un nuevo código QR.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        {fileData && (
          <div style={styles.videoHeader}>
            <h2 style={styles.videoTitle}>{fileData.file_name}</h2>

          </div>
        )}
        
        <video
          src={videoUrl}
          controls
          autoPlay
          style={styles.video}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        >
          Tu navegador no soporta la reproducción de video.
        </video>
        

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loadingContainer: {
    textAlign: 'center' as const,
    color: 'white',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #6262bf',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#9ca3af',
  },
  errorContainer: {
    textAlign: 'center' as const,
    maxWidth: '500px',
    padding: '40px',
    backgroundColor: '#1e1e2f',
    borderRadius: '16px',
    border: '2px solid #ef4444',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  errorTitle: {
    color: 'white',
    fontSize: '24px',
    marginBottom: '16px',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '16px',
    marginBottom: '20px',
  },
  tokenUsedInfo: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#9ca3af',
  } as React.CSSProperties,
  videoContainer: {
    maxWidth: '1200px',
    width: '100%',
    backgroundColor: '#1e1e2f',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  videoHeader: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#27293d',
    borderRadius: '12px',
  },
  videoTitle: {
    color: 'white',
    fontSize: '24px',
    marginBottom: '10px',
  },
  videoWarning: {
    color: '#f59e0b',
    fontSize: '14px',
    margin: 0,
  },
  video: {
    width: '100%',
    maxHeight: '70vh',
    borderRadius: '12px',
    backgroundColor: '#000',
  },
  videoFooter: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  footerText: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: 0,
  },
};