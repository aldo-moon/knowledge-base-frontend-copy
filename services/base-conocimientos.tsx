import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Container, 
  Archive, 
  Star, 
  Clock, 
  Trash2,
  MoreHorizontal,
  Folder,
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  FileText,
  Image, 
  Video, 
  ArrowUpDown, 
  SlidersHorizontal,
  FolderPlus,  
  MessageSquare,  
  Camera,  
  ChevronRight,  
  ChevronDown,  
  User,   
  Tag,
  Filter,
  Edit,
  Trash,
  Type,
  Calendar,
  ChevronLeft,
  Upload 
} from 'lucide-react';
import styles from '../styles/base-conocimientos.module.css';
import { carpetaService } from '../services/carpetaService';
import { temaService } from '../services/temaService';

// Definición de interfaces
interface FilterOption {
  icon: React.ElementType;
  label: string;
  action?: string;
}

interface SortOption {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
}

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

const BaseConocimientos = () => {
  // Estados básicos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({}); 
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [activeContentFilters, setActiveContentFilters] = useState<string[]>([]);
  const [selectedFolderDetails, setSelectedFolderDetails] = useState<FolderDetails | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Estados para menús contextuales
  const [openFolderMenu, setOpenFolderMenu] = useState<number | null>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [currentSortBy, setCurrentSortBy] = useState('Ordenar por');
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [isMultimediaModalOpen, setIsMultimediaModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const filtersRef = useRef(null);
  const [themes, setThemes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarFolders, setSidebarFolders] = useState({});
  const [expandedSidebarItems, setExpandedSidebarItems] = useState({});
  const [currentFolderId, setCurrentFolderId] = useState("68acb06886d455d16cceef05");
  const [navigationPath, setNavigationPath] = useState([
  { id: "68acb06886d455d16cceef05", name: "Contenedor" }
  ]);


const renderSubfolder = (folder, level) => (
  <div key={folder._id} className={styles.subfolderWrapper} style={{ marginLeft: `${level * 0.5}rem` }}>
    <button
      className={styles.subfolderItem}
      onClick={() => {
        const pathArray = [{ id: "68acb06886d455d16cceef05", name: "Contenedor" }];
        pathArray.push({ id: folder._id, name: folder.folder_name });
        setCurrentFolderId(folder._id);
        setNavigationPath(pathArray);
      }}
    >
      <Folder size={14} />
      <h3 className={styles.subfolderItemfoldername}>{folder.folder_name}</h3>
      
      <button
        className={styles.expandButton}
        onClick={(e) => handleSubfolderExpandClick(folder._id, folder.folder_name, e)}
      >
        {expandedSidebarItems[folder._id] ? (
          <ChevronDown size={12} />
        ) : (
          <ChevronRight size={12} />
        )}
      </button>
    </button>
    
    {expandedSidebarItems[folder._id] && sidebarFolders[folder._id] && (
      <div className={styles.nestedFolders}>
        {sidebarFolders[folder._id].map((nestedFolder) => 
          renderSubfolder(nestedFolder, level + 1)
        )}
      </div>
    )}
  </div>
);
  
  


  

const loadCarpetas = async () => {
  try {
    setLoading(true);
    
    // Cargar carpetas
    const carpetas = await carpetaService.getFolderContent(currentFolderId);
    setFolders(carpetas);
    
    // Cargar temas de la carpeta actual
    const temas = await temaService.getTemasByFolder(currentFolderId);
    setThemes(temas);
  } catch (error) {
    console.error('Error loading content:', error);
    setFolders([]);
    setThemes([]);
  } finally {
    setLoading(false);
  }
};
// Recargar cuando cambie el nivel actual
useEffect(() => {
  loadCarpetas();
}, [currentFolderId]); 

const loadSidebarFolders = async () => {
  try {
    const response = await carpetaService.getFolderContent("68acb06886d455d16cceef05");
    setSidebarFolders({ 'Contenedor': response });
  } catch (error) {
    console.error('Error loading sidebar folders:', error);
  }
};

useEffect(() => {
  loadSidebarFolders();
}, []);



const loadSubfolderContent = async (folderId, folderName) => {
  try {
    const response = await carpetaService.getFolderContent(folderId);
    setSidebarFolders(prev => ({
      ...prev,
      [folderId]: response
    }));
  } catch (error) {
    console.error('Error loading subfolder content:', error);
    setSidebarFolders(prev => ({
      ...prev,
      [folderId]: [] // Si no hay contenido, array vacío
    }));
  }
};

const handleSubfolderExpandClick = async (folderId, folderName, event) => {
  event.stopPropagation();
  
  const key = folderId;
  setExpandedSidebarItems(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
  
  // Si se está expandiendo y no hay datos cargados, cargar contenido
  if (!expandedSidebarItems[key] && !sidebarFolders[folderId]) {
    await loadSubfolderContent(folderId, folderName);
  }
};

// Función para manejar la creación de carpeta
const handleCreateFolder = () => {
  if (newFolderName.trim()) {
    // Aquí puedes agregar la lógica para crear la carpeta
    console.log(`Creando carpeta: ${newFolderName}`);
    
    // Cerrar modal y limpiar
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
  }
};

// Función para cancelar
const handleCancelFolder = () => {
  setIsNewFolderModalOpen(false);
  setNewFolderName('');
};

// Actualizar la función handleOptionClick
  const handleOptionClick = (option: FilterOption) => {
  console.log(`Opción seleccionada: ${option.label}`);
  
  if (option.label === 'Nueva carpeta') {
    setIsNewFolderModalOpen(true);
  } else if (option.label === 'Nuevo Tema') {
    setIsCreatingNewTopic(true);
  } else if (option.label === 'Multimedia') {
    setIsMultimediaModalOpen(true);
  }
  
  setIsDropdownOpen(false);
};

const handleFolderDoubleClick = async (folder) => {
  console.log('Double click en carpeta:', folder.folder_name);
  
  // Agregar la nueva carpeta al path de navegación
  setNavigationPath(prev => [...prev, { id: folder._id, name: folder.folder_name }]);
  setCurrentFolderId(folder._id);
  setSelectedFolderDetails(null);
};

const handleNavigateBack = (targetIndex) => {
  const newPath = navigationPath.slice(0, targetIndex + 1);
  const targetFolder = newPath[newPath.length - 1];
  
  setNavigationPath(newPath);
  setCurrentFolderId(targetFolder.id);
  setSelectedFolderDetails(null);
};


const handleFolderSelection = async (folder) => {
  try {
    // Obtener detalles completos de la carpeta
    const folderDetails = await carpetaService.getCarpetaById(folder._id);
    
    // Transformar los datos para el formato que espera el componente
   const transformedDetails = {
  name: folderDetails.folder_name,
  elements: 0,
  creator: folderDetails.user_creator_id?.names && folderDetails.user_creator_id?.last_names 
    ? `${folderDetails.user_creator_id.names} ${folderDetails.user_creator_id.last_names}`
    : folderDetails.user_creator_id?.names || 'Desconocido',
  createdDate: new Date(folderDetails.creation_date).toLocaleDateString(),
  type: 'Carpeta',
  access: 'Todos',
  lastOpened: 'N/A',
  lastModified: folderDetails.last_update ? 
    new Date(folderDetails.last_update).toLocaleDateString() : 'N/A'
};
    
    setSelectedFolder(folder);
    setSelectedFolderDetails(transformedDetails);
  } catch (error) {
    console.error('Error getting folder details:', error);
  }
};

  // Referencias
  const dropdownRef = useRef(null); 
  const searchRef = useRef(null);
  const folderMenuRefs = useRef<Record<number, HTMLDivElement>>({});
  const sortMenuRef = useRef(null);

  // Opciones del menú de ordenar por
  const sortOptions = [
    { 
      icon: Type, 
      label: 'Nombre',
      value: 'nombre'
    },
    { 
      icon: Calendar, 
      label: 'Fecha',
      value: 'fecha'
    }
  ];

  // Opciones del menú contextual de carpetas
  const folderMenuOptions = [
    { 
      icon: Edit, 
      label: 'Cambiar nombre',
      action: 'rename'
    },
    { 
      icon: Trash, 
      label: 'Eliminar',
      action: 'delete'
    }
  ];

  // Función para manejar clic en filtros de contenido
  const handleContentFilterClick = (filterLabel: string) => {
    if (filterLabel === 'Ordenar por') {
      setIsSortMenuOpen(!isSortMenuOpen);
      return;
    }

    setActiveContentFilters(prev => {
      if (prev.includes(filterLabel)) {
        return prev.filter(f => f !== filterLabel);
      } else {
        return [...prev, filterLabel];
      }
    });
  };

  // Función para manejar selección de orden
  const handleSortOptionClick = (option: SortOption) => {
    // ✅ Si hacen clic en la opción ya seleccionada, desactivar el filtro
    if (currentSortBy === option.label) {
      setCurrentSortBy('Ordenar por');
      console.log('Filtro de ordenamiento desactivado');
    } else {
      // Si seleccionan una opción diferente, activarla
      setCurrentSortBy(option.label);
      console.log(`Ordenando por: ${option.label}`);
    }
    
    setIsSortMenuOpen(false);
  };

  // ✅ Función para manejar el toggle de visibilidad de filtros
  const handleFiltersToggle = () => {
    setAreFiltersVisible(!areFiltersVisible);
    // Cerrar el menú de ordenar por si está abierto
    if (isSortMenuOpen) {
      setIsSortMenuOpen(false);
    }
  };

  // Función para manejar clic en el menú de carpeta
  const handleFolderMenuClick = (folderIndex: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenFolderMenu(openFolderMenu === folderIndex ? null : folderIndex);
  };

  // Función para manejar acciones del menú de carpeta
const handleFolderMenuAction = (action, folderIndex, folderName) => {
  const folder = folders[folderIndex];
  
  switch(action) {
    case 'rename':
      setEditingFolder(folder);
      setEditFolderName(folder.folder_name);
      setIsEditModalOpen(true);
      break;
    case 'delete':
      setFolderToDelete(folder);
      setIsDeleteModalOpen(true);
      break;
    default:
      break;
  }
  
  setOpenFolderMenu(null);
};

const handleDeleteFolder = async () => {
  if (folderToDelete) {
    try {
      await carpetaService.deleteCarpeta(folderToDelete._id);
      
      // Remover la carpeta del estado local
      setFolders(folders.filter(folder => folder._id !== folderToDelete._id));
      
      setIsDeleteModalOpen(false);
      setFolderToDelete(null);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  }
};

const handleCancelDelete = () => {
  setIsDeleteModalOpen(false);
  setFolderToDelete(null);
};

  const handleFilterToggle = (label) => {
    setActiveFilter((prev) => (prev === label ? null : label));
  };



  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
    setActiveFilters({});
  };

  const handleFilterOptionClick = (filterLabel: string, option: FilterOption) => {
    console.log(`Filtro: ${filterLabel}, Opción: ${option.label}`);
  };

  // useEffect para manejar clics fuera de los menús
  useEffect(() => {
  const handleClickOutside = (event) => {
    // Cerrar dropdown principal
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    
    // Cerrar buscador expandido
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      handleSearchCollapse();
    }

    // Cerrar menú de carpetas
    let clickedInsideMenu = false;
    Object.values(folderMenuRefs.current).forEach(ref => {
      if (ref && ref.contains(event.target)) {
        clickedInsideMenu = true;
      }
    });
    
    if (!clickedInsideMenu) {
      setOpenFolderMenu(null);
    }

    // Cerrar menú de ordenar por
    if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
      setIsSortMenuOpen(false);
    }

    // ✅ Cerrar filtros de contenido
    if (filtersRef.current && 
        !filtersRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.filterToggleButton}`) && // Excluir el botón
        areFiltersVisible) {
      setAreFiltersVisible(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [areFiltersVisible]); // Agregar areFiltersVisible a las dependencias





///////////////////////////////////////////////INFORMACION TEMPORAL///////////////////////////////////////////////
  // Sidebar principal de navegación
  const mainSidebarItems = [
    { icon: Home },
    { icon: BookOpen, active: true },
    { icon: Users},
    { icon: BarChart3},
    { icon: FileText},
    { icon: Settings }
  ];

  // Menu de filtros (el anterior "sidebar")
  const sidebarItems = [
    { icon: Container, label: 'Contenedor', active: true, expandable: true },
    { icon: Archive, label: 'Mis archivos', expandable: true },
    { icon: Star, label: 'Favoritos', expandable: true },
    { icon: Clock, label: 'Recientes', expandable: false },
    { icon: Trash2, label: 'Papelera', expandable: false }
  ];

  


    const searchFilters = [
    {
      label: 'Tipo',
      icon: Filter,
      options: [
        { label: 'Documentos', icon: FileText },
        { label: 'Imagenes', icon: Image },
        { label: 'Videos', icon: Video },
        { label: 'Carpetas', icon: Folder }
      ]
    },
    {
      label: 'Persona',
      icon: User,
      options: [
        { label: 'Juan Pérez', icon: User },
        { label: 'María García', icon: User },
        { label: 'Carlos López', icon: User },
        { label: 'Ana Martínez', icon: User }
      ]
    },
    {
      label: 'Tags',
      icon: Tag,
      options: [
        { label: 'Importante', icon: Tag },
        { label: 'Urgente', icon: Tag },
        { label: 'Proyecto', icon: Tag },
        { label: 'Revisión', icon: Tag }
      ]
    }
  ];


    // Subcarpetas que aparecen al expandir
  const subfolders = {
    'Contenedor': ['Capacitación', 'Finanzas', 'Sistemas'],
    'Mis archivos': ['Capacitación', 'Finanzas', 'Sistemas'],
    'Favoritos': ['Capacitación', 'Finanzas', 'Sistemas']
  };




  /////////////////////////// Opciones del menú desplegable ////////////////////////////
  const dropdownOptions = [
    { icon: FolderPlus, label: 'Nueva carpeta' },
    { icon: MessageSquare, label: 'Nuevo Tema' },
    { icon: Camera, label: 'Multimedia' }
  ];

  // Función para manejar expansión de items del sidebar
const handleExpandClick = async (itemLabel, event) => {
  event.stopPropagation();
  
  if (itemLabel === 'Contenedor') {
    setExpandedSidebarItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
    
    // Si se está expandiendo y no hay datos, cargar
    if (!expandedSidebarItems[itemLabel] && !sidebarFolders[itemLabel]) {
      await loadSidebarFolders();
    }
  }
};

  // Función para manejar clic en el botón Nuevo
  const handleNewButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };




/////////////////////////////////Historial de navegación y breadcrumb/////////////////////////////////

const renderBreadcrumb = () => {
  const maxVisible = 2; // Cambiar a 2 para mostrar solo primero y último
  
  if (navigationPath.length <= maxVisible) {
    // Si hay pocos elementos, mostrar todos
    return navigationPath.map((folder, index) => (
      <span key={folder.id} className={styles.breadcrumbItem}>
        <button 
          className={styles.breadcrumbButton}
          onClick={() => handleNavigateBack(index)}
        >
          {folder.name}
        </button>
        {index < navigationPath.length - 1 && (
          <ChevronRight size={16} className={styles.breadcrumbSeparator} />
        )}
      </span>
    ));
  }
  
  // Si hay muchos elementos, mostrar primero, puntos y último
  const firstItem = navigationPath[0];
  const lastItem = navigationPath[navigationPath.length - 1]; // Solo el último elemento
  
  return (
    <>
      {/* Primer elemento */}
      <span className={styles.breadcrumbItem}>
        <button 
          className={styles.breadcrumbButton}
          onClick={() => handleNavigateBack(0)}
        >
          {firstItem.name}
        </button>
        <ChevronRight size={16} className={styles.breadcrumbSeparator} />
      </span>
      
      {/* Puntos como botón navegable */}
      <span className={styles.breadcrumbItem}>
        <button 
          className={styles.breadcrumbEllipsis}
          onClick={() => handleNavigateBack(navigationPath.length - 2)} // Ir al penúltimo nivel
        >
          ...
        </button>
        <ChevronRight size={16} className={styles.breadcrumbSeparator} />
      </span>
      
      {/* Último elemento */}
      <span className={styles.breadcrumbItem}>
        <span className={styles.breadcrumbCurrent}>
          {lastItem.name}
        </span>
      </span>
    </>
  );
};



///////////////////////////////////////////////////INICIA PAGINA///////////////////////////////////////////////////
  return (
    <div className={styles.baseConocimientos}>
      {/* Header general */}
      <div className={styles.baseConocimientosHeader}>
        <h1 className={styles.baseConocimientosTitle}>
          BASE DE CONOCIMIENTOS
        </h1>
      </div>

{/*/////////////////////////////////////////////////////////// SIDEBAR AZUL //////////////////////////////////////////////////////////////*/}
      <div className={styles.mainContentWrapper}>
        {/* Main Navigation Sidebar */}
        <div className={styles.mainSidebar}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>ZIMPLE</div>
          </div>
          <nav className={styles.mainSidebarNav}>
            {mainSidebarItems.map((item, index) => (
              <button
                key={index}
                className={`${styles.mainSidebarItem} ${item.active ? styles.mainSidebarActive : ''}`}
                title={item.label}
              >
                <item.icon size={20} />
                <span className={styles.mainSidebarLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

{/*////////////////////////////////////////////// AREA BUSCADOR Y BOTON +NUEVO //////////////////////////////////////////////////////////////*/}
        <div className={styles.mainContent}>
          {/* Search Bar con dropdown */}
          <div className={styles.searchContainer}>
            {/* New Button con dropdown */}
            <div className={styles.newButtonContainer} ref={dropdownRef}>
              <button 
                className={styles.newButton}
                onClick={handleNewButtonClick}
              >
                <Plus size={22} />
                Nuevo
              </button>
              
{/*///////////////////////////////////////////// Dropdown Menu DEL BOTON +NUEVO /////////////////////////////////////////////////////////*/}
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {dropdownOptions.map((option, index) => (
                    <button
                      key={index}
                      className={styles.dropdownOption}
                      onClick={() => handleOptionClick(option)}
                    >
                      <option.icon size={18} className={styles.optionIcon} />
                      <span className={styles.optionLabel}>{option.label}</span>
                    </button>
                  ))}
                </div>
                
              )}
{/*////////////////////////////////////////////////////// Modal para Nueva Carpeta ////////////////////////////////////////////////////////////////////*/}
              {isNewFolderModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCancelFolder}>
                  <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>Nueva Carpeta</h3>
                      
                    </div>
                    
                    <div className={styles.modalBody}>
                      
                      <input
                        id="folderName"
                        type="text"
                        className={styles.modalInput}
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Ingresa el nombre de la carpeta"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateFolder();
                          if (e.key === 'Escape') handleCancelFolder();
                        }}
                      />
                    </div>
                    
                    <div className={styles.modalFooter}>
                      <button 
                        className={styles.modalCancelButton}
                        onClick={handleCancelFolder}
                      >
                        Cancelar
                      </button>
                      <button 
                        className={styles.modalCreateButton}
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim()}
                      >
                        Crear
                      </button>
                    </div>
                  </div>
                </div>
              )}
{/*//////////////////////////////////////////////////////// Modal para Subir Multimedia ///////////////////////////////////////////////////////////////////*/}
              {isMultimediaModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsMultimediaModalOpen(false)}>
                  <div className={styles.multimediaModalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.multimediaModalHeader}>
                      <h3 className={styles.multimediaModalTitle}>Subir multimedia</h3>
                      
                    </div>
                    
                    <div className={styles.multimediaModalBody}>
                      <div className={styles.multimediaUploadArea}>
                        <div className={styles.multimediaUploadIcon}>
                          <Upload size={48} />
                        </div>
                        <p className={styles.multimediaUploadText}>Cargar archivos</p>
                      </div>
                    </div>
                    
                    <div className={styles.multimediaModalFooter}>
                      <button 
                        className={styles.multimediaSubirButton}
                        onClick={() => {
                          console.log('Subiendo multimedia...');
                          setIsMultimediaModalOpen(false);
                        }}
                      >
                        SUBIR
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>

{/*////////////////////////////////////////// BUSCADOR SUPERIOR ////////////////////////////////////////////////////////////////////////////////////////////*/}
            <div 
              className={`${styles.searchWrapper} ${isSearchExpanded ? styles.searchExpanded : ''}`}
              ref={searchRef}
            >
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Busca palabras claves, personas y etiquetas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                className={styles.searchInput}
              />
                           
              {isSearchExpanded && (
                <button
                  onClick={handleSearchCollapse}
                  className={styles.searchCollapseButton}
                >
                  <X size={18} />
                </button>
              )}

{/*/////////////////////////////////////// FILTROS DEL BUSCADOR ////////////////////////////////////////////////////////*/}
              {isSearchExpanded && (
                <div className={styles.searchFilters}>
                  {searchFilters.map((filter, index) => (
                    <div key={index} className={styles.filterGroup}>
                      <button
                        className={`${styles.filterButton} ${activeFilter === filter.label ? styles.filterActive : ''}`}
                        onClick={() => handleFilterToggle(filter.label)}
                      >
                        <filter.icon size={15} />
                        <span>{filter.label}</span>
                        {activeFilter === filter.label ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>

                      {/* Opciones del filtro */}
                      {activeFilter === filter.label && (
                        <div className={styles.filterOptions}>
                          {filter.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              className={styles.filterOption}
                              onClick={() => handleFilterOptionClick(filter.label, option)}
                            >
                              <option.icon size={14} />
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

{/* //////////////////////////////////////// SIDEBAR CONTENEDOR /////////////////////////////////////////////////////*/}
          <div className={styles.contentArea}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <nav className={styles.sidebarNav}>
                {sidebarItems.map((item, index) => (
                  <div key={index} className={styles.sidebarItemWrapper}>
                    <button
                      className={`${styles.sidebarNavItem} ${item.active ? styles.active : ''}`}
                    >
                      <item.icon size={20} />
                      {item.label}
                      {item.expandable && (
                        <button
                          className={styles.expandButton}
                          onClick={(e) => handleExpandClick(item.label, e)}
                        >
                          {expandedSidebarItems[item.label] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      )}
                    </button>
                    
                    {item.expandable && expandedSidebarItems[item.label] && sidebarFolders[item.label] && (
                      <div className={styles.subfoldersList}>
                        {sidebarFolders[item.label].map((subfolder) => 
                          renderSubfolder(subfolder, 1)
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
                
{/*///////////////////////////// SECCION FOLDER - CREAR NUEVO TEMA ///////////////////////////////////////////////////////////////////////////*/}
            {isCreatingNewTopic ? (
              <div className={styles.topicEditorSection}>
                <div className={styles.topicEditorHeader}>
                  
                  <h2 className={styles.topicEditorTitle}>Crear nuevo tema</h2>
                  <button 
                    className={styles.backButton}
                    onClick={() => {
                      setIsCreatingNewTopic(false);
                      setNewTopicTitle('');
                      setNewTopicDescription('');
                    }}
                  >
                    <ChevronLeft size={20} />
                    Volver
                  </button>
                </div>
                
                <div className={styles.topicEditorContent}>
                  <div className={styles.topicTitleSection}>
                    <label className={styles.topicLabel}>Título del tema</label>
                    <input
                      type="text"
                      className={styles.topicTitleInput}
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      placeholder="Elige un nombre"
                    />
                  </div>
                  
                  <div className={styles.topicDescriptionSection}>
                    <label className={styles.topicLabel}>Descripción</label>
                    <div className={styles.topicEditor}>
                      <textarea
                        className={styles.topicTextarea}
                        value={newTopicDescription}
                        onChange={(e) => setNewTopicDescription(e.target.value)}
                        placeholder="Escribe una descripción..."
                      />
                      <div className={styles.editorToolbar}>
                        <select className={styles.fontSelect}>
                          <option>Sans Serif</option>
                        </select>
                        <select className={styles.sizeSelect}>
                          <option>TT</option>
                        </select>
                        
                        <div className={styles.toolbarDivider}></div>
                        
                        <button className={styles.formatButton} title="Negrita">
                          <strong>B</strong>
                        </button>
                        <button className={styles.formatButton} title="Cursiva">
                          <em>I</em>
                        </button>
                        <button className={styles.formatButton} title="Subrayado">
                          <u>U</u>
                        </button>
                        <button className={styles.formatButton} title="Color de texto">
                          A
                        </button>
                        
                        <div className={styles.toolbarDivider}></div>
                        
                        <button className={styles.formatButton} title="Lista con viñetas">
                          ⚫
                        </button>
                        <button className={styles.formatButton} title="Lista numerada">
                          1.
                        </button>
                        <button className={styles.formatButton} title="Cita">
                          "
                        </button>
                        
                        <div className={styles.toolbarDivider}></div>
                        
                        <button className={styles.formatButton} title="Adjuntar imagen">
                          <Image size={16} />
                        </button>
                        <button className={styles.formatButton} title="Adjuntar archivo">
                          📎
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              

              
              <div className={styles.foldersSection}>
{/*////////////////////////////////////////////FILTROS SECCION FOLDERS //////////////////////////////////////////////*/}
                <div>
                  <div className={styles.contentHeader}>
                    <div className={styles.contentHeaderTop}>
                      <div className={styles.contentHeaderLeft}>
              <div className={styles.breadcrumb}>
                {renderBreadcrumb()}
              </div>
            </div>
          
          <div className={styles.contentHeaderActions}>
            <button 
              className={`${styles.filterToggleButton} ${areFiltersVisible ? styles.filterToggleActive : ''}`}
              onClick={handleFiltersToggle}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
        
        {areFiltersVisible && (
          <div className={styles.contentHeaderTags} ref={filtersRef}>
            {[
              { label: 'Documentos', icon: FileText },
              { label: 'Imagenes', icon: Image },
              { label: 'Videos', icon: Video }
            ].map((tag) => (
              <button
                key={tag.label}
                className={`${styles.contentTag} ${
                  activeContentFilters.includes(tag.label) ? styles.contentTagActive : ''
                }`}
                onClick={() => handleContentFilterClick(tag.label)}
              >
                <tag.icon size={14} style={{ marginRight: '6px' }} />
                {tag.label}
              </button>
            ))}
            
            {/* Filtro de Ordenar por con menú desplegable */}
            <div className={styles.sortMenuContainer} ref={sortMenuRef}>
              <button
                className={`${styles.contentTag} ${styles.sortButton} ${
                  isSortMenuOpen ? styles.contentTagActive : ''
                }`}
                onClick={() => handleContentFilterClick('Ordenar por')}
              >
                <ArrowUpDown size={14} style={{ marginRight: '6px' }} />
                {currentSortBy}
              </button>
              
              {/* Menú desplegable de ordenar por */}
              {isSortMenuOpen && (
                <div className={styles.sortDropdownMenu}>
                  {sortOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`${styles.sortDropdownOption} ${
                        currentSortBy === option.label ? styles.sortDropdownActive : ''
                      }`}
                      onClick={() => handleSortOptionClick(option)}
                    >
                      <option.icon size={16} className={styles.sortOptionIcon} />
                      <span className={styles.sortOptionLabel}>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className={styles.contentHeaderSubtitle}>Carpetas</p>
    </div>
    
<div className={styles.contentSections}>
  {loading ? (
    <p>Cargando contenido...</p>
  ) : error ? (
    <p>Error: {error}</p>
  ) : (
    <>
      {/* Sección de Carpetas */}
      {folders.length > 0 && (
        <div className={styles.contentSection}>
          
          <div className={styles.foldersGrid}>
            {folders.map((folder, index) => (
              <div
                key={folder._id}
                className={styles.folderCard}
                onClick={() => handleFolderSelection(folder)}
                onDoubleClick={() => handleFolderDoubleClick(folder)}
              >
                <div className={styles.folderCardHeader}>
                  <div className={styles.folderInfo}>
                    <Folder className={styles.folderIcon} size={24} />
                    <h3 className={styles.folderName}>{folder.folder_name}</h3>
                  </div>

                  <div className={styles.folderActions}>
                    <div 
                      className={styles.folderMenuContainer}
                      ref={el => {
                        if (el) folderMenuRefs.current[index] = el;
                      }}
                    >
                      <button 
                        className={styles.folderMenuButton}
                        onClick={(e) => handleFolderMenuClick(index, e)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {openFolderMenu === index && (
                        <div className={styles.folderContextMenu}>
                          {folderMenuOptions.map((menuOption, menuIndex) => (
                            <button
                              key={menuIndex}
                              className={styles.folderContextOption}
                              onClick={() => handleFolderMenuAction(menuOption.action, index, folder.folder_name)}
                            >
                              <menuOption.icon size={16} className={styles.contextOptionIcon} />
                              <span className={styles.contextOptionLabel}>{menuOption.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button className={styles.folderStarButton}>
                      <Star size={18} className={styles.folderStarIcon} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Temas */}
      {themes.length > 0 && (
        <div className={styles.contentSection}>
          <h3 className={styles.contentHeaderSubtitle}>Temas</h3>
          <div className={styles.themesGrid}>
            {themes.map((theme) => (
              <div
                key={theme._id}
                className={styles.themeCard}
                onClick={() => handleThemeSelection(theme)}
              >
                
                
              <div className={styles.themeContent}>
                <div className={styles.themeIconContainer}>
                  <img src="/Tema.svg" alt="Tema" className={styles.themeIcon} />
                </div>
                  <h3 className={styles.themeName}>{theme.title_name}</h3>
                </div>

                <div className={styles.themeCardHeader}>
                  <div className={styles.themeActions}>
                    <button className={styles.themeMenuButton}>
                      <MoreHorizontal size={16} />
                    </button>
                    <button className={styles.themeStarButton}>
                      <Star size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</div>


{/* Modal para Eliminar Carpeta - FUERA del grid */}
{isDeleteModalOpen && (
  <div className={styles.modalOverlay} onClick={handleCancelDelete}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalBody}>
        <p className={styles.deleteMessage}>
          ¿Estás seguro de eliminar la carpeta "{folderToDelete?.folder_name}"?
        </p>
      </div>
      
      <div className={styles.modalFooter}>
        <button 
          className={styles.modalCancelButton}
          onClick={handleCancelDelete}
        >
          Cancelar
        </button>
        <button 
          className={styles.modalDeleteButton}
          onClick={handleDeleteFolder}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
  </div>
)}

{/* ///////////////////////////////////////////////////// Details Panel /////////////////////////////////////////////////////*/}
            <div className={styles.detailsPanel}>
              {isCreatingNewTopic ? (
                <div className={styles.topicFormContent}>
                  <form className={styles.topicForm}>
                    {/* Prioridad */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Prioridad</label>
                      <select className={styles.formSelect}>
                        <option>Normal</option>
                        <option>Alta</option>
                        <option>Baja</option>
                      </select>
                    </div>

                    {/* Áreas */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Áreas</label>
                      <select className={styles.formSelect}>
                        <option>Seleccionar...</option>
                        <option>Marketing</option>
                        <option>Ventas</option>
                        <option>Desarrollo</option>
                      </select>
                    </div>

                    {/* Puestos */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Puestos</label>
                      <select className={styles.formSelect}>
                        <option>--</option>
                        <option>Director</option>
                        <option>Gerente</option>
                        <option>Analista</option>
                      </select>
                    </div>

                    {/* Archivos */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <u>Archivos</u>
                        <span className={styles.multimediaTag}>Multimedia</span>
                      </label>
                      <div className={styles.fileUploadArea}>
                        <div className={styles.uploadIcon}>
                          <Upload size={48} />
                        </div>
                        <p className={styles.uploadText}>Cargar archivos</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tags</label>
                      <select className={styles.formSelect}>
                        <option>Escribe palabras clave</option>
                      </select>
                    </div>

                    {/* Alimentar AI */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Alimentar AI</label>
                      <select className={styles.formSelect}>
                        <option>Selecciona una AI</option>
                        <option>GPT-4</option>
                        <option>Claude</option>
                      </select>
                      <div className={styles.aiSuggestion}>
                        <input 
                          type="checkbox" 
                          id="aiSuggestion" 
                          className={styles.checkbox}
                        />
                        <label htmlFor="aiSuggestion" className={styles.checkboxLabel}>
                          Sugerir en help desk
                        </label>
                      </div>
                    </div>

                    {/* Botón Crear */}
                    <button type="button" className={styles.createButton}>
                      CREAR
                    </button>
                  </form>
                </div>
              ) : selectedFolderDetails ? (
                <>
                  <h3 className={styles.detailsTitle}>DETALLES</h3>
                  <div className={styles.folderDetailsContent}>
                    <div className={styles.folderDetailsIcon}>
                      <Folder size={48} style={{ color: '#6262bf' }} />
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
                </>
              ) : (
                <>
                  <h3 className={styles.detailsTitle}>DETALLES</h3>
                  <div className={styles.detailsPlaceholder}>
                    <div className={styles.detailsIcon}>
                      <Search size={24} style={{ color: 'white' }} />
                    </div>
                    <p className={styles.detailsMessage}>
                      Selecciona un elemento para ver los detalles
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseConocimientos;