// components/BaseConocimientos/Navigation/MainSidebar.tsx
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  Loader2,
  Home,
  ExternalLink
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
  externo?: number;
  orden_menu: number;
  expandable: boolean;
  subsecciones: Subseccion[];
  navegacionUrl?: string | null;
  navegable: boolean;
}

interface Subseccion {
  _id: string;
  script_id: number;
  nombre: string;
  icono: string;
  script: string;
  externo?: number;
  orden_submenu: number;
  grupo: string;
  navegacionUrl?: string | null;
  navegable: boolean;
}

interface MainSidebarProps {
  onItemClick?: (aplicacion: Aplicacion | Subseccion, isSubseccion?: boolean) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentUserId?: string; // ← AGREGAR esta prop
}



interface MainSidebarProps {
  onItemClick?: (aplicacion: Aplicacion | Subseccion, isSubseccion?: boolean) => void;
    currentUserId // ← AGREGAR aquí

  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ onItemClick }) => {
  
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Cargar aplicaciones al montar el componente
// En MainSidebar.tsx, cambiar el useEffect:
useEffect(() => {
  const cargarAplicaciones = async () => {
    try {
      setLoading(true);
      
      // ✅ CAMBIO: Pasar currentUserId (necesitas recibirlo como prop)
      const sidebarData = await aplicacionService.procesarAplicacionesParaSidebar(currentUserId);
      
      console.log('📱 Aplicaciones cargadas:', sidebarData);
      setAplicaciones(sidebarData);
      
      if (sidebarData.length > 0) {
        setActiveItem(sidebarData[0].script_id.toString());
      }

      if (process.env.NODE_ENV === 'development') {
        aplicacionService.mostrarEjemplosUrls();
      }
    } catch (err) {
      console.error('❌ Error cargando aplicaciones:', err);
      setError('Error al cargar las aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Solo cargar si currentUserId está disponible
  if (currentUserId) {
    cargarAplicaciones();
  }
}, [currentUserId]); // ← Agregar currentUserId como dependencia

  // Manejar expansión/colapso de secciones
  const handleToggleExpand = (scriptId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const key = scriptId.toString();
    
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

      // ✅ FUNCIÓN ACTUALIZADA: Manejar click en aplicación principal
      const handleItemClick = (aplicacion: Aplicacion) => {
        const scriptIdKey = aplicacion.script_id.toString();
        setActiveItem(scriptIdKey);
        
        console.log('🖱️ Click en aplicación:', aplicacion.nombre);
        console.log('📋 Tipo:', aplicacion.tipo, '- Navegable:', aplicacion.navegable);

        // Si es navegable (tipo 1), realizar navegación
        if (aplicacion.navegable && aplicacion.navegacionUrl) {
          console.log('🚀 Navegando a:', aplicacion.navegacionUrl);
          window.location.href = aplicacion.navegacionUrl;
    } else if (aplicacion.tipo === 0) {
      // Si es tipo 0 (separador), solo expandir/colapsar
      console.log('📋 Aplicación separadora, solo expandiendo secciones');
    } else {
      console.log('⚠️ Aplicación no navegable');
    }

    // Llamar al callback si existe
    onItemClick?.(aplicacion, false);

    // SIEMPRE expandir/colapsar si tiene subsecciones (sin importar el tipo)
    if (aplicacion.expandable && aplicacion.subsecciones.length > 0) {
      console.log('🔄 Expandiendo/colapsando secciones para:', aplicacion.nombre);
      setExpandedItems(prev => ({
        ...prev,
        [scriptIdKey]: !prev[scriptIdKey]
      }));
    }
  };

  // ✅ FUNCIÓN ACTUALIZADA: Manejar click en subsección
  const handleSubseccionClick = (subseccion: Subseccion, event: React.MouseEvent) => {
    event.stopPropagation();
    const scriptIdKey = subseccion.script_id.toString();
    setActiveItem(scriptIdKey);
    
    console.log('🖱️ Click en subsección:', subseccion.nombre);
    console.log('📋 Navegable:', subseccion.navegable);

    // Realizar navegación si es navegable
    if (subseccion.navegable && subseccion.navegacionUrl) {
      console.log('🚀 Navegando a:', subseccion.navegacionUrl);
      window.location.href = subseccion.navegacionUrl;
    } else {
      console.log('⚠️ Subsección no navegable');
    }
    
    // Llamar al callback
    onItemClick?.(subseccion, true);
  };

  // Función para obtener el icono dinámico usando el mapper
  const renderIcono = (iconoString: string) => {
    const iconClass = getIconClass(iconoString);
    
    return (
      <i 
        className={`${iconClass} sidebar-icon`}
        style={{ fontSize: '16px', minWidth: '20px' }}
      />
    );
  };

  // ✅ NUEVO: Renderizar indicador de navegación
  const renderNavegacionIndicator = (item: Aplicacion | Subseccion) => {
    if (!item.navegable) return null;
    
    return (
      <span 
        className={styles.navegacionIndicator}
        title="Navega a la página"
      >
        <ExternalLink size={10} />
      </span>
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
              } ${aplicacion.navegable ? styles.mainSidebarNavigable : ''}`}
              title={`${aplicacion.nombre}${aplicacion.navegable ? ' (Clic para navegar)' : ''}`}
              onClick={() => handleItemClick(aplicacion)}
              style={{
                cursor: aplicacion.navegable || aplicacion.expandable ? 'pointer' : 'default',
                opacity: aplicacion.tipo === 0 && !aplicacion.expandable ? 0.7 : 1
              }}
            >
              {renderIcono(aplicacion.icono)}
              <span className={styles.mainSidebarLabel}>
                {aplicacion.nombre}
                {renderNavegacionIndicator(aplicacion)}
              </span>
              
              {/* Botón de expansión si tiene subsecciones */}
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
                    } ${subseccion.navegable ? styles.mainSidebarNavigable : ''}`}
                    title={`${subseccion.nombre}${subseccion.navegable ? ' (Clic para navegar)' : ''}`}
                    onClick={(e) => handleSubseccionClick(subseccion, e)}
                    style={{
                      cursor: subseccion.navegable ? 'pointer' : 'default'
                    }}
                  >
                    {renderIcono(subseccion.icono)}
                    <span className={styles.mainSidebarSublabel}>
                      {subseccion.nombre}
                      {renderNavegacionIndicator(subseccion)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer con estadísticas */}
      {aplicaciones.length > 0 && (
        <div className={styles.mainSidebarFooter}>
          <small>
            {aplicaciones.length} aplicaciones • {aplicaciones.reduce((count, app) => count + app.subsecciones.length, 0)} subsecciones
          </small>
        </div>
      )}
    </div>
  );
};

export default MainSidebar;