// components/BaseConocimientos/Navigation/MainSidebar.tsx
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Loader2,
  Home
} from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';
import { aplicacionService } from '../../../services/aplicacionService';
import { getIconClass } from '../../../utils/iconMapper';

interface Aplicacion {
  id: string;
  script_id: number;
  nombre: string;
  icono: string;
  tipo: number;
  grupo: string;
  script: string;
  orden_menu: number;
  expandable: boolean;
  subsecciones: Subseccion[];
}

interface Subseccion {
  _id: string;
  script_id: number;
  nombre: string;
  icono: string;
  script: string;
  orden_submenu: number;
  grupo: string;
}

interface MainSidebarProps {
  onItemClick?: (aplicacion: Aplicacion | Subseccion, isSubseccion?: boolean) => void;
    isCollapsed?: boolean; // 🆕 Nueva prop
  onToggleCollapse?: () => void; // 🆕 Nueva prop
}



export const MainSidebar: React.FC<MainSidebarProps>= ({ onItemClick }) => {
  
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Cargar aplicaciones al montar el componente
  useEffect(() => {
    const cargarAplicaciones = async () => {
      try {
        setLoading(true);
        const sidebarData = await aplicacionService.procesarAplicacionesParaSidebar();
        console.log('📱 Aplicaciones cargadas:', sidebarData);
        setAplicaciones(sidebarData);
        
        // Marcar como activa la primera aplicación por defecto
        if (sidebarData.length > 0) {
          setActiveItem(sidebarData[0].script_id.toString());
        }
      } catch (err) {
        console.error('❌ Error cargando aplicaciones:', err);
        setError('Error al cargar las aplicaciones');
      } finally {
        setLoading(false);
      }
    };

    cargarAplicaciones();
  }, []);

  // Manejar expansión/colapso de secciones
  const handleToggleExpand = (scriptId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const key = scriptId.toString();
    
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Manejar click en aplicación principal
  const handleItemClick = (aplicacion: Aplicacion) => {
    const scriptIdKey = aplicacion.script_id.toString();
    setActiveItem(scriptIdKey);
    
    console.log('🖱️ Click en aplicación:', aplicacion.nombre);
    onItemClick?.(aplicacion, false);
    
    // Si tiene subsecciones, expandir/colapsar automáticamente
    if (aplicacion.expandable && aplicacion.subsecciones.length > 0) {
      setExpandedItems(prev => ({
        ...prev,
        [scriptIdKey]: !prev[scriptIdKey]
      }));
    }
  };

  // Manejar click en subsección
  const handleSubseccionClick = (subseccion: Subseccion, event: React.MouseEvent) => {
    event.stopPropagation();
    const scriptIdKey = subseccion.script_id.toString();
    setActiveItem(scriptIdKey);
    
    onItemClick?.(subseccion, true);
  };

  // Función para obtener el icono dinámico usando el mapper
  const renderIcono = (iconoString: string) => {
    // Usar el mapper para convertir tim-icons a Font Awesome
    const iconClass = getIconClass(iconoString);
    
    return (
      <i 
        className={`${iconClass} sidebar-icon`}
        style={{ fontSize: '16px', minWidth: '20px' }}
      />
    );
  };

  // Render del estado de carga
  if (loading) {
    return (
      <div className={styles.mainSidebar}>
        <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className="fas fa-home sidebar-icon" style={{ fontSize: '18px', minWidth: '20px' }} />
          <span>INICIO</span>
        </div>
        </div>
        
        <nav className={styles.mainSidebarNav}>
          <div className={styles.loadingContainer}>
            <Loader2 size={20} className="animate-spin" />
            <span>Cargando aplicaciones...</span>
          </div>
        </nav>
      </div>
    );
  }

  // Render del estado de error
  if (error) {
    return (
      <div className={styles.mainSidebar}>
         <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className="fas fa-home sidebar-icon" style={{ fontSize: '18px', minWidth: '20px' }} />
          <span>INICIO</span>
        </div>
        </div>
        
        <nav className={styles.mainSidebarNav}>
          <div className={styles.errorContainer}>
            <span>❌ {error}</span>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Reintentar
            </button>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className={styles.mainSidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className="fas fa-home sidebar-icon" style={{ fontSize: '18px', minWidth: '20px' }} />
          <span>INICIO</span>
        </div>
        </div>
      
      <nav className={styles.mainSidebarNav}>
        {aplicaciones.map((aplicacion) => (
          <div key={aplicacion.script_id} className={styles.mainSidebarItemWrapper}>
            {/* Aplicación Principal */}
            <button
              className={`${styles.mainSidebarItem} ${
                activeItem === aplicacion.script_id.toString() ? styles.mainSidebarActive : ''
              }`}
              title={aplicacion.nombre}
              onClick={() => handleItemClick(aplicacion)}
            >
              {renderIcono(aplicacion.icono)}
              <span className={styles.mainSidebarLabel}>{aplicacion.nombre}</span>
              
              {/* Botón de expansión si tiene subsecciones - en la misma línea */}
              {aplicacion.expandable && aplicacion.subsecciones.length > 0 && (
                <span
                  className={styles.expandButton}
                  onClick={(e) => handleToggleExpand(aplicacion.script_id, e)}
                  title={expandedItems[aplicacion.script_id.toString()] ? 'Colapsar' : 'Expandir'}
                >
                  {expandedItems[aplicacion.script_id.toString()] ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                </span>
              )}
            </button>

            {/* Subsecciones */}
            {aplicacion.expandable && 
             aplicacion.subsecciones.length > 0 && 
             expandedItems[aplicacion.script_id.toString()] && (
              <div className={styles.mainSidebarSubsections}>
                {aplicacion.subsecciones.map((subseccion) => (
                  <button
                    key={subseccion.script_id}
                    className={`${styles.mainSidebarSubitem} ${
                      activeItem === subseccion.script_id.toString() ? styles.mainSidebarSubitemActive : ''
                    }`}
                    title={subseccion.nombre}
                    onClick={(e) => handleSubseccionClick(subseccion, e)}
                  >
                    {renderIcono(subseccion.icono)}
                    <span className={styles.mainSidebarSublabel}>{subseccion.nombre}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer con estadísticas (opcional) */}
      {aplicaciones.length > 0 && (
        <div className={styles.mainSidebarFooter}>
          <small>
            {aplicaciones.length} aplicaciones cargadas
          </small>
        </div>
      )}
    </div>
  );
};

export default MainSidebar;