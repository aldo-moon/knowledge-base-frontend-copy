// components/Auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { Shield, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import { authService } from '../../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-validar cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      handleAutoValidate();
    }
  }, [isOpen]);

  const handleAutoValidate = async () => {
    setIsLoading(true);
    setAuthStatus('idle');
    setErrorMessage('');
    
    try {
      const result = await authService.validateToken();
      
      if (result.success) {
        setAuthStatus('success');
        console.log('🎉 Autenticación exitosa! Usuario ID:', result.userId);
        
        // Esperar un momento para mostrar el éxito, luego cerrar
        setTimeout(() => {
          onAuthSuccess(result.userId);
          onClose();
        }, 1500);
      } else {
        setAuthStatus('error');
        setErrorMessage(result.message || 'Error en validación del token');
      }
    } catch (error) {
      setAuthStatus('error');
      setErrorMessage('Error de conexión. Inténtalo de nuevo.');
      console.error('❌ Error inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleAutoValidate();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div className="header-info">
              <Shield size={24} className="header-icon" />
              <div>
                <h2>Validación de Acceso</h2>
                <p>Verificando tu token de autenticación...</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="close-btn"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {isLoading && (
              <div className="status-section loading">
                <div className="spinner"></div>
                <h3>Validando token...</h3>
                <p>Conectando con el servidor de autenticación</p>
              </div>
            )}

            {authStatus === 'success' && (
              <div className="status-section success">
                <CheckCircle size={48} className="status-icon" />
                <h3>¡Autenticación Exitosa!</h3>
                <p>Token validado correctamente. Redirigiendo...</p>
              </div>
            )}

            {authStatus === 'error' && (
              <div className="status-section error">
                <AlertCircle size={48} className="status-icon" />
                <h3>Error en la Validación</h3>
                <p>{errorMessage}</p>
                
                <div className="error-actions">
                  <button 
                    onClick={handleRetry}
                    className="retry-btn"
                    disabled={isLoading}
                  >
                    <Shield size={16} />
                    Reintentar Validación
                  </button>
                  
                  <button 
                    onClick={onClose}
                    className="skip-btn"
                  >
                    Continuar sin validar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="modal-footer">
            <div className="info-text">
              <User size={14} />
              <span>Se validará automáticamente tu token de acceso</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 20px;
        }

        .header-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .header-icon {
          color: #3b82f6;
          margin-top: 2px;
        }

        .modal-header h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-header p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover:not(:disabled) {
          background: #e2e8f0;
          color: #1e293b;
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: 32px 24px;
        }

        .status-section {
          text-align: center;
          padding: 20px 0;
        }

        .status-section h3 {
          margin: 16px 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .status-section p {
          margin: 0 0 20px 0;
          color: #64748b;
          line-height: 1.5;
        }

        .loading h3 {
          color: #3b82f6;
        }

        .success h3 {
          color: #10b981;
        }

        .error h3 {
          color: #ef4444;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .status-icon {
          margin-bottom: 8px;
        }

        .success .status-icon {
          color: #10b981;
        }

        .error .status-icon {
          color: #ef4444;
        }

        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .retry-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .retry-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .skip-btn {
          padding: 10px 20px;
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .skip-btn:hover {
          background: #f8fafc;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        .modal-footer {
          padding: 0 24px 24px 24px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }

        .info-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          justify-content: center;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            margin: 20px;
            max-width: none;
          }
          
          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </>
  );
};