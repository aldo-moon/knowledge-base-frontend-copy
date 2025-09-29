// components/BaseConocimientos/Modals/SeccionCrudModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { seccionService } from '../../../services/seccionService';
import { modeloIAService } from '../../../services/modeloIAService';
import styles from '../../../styles/base-conocimientos.module.css';

interface Seccion {
  _id?: string;
  nombre: string;
  descripcion: string;
  modelo_id: string[];
  status: boolean;
  fecha_creacion?: string;
}

interface ModeloIA {
  _id: string;
  nombre: string;
  url_ai: string;
}

interface SeccionCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeccionCrudModal: React.FC<SeccionCrudModalProps> = ({
  isOpen,
  onClose
}) => {
  // Estados
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [modelosIA, setModelosIA] = useState<ModeloIA[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Seccion>({ 
    nombre: '', 
    descripcion: '', 
    modelo_id: [], 
    status: true 
  });
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seccionToDelete, setSeccionToDelete] = useState<Seccion | null>(null);

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadSecciones();
      loadModelosIA();
    }
  }, [isOpen]);

  const loadSecciones = async () => {
    try {
      setLoading(true);
      const response = await seccionService.getAllSeccion();
      setSecciones(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar secciones:', error);
      setError('Error al cargar las secciones');
    } finally {
      setLoading(false);
    }
  };

  const loadModelosIA = async () => {
    try {
      const response = await modeloIAService.getAllModeloIA();
      setModelosIA(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar modelos IA:', error);
    }
  };

  // Crear nueva sección
  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ nombre: '', descripcion: '', modelo_id: [], status: true });
    setEditingId(null);
  };

  // Editar sección existente
  const handleEdit = (seccion: Seccion) => {
    setEditingId(seccion._id || null);
    setFormData({ 
      nombre: seccion.nombre, 
      descripcion: seccion.descripcion,
      modelo_id: seccion.modelo_id || [],
      status: seccion.status
    });
    setIsCreating(false);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        return;
      }

      setLoading(true);
      setError(null);

      if (isCreating) {
        // Crear nueva
        await seccionService.createSeccion(formData);
      } else if (editingId) {
        // Actualizar existente
        await seccionService.updateSeccion(editingId, formData);
      }

      // Recargar la lista
      await loadSecciones();
      
      // Limpiar formulario
      setIsCreating(false);
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '', modelo_id: [], status: true });
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar la sección');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', modelo_id: [], status: true });
    setError(null);
  };

  // Mostrar modal de confirmación de eliminación
  const handleDeleteClick = (seccion: Seccion) => {
    setSeccionToDelete(seccion);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!seccionToDelete?._id) return;

    try {
      setLoading(true);
      await seccionService.deleteSeccion(seccionToDelete._id);
      await loadSecciones();
      setShowDeleteConfirm(false);
      setSeccionToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar la sección');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSeccionToDelete(null);
  };

  // Manejar selección de modelos IA
  const handleModeloChange = (modeloId: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      modelo_id: isChecked 
        ? [...prev.modelo_id, modeloId]
        : prev.modelo_id.filter(id => id !== modeloId)
    }));
  };

  // Cerrar modal
  const handleClose = () => {
    handleCancel();
    onClose();
  };

  // Obtener nombres de modelos por IDs
  const getModelosNames = (modeloIds: string[]) => {
    return modeloIds.map(id => {
      const modelo = modelosIA.find(m => m._id === id);
      return modelo ? modelo.nombre : 'Modelo no encontrado';
    }).join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div 
        className={styles.crudModalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.crudModalHeader}>
          <h3 className={styles.modalTitle}>Gestión de Secciones</h3>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.crudModalBody}>
          {/* Botón crear nuevo */}
          <div className={styles.crudActions}>
            <button 
              className={styles.createButton1}
              onClick={handleCreate}
              disabled={loading || isCreating || editingId !== null}
            >
              <Plus size={16} />
              Nueva Sección
            </button>
          </div>

          {/* Formulario de creación/edición */}
          {(isCreating || editingId) && (
            <div className={styles.crudForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre:</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: IA Generativa, Machine Learning, etc."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel1}>Descripción:</label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción de la sección..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel1}>Modelos IA:</label>
                <div className={styles.checkboxGroup}>
                  {modelosIA.length === 0 ? (
                    <span className={styles.noModels}>No hay modelos IA disponibles</span>
                  ) : (
                    modelosIA.map(modelo => (
                      <label key={modelo._id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={formData.modelo_id.includes(modelo._id)}
                          onChange={(e) => handleModeloChange(modelo._id, e.target.checked)}
                        />
                        <span className={styles.checkboxText}>{modelo.nombre}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                  />
                  <span className={styles.checkboxText}>Sección activa</span>
                </label>
              </div>

              <div className={styles.formActions1}>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  {isCreating ? 'Crear' : 'Actualizar'}
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <XCircle size={16} />
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Tabla de secciones - Solo mostrar si NO está en modo creación/edición */}
          {!isCreating && !editingId && (
            <div className={styles.crudTable}>
              {loading && <div className={styles.loadingSpinner}>Cargando...</div>}
              
              {!loading && secciones.length === 0 && (
                <div className={styles.emptyState}>
                  No hay secciones registradas
                </div>
              )}

              {!loading && secciones.length > 0 && (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Modelos IA</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secciones.map((seccion) => (
                      <tr key={seccion._id}>
                        <td>{seccion.nombre}</td>
                        <td className={styles.descriptionCell}>
                          <span title={seccion.descripcion}>
                            {seccion.descripcion.length > 50 
                              ? `${seccion.descripcion.substring(0, 50)}...` 
                              : seccion.descripcion
                            }
                          </span>
                        </td>
                        <td className={styles.modelosCell}>
                          <span title={getModelosNames(seccion.modelo_id)}>
                            {seccion.modelo_id.length > 0 
                              ? `${seccion.modelo_id.length} modelo${seccion.modelo_id.length !== 1 ? 's' : ''}`
                              : 'Sin modelos'
                            }
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${seccion.status ? styles.statusActive : styles.statusInactive}`}>
                            {seccion.status ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEdit(seccion)}
                              disabled={loading || isCreating || editingId !== null}
                              title="Editar"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteClick(seccion)}
                              disabled={loading || isCreating || editingId !== null}
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.crudModalFooter}>
          <span className={styles.recordCount}>
            {secciones.length} sección{secciones.length !== 1 ? 'es' : ''} registrada{secciones.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className={styles.confirmOverlay} onClick={handleCancelDelete}>
            <div 
              className={styles.confirmModal} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmHeader}>
                <h4 className={styles.confirmTitle}>Confirmar eliminación</h4>
              </div>
              
              <div className={styles.confirmBody}>
                <p className={styles.confirmMessage}>
                  ¿Estás seguro de eliminar esta sección?
                </p>
                {seccionToDelete && (
                  <div className={styles.modeloInfo}>
                    <strong>{seccionToDelete.nombre}</strong>
                    <span>{seccionToDelete.descripcion}</span>
                    <span>{seccionToDelete.modelo_id.length} modelo{seccionToDelete.modelo_id.length !== 1 ? 's' : ''} asociado{seccionToDelete.modelo_id.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.confirmFooter}>
                <button 
                  className={styles.confirmCancelButton}
                  onClick={handleCancelDelete}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.confirmDeleteButton}
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeccionCrudModal;