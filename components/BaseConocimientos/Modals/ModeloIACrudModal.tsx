// components/BaseConocimientos/Modals/ModeloIACrudModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { modeloIAService } from '../../../services/modeloIAService';
import styles from '../../../styles/base-conocimientos.module.css';

interface ModeloIA {
  _id?: string;
  nombre: string;
  prompt_instrucciones: string;
}

interface ModeloIACrudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModeloIACrudModal: React.FC<ModeloIACrudModalProps> = ({
  isOpen,
  onClose
}) => {
  // Estados
  const [modelos, setModelos] = useState<ModeloIA[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ModeloIA>({ nombre: '', prompt_instrucciones: '' });
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modeloToDelete, setModeloToDelete] = useState<ModeloIA | null>(null);

  // Cargar modelos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadModelos();
    }
  }, [isOpen]);

  const loadModelos = async () => {
    try {
      setLoading(true);
      const response = await modeloIAService.getAllModeloIA();
      setModelos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setError('Error al cargar los modelos');
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo modelo
  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ nombre: '', prompt_instrucciones: '' });
    setEditingId(null);
  };

  // Editar modelo existente
  const handleEdit = (modelo: ModeloIA) => {
    setEditingId(modelo._id || null);
    setFormData({ nombre: modelo.nombre, prompt_instrucciones: modelo.prompt_instrucciones });
    setIsCreating(false);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      if (!formData.nombre.trim()) {  // Prompt es opcional
        setError('Todos los campos son requeridos');
        return;
      }

      setLoading(true);
      setError(null);

      if (isCreating) {
        // Crear nuevo
        await modeloIAService.createModeloIA(formData);
      } else if (editingId) {
        // Actualizar existente
        await modeloIAService.updateModeloIA(editingId, formData);
      }

      // Recargar la lista
      await loadModelos();
      
      // Limpiar formulario
      setIsCreating(false);
      setEditingId(null);
      setFormData({ nombre: '', prompt_instrucciones: '' });
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar el modelo');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ nombre: '', prompt_instrucciones: '' });
    setError(null);
  };

  // Mostrar modal de confirmación de eliminación
  const handleDeleteClick = (modelo: ModeloIA) => {
    setModeloToDelete(modelo);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!modeloToDelete?._id) return;

    try {
      setLoading(true);
      await modeloIAService.deleteModeloIA(modeloToDelete._id);
      await loadModelos();
      setShowDeleteConfirm(false);
      setModeloToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar el modelo');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setModeloToDelete(null);
  };

  // Cerrar modal
  const handleClose = () => {
    handleCancel();
    onClose();
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
          <h3 className={styles.modalTitle}>Gestión de Modelos IA</h3>
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
              Nuevo Modelo
            </button>
          </div>

          {/* Formulario de creación/edición */}
          {(isCreating || editingId) && (
            <div className={styles.crudForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel1}>Nombre:</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ejemplo: GPT-4, Claude, etc."
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel1}>
                  Instrucciones del Asistente (Opcional):
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.prompt_instrucciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt_instrucciones: e.target.value }))}
                   placeholder={`Ejemplo:\nEres un asistente amigable de [tu empresa].\n\nContexto: {contexto}\nPregunta: {pregunta}\n\nInstrucciones:\n- Responde de forma clara\n- Usa el contexto proporcionado\n- Sé breve y preciso`}
                  rows={8}
                />
                <small className={styles.formHelper}>
                  ⚠️ <strong>IMPORTANTE:</strong> Debes incluir las variables {'{contexto}'} y {'{pregunta}'} 
                  para que el asistente tenga acceso a la información de la base de datos.
                </small>
                
                {/* ✅ Validación visual */}
                {formData.prompt_instrucciones && 
                !formData.prompt_instrucciones.includes('{contexto}') && (
                  <div className={styles.warning}>
                    ⚠️ Falta la variable {'{contexto}'} - El asistente no tendrá acceso a la información guardada
                  </div>
                )}
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

          {/* Tabla de modelos - Solo mostrar si NO está en modo creación/edición */}
          {!isCreating && !editingId && (
            <div className={styles.crudTable}>
              {loading && <div className={styles.loadingSpinner}>Cargando...</div>}
              
              {!loading && modelos.length === 0 && (
                <div className={styles.emptyState}>
                  No hay modelos registrados
                </div>
              )}

              {!loading && modelos.length > 0 && (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Instrucciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelos.map((modelo) => (
                      <tr key={modelo._id}>
                        <td>{modelo.nombre}</td>
                        <td className={styles.tableCell}>
                          <span className={styles.promptPreview}>
                            {modelo.prompt_instrucciones 
                              ? modelo.prompt_instrucciones.substring(0, 31) + '...' 
                              : 'Sin instrucciones (usa default)'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEdit(modelo)}
                              disabled={loading || isCreating || editingId !== null}
                              title="Editar"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteClick(modelo)}
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
            {modelos.length} modelo{modelos.length !== 1 ? 's' : ''} registrado{modelos.length !== 1 ? 's' : ''}
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
                  ¿Estás seguro de eliminar este modelo?
                </p>
                {modeloToDelete && (
                  <div className={styles.modeloInfo}>
                    <strong>{modeloToDelete.nombre}</strong>
                    <span>{modeloToDelete.prompt_instrucciones}</span>
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

export default ModeloIACrudModal;