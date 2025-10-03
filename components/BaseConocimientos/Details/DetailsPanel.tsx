// components/BaseConocimientos/Details/DetailsPanel.tsx
import React, { useEffect, useState } from 'react';
import { Search, Folder } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { temaService } from '../../../services/temaService';

// Interfaz para carpetas
interface FolderDetails {
  name: string;
  elements: number;
  creator: string;
  createdDate: string;
  type: string;
  access: string;
  lastOpened: string;
  lastModified: string;
}

// Interfaz para temas (según tu modelo de backend)
interface TemaDetails {
  _id: string;
  title_name: string;
  description: string;
  priority: string;
  keywords: string[];
  author_topic_id: string | {
    _id: string;
    nombre: string;
    aPaterno: string;
    // ... otras propiedades del autor
  };
  creation_date: string;
  last_update?: string;
}

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
  author_topic_id?: {
    user_id: number;
    nombre: string;
    aPaterno: string;
  } | string;
  area_id?: string;
  puesto_id?: string;
  files_attachment_id?: string[];
}

// Props del panel
interface DetailsPanelProps {
  selectedFolderDetails?: FolderDetails | null;
  selectedTemaId?: string | null; 
  isCreatingNewTopic?: boolean;
    isEditingTheme?: boolean; // ← Agregar esta línea
  themeToEdit?: Theme | null; 
  children?: React.ReactNode;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedFolderDetails,
  selectedTemaId,
  isCreatingNewTopic = false,
  isEditingTheme = false, 
  themeToEdit, 
  children
}) => {
  const [temaDetails, setTemaDetails] = useState<TemaDetails | null>(null);

  // Función para convertir prioridad numérica a texto


  // Cuando cambie el ID del tema seleccionado, se hace fetch
  useEffect(() => {
    if (selectedTemaId) {
      temaService.getTemaById(selectedTemaId)
        .then((data) => setTemaDetails(data))
        .catch((err) => {
          console.error("Error cargando el tema:", err);
          setTemaDetails(null);
        });
    } else {
      setTemaDetails(null);
    }
  }, [selectedTemaId]);

  // Caso: mostrar un formulario u otro contenido
  if (children) {
    return <div className={styles.detailsPanel}>{children}</div>;
  }
const getPriorityText = (priorityNum: string | number | undefined) => {
  const priority = Number(priorityNum);
  
  switch (priority) {
    case 2: return 'Alta';
    case 1: return 'Media';
    case 0: return 'Baja';
    default: return 'No definida';
  }
};

  // Caso: mostrar detalles de carpeta
  if (selectedFolderDetails) {
    return (
      <div className={styles.detailsPanel}>
        <h3 className={styles.detailsTitle}>DETALLES</h3>
        <div className={styles.folderDetailsContent}>
          <div className={styles.folderDetailsIcon}>
            <Folder size={80} fill="#6262bf" stroke="#6262bf" />
          </div>
          <h4 className={styles.folderDetailsName}>{selectedFolderDetails.name}</h4>
          <p className={styles.folderDetailsElements}>{selectedFolderDetails.elements} elementos</p>
          <div className={styles.folderDetailsInfo}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Creador:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.creator}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de creación:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.createdDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Tipo:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.type}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Acceso:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.access}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Abierto:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.lastOpened}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Modificado:</span>
              <span className={styles.detailValue}>{selectedFolderDetails.lastModified}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Caso: mostrar detalles de un tema
  if (temaDetails) {
    return (
      <div className={styles.detailsPanel}>
        <h3 className={styles.detailsTitle}>DETALLES</h3>
        <div className={styles.folderDetailsContent}>
          <div className={styles.folderDetailsIcon}>
          <img src="/knowledge/Tema.svg" alt="Tema" className={styles.themeIcon} />
          </div>
          <h4 className={styles.folderDetailsName}>{temaDetails.title_name}</h4>

          <div className={styles.folderDetailsInfo}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>CREADOR:</span>
              <span className={styles.detailValue}>
                  {temaDetails.author_topic_id
                    ? typeof temaDetails.author_topic_id === 'object'
                      ? `${temaDetails.author_topic_id.nombre || ""} ${temaDetails.author_topic_id.aPaterno || ""}`
                      : temaDetails.author_topic_id
                    : "Desconocido"}
                </span>
              </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>FECHA DE CREACIÓN:</span>
              <span className={styles.detailValue}>{new Date(temaDetails.creation_date).toLocaleDateString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Prioridad:</span>
<span className={styles.detailValue}>{getPriorityText(temaDetails.priority)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Palabras clave:</span>
              <span className={styles.detailValue}>{temaDetails.keywords.join(', ')}</span>
            </div>
            
            {temaDetails.last_update && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Última modificación:</span>
                <span className={styles.detailValue}>{new Date(temaDetails.last_update).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Caso por defecto (ningún elemento seleccionado)
  return (
    <div className={styles.detailsPanel}>
      <h3 className={styles.detailsTitle}>DETALLES</h3>
      <div className={styles.detailsPlaceholder}>
        <div className={styles.detailsIcon}>
          <Search size={24} style={{ color: 'white' }} />
        </div>
        <p className={styles.detailsMessage}>
          Selecciona un elemento para ver los detalles
        </p>
      </div>
    </div>
  );
};

export default DetailsPanel;
