// components/BaseConocimientos/index.tsx - Primera versión modular
import React, { useState, useRef, useEffect } from 'react';
import {Folder} from 'lucide-react';
import styles from '../../styles/base-conocimientos.module.css';

// Importar componentes modulares
import HeaderSection from './Header/HeaderSection';
import MainSidebar from './Navigation/MainSidebar';
import NewFolderModal from './Modals/NewFolderModal';
import FoldersGrid from './Folders/FoldersGrid';
import ThemesGrid from './Themes/ThemesGrid';
import SearchSection from './Search/SearchSection';
import NewButton from './Actions/NewButton';
import Breadcrumb from './Navigation/Breadcrumb';
import ContentSidebar from './Navigation/ContentSidebar';78
import DetailsPanel from './Details/DetailsPanel';
import ThemeForm from './Themes/ThemeForm';
import ThemeEditor from './Themes/ThemeEditor';
import ContentFilters from './Content/ContentFilters';
import ContentArea from './Content/ContentArea';
import RenameFolderModal from './Modals/RenameFolderModal';
import RenameThemeModal from './Modals/RenameThemeModal';
import DeleteFolderModal from './Modals/DeleteFolderModal';
import MultimediaModal from './Modals/MultimediaModal';
import DeleteThemeModal from './Modals/DeleteThemeModal';
import UserContentView from './Content/UserContentView';
import UserFavoritesView from './Content/FavoritesContentView';
import RenameFileModal from './Modals/RenameFileModal';
import DeleteFileModal from './Modals/DeleteFileModal';
import FilesGrid from './Files/FilesGrid';
import ThemeDetailView from './Content/ThemeDetailView';
import ThemeCommentsPanel from './Details/ThemeCommentsPanel';
import { AuthModal } from './Auth/AuthButton';

// Importar servicios
import { carpetaService } from '../../services/carpetaService';
import { temaService } from '../../services/temaService';
import { archivoService } from '../../services/archivoService';
import { favoritoService } from '../../services/favoritoService';
import { usuarioService } from '../../services/usuarioService';
import papeleraService from '../../services/papeleraService';
import { authService } from '../../services/authService';

// Importar hook de routing
import { useBaseConocimientosRouter } from '../../hooks/useBaseConocimientosRouter';

// Interfaces (se podrán mover a un archivo types.ts después)
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

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
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
  // Hook de routing
  const {
    currentFolderId,
    currentThemeId,
    isCreatingTheme,
    isViewingTheme,
    navigationPath,
    activeSection,
    navigateToFolder,
    navigateToTheme,
    navigateToCreateTheme,
    navigateBackFromTheme,
    navigateToSection,
    navigateToThemeDetail,      
    navigateBackFromThemeDetail,
    updateSearchFilters,
    getFiltersFromUrl,
    initializeFromUrl,
    generateShareableUrl
  } = useBaseConocimientosRouter();

  // Estados básicos - inicializar desde URL
  const urlFilters = getFiltersFromUrl();
  const [searchTerm, setSearchTerm] = useState(urlFilters.search);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedFolderDetails, setSelectedFolderDetails] = useState<FolderDetails | null>(null);
  const [selectedTemaId, setSelectedTemaId] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const handleCancelDelete = () => closeModal(setIsDeleteModalOpen, () => setFolderToDelete(null));
  const handleCancelThemeDelete = () => closeModal(setIsDeleteThemeModalOpen, () => setThemeToDelete(null));
  const [fileFavorites, setFileFavorites] = useState(new Set());

  const [showAuthModal, setShowAuthModal] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Estados para componentes modulares
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isMultimediaModalOpen, setIsMultimediaModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isRenameThemeModalOpen, setIsRenameThemeModalOpen] = useState(false);
  const [isRenameFileModalOpen, setIsRenameFileModalOpen] = useState(false);
  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Estados de filtros - inicializar desde URL
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);
  const [activeContentFilters, setActiveContentFilters] = useState<string[]>(urlFilters.activeFilters);
  const [currentSortBy, setCurrentSortBy] = useState(urlFilters.sortBy);
  // Estados para favoritos
  const [folderFavorites, setFolderFavorites] = useState<Set<string>>(new Set());
  const [themeFavorites, setThemeFavorites] = useState<Set<string>>(new Set());

  const [themeTitle, setThemeTitle] = useState('');
  const [themeDescription, setThemeDescription] = useState('');

  // Agregar este estado junto con los otros estados
const [themeToEdit, setThemeToEdit] = useState<Theme | null>(null);
const [isEditingTheme, setIsEditingTheme] = useState(false);

  const [userContent, setUserContent] = useState({
    folders: [],
    themes: [],
    files: []
  }); // Contenido completo del usuario
  const [userContentLoading, setUserContentLoading] = useState(false);
  const [userContentError, setUserContentError] = useState(null);

  const [favoritesContent, setFavoritesContent] = useState({
  folders: [],
  themes: [],
  files: []
});
const [favoritesContentLoading, setFavoritesContentLoading] = useState(false);
const [favoritesContentError, setFavoritesContentError] = useState(null);
const [trashContent, setTrashContent] = useState({
  items: [],
  folders: [],
  themes: [],
  files: []
});
const [trashContentLoading, setTrashContentLoading] = useState(false);
const [trashContentError, setTrashContentError] = useState(null);


  // Inicializar desde URL al montar el componente
 useEffect(() => {
  const initialize = async () => {
    await initializeFromUrl();
    loadCarpetas();
  };
  
  initialize();
}, [currentFolderId]);

// En tu componente principal (index.tsx), agregar este useEffect:

useEffect(() => {
  // Cargar datos cuando cambie activeSection o al inicializar
  const initializeSectionData = async () => {
    if (activeSection === 'Mis archivos') {
      setUserContentLoading(true);
      await refreshUserData();
      setUserContentLoading(false);
    }
    
    if (activeSection === 'Favoritos') {
      await loadFavoritesContent();
    }
    
    // ✅ AGREGAR ESTO:
    if (activeSection === 'Papelera') {
      await loadTrashContent();
    }
  };

  initializeSectionData();
}, [activeSection]); // Ejecutar cuando cambie activeSection


  // Estados de datos
  const [folders, setFolders] = useState([]);
  const [themes, setThemes] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteThemeModalOpen, setIsDeleteThemeModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [themeToDelete, setThemeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarFolders, setSidebarFolders] = useState({});
  const [expandedSidebarItems, setExpandedSidebarItems] = useState({});
  const CURRENT_USER_ID = currentUserId || "68af79255f7ce33d86fc641e";
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


// Verificar autenticación al cargar
useEffect(() => {
  const checkAuth = async () => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentUserId(authService.getCurrentUserId());
    } else {
      setShowAuthModal(true); // Mostrar modal si no está autenticado
    }
  };
  
  checkAuth();
}, []);


const handleAuthSuccess = (userId: string) => {
  setIsAuthenticated(true);
  setCurrentUserId(userId);
  setShowAuthModal(false);
  console.log('✅ Usuario autenticado:', userId);
  
  // Recargar datos si es necesario
  Promise.all([
    loadUserFavorites?.(),
    loadSidebarFolders?.(),
    refreshUserData?.()
  ]).catch(console.error);
};

const handleCloseModal = () => {
  setShowAuthModal(false);
  // Permitir usar la app sin autenticar (modo limitado)
};

  // ============= HANDLERS PARA COMPONENTES MODULARES =============
  
  /////////////////////////////////////////////// Handler para MainSidebar ////////////////////////////////////////////////////
  const handleSidebarItemClick = (item: any, index: number) => {
    console.log(`Clicked sidebar item: ${item.label}`);
  };

  // Handler para NewButton
const handleNewButtonAction = (action: string) => {
  switch(action) {
    case 'new-folder':
      setIsNewFolderModalOpen(true);
      break;
    case 'new-topic':
      setIsEditingTheme(false);
      setThemeToEdit(null);
      setThemeTitle('');
      setThemeDescription('');
      
      navigateToCreateTheme(currentFolderId);
      break;
    case 'multimedia':
      setIsMultimediaModalOpen(true);
      break;
    default:
      console.log(`Acción no implementada: ${action}`);
  }
};

  // Handler para SearchSection
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // Aquí puedes agregar lógica adicional de búsqueda
  };



const handleContentSidebarExpand = async (itemLabel) => {
  setExpandedSidebarItems(prev => ({
    ...prev,
    [itemLabel]: !prev[itemLabel]
  }));

  // Solo cargar si no está expandido y no tiene datos
  if (expandedSidebarItems[itemLabel] || sidebarFolders[itemLabel]) return;

  const loaders = {
    'Contenedor': loadSidebarFolders,
    'Favoritos': loadUserFavorites,
    'Mis archivos': refreshUserData
  };

  const loader = loaders[itemLabel];
  if (loader) await loader();
};


const refreshUserData = async () => {
  try {
    console.log('Actualizando datos del usuario...');
    const userData = await usuarioService.getAllContentByUser(CURRENT_USER_ID);
    
    // Actualizar sidebar
    const transformedFolders = (userData.carpetas || []).map(folder => ({
      _id: folder._id,
      folder_name: folder.folder_name
    }));

    setSidebarFolders(prev => ({
      ...prev,
      'Mis archivos': transformedFolders
    }));

    // Actualizar contenido completo
    setUserContent({
      folders: userData.carpetas || [],
      themes: userData.temas || [],
      files: userData.archivos || []
    });

    console.log('Datos del usuario actualizados');
  } catch (error) {
    console.error("Error actualizando datos del usuario:", error);
  }
};


// Handler actualizado para click en sidebar
const handleContentSidebarItemClick = (item) => {
  // Si hace clic en el item principal, cambiar la sección
  if (item.label === 'Mis archivos' || item.label === 'Contenedor' || item.label === 'Favoritos') {
    handleSectionChange(item.label);
  }
  
  console.log(`Clicked sidebar item: ${item.label}`);
};


  // Handler para Breadcrumb
// ✅ Correcto:
const handleBreadcrumbNavigate = (targetIndex: number) => {
  const targetFolder = navigationPath[targetIndex];
  navigateToFolder(targetFolder.id, targetFolder.name);
};



const handleSubfolderClick = (folderId: string, folderName: string) => {
  console.log('Navegando a carpeta:', folderName, 'ID:', folderId);
  
  // CAMBIO CLAVE: Siempre cambiar a vista de navegación normal cuando se hace clic en una carpeta
  navigateToSection('Contenedor')  

  // Navegar a la carpeta usando tu routing existente
  navigateToFolder(folderId, folderName);
  
  // Limpiar cualquier selección de detalles
  setSelectedFolderDetails(null);
  setSelectedFolder(null);
  setSelectedTemaId(null);
};


  // Handler para ThemeEditor - usar navegación con routing
  const handleThemeEditorSave = (themeData: any) => {
    console.log('Saving theme:', themeData);
    // Aquí iría la lógica para guardar el tema usando temaService
    // await temaService.createTema({...themeData, folder_id: currentFolderId});
    navigateBackFromTheme(currentFolderId);
    // Recargar temas después de crear
    // loadCarpetas();
  };

  const handleThemeEditorBack = () => {
    navigateBackFromTheme(currentFolderId);
  };

  // Handler para ThemeForm (en el DetailsPanel) - usar navegación con routing
const handleThemeFormSubmit = async (formData) => {
  try {
    console.log('📝 Datos del formulario recibidos:', formData);

    // Construir objeto tema con archivos adjuntos
    const temaCompleto = {
      title_name: themeTitle,
      description: themeDescription,
      priority: formData.priority === 'Alta' ? 2 : formData.priority === 'Baja' ? 0 : 1,
      area_id: formData.area,
      puesto_id: formData.position,
      folder_id: currentFolderId,
      author_topic_id: CURRENT_USER_ID,
      keywords: Array.isArray(formData.tags) ? formData.tags : [],
      files_attachment_id: formData.fileIds || []
    };

    console.log('📁 Tema completo:', temaCompleto);
    
    // ✅ AGREGAR LÓGICA PARA MODO EDICIÓN:
    let resultado;
    
    if (isEditingTheme && themeToEdit) {
      // MODO EDICIÓN: Actualizar tema existente
      console.log('🖊️ Actualizando tema existente:', themeToEdit._id);
      resultado = await temaService.updateTema(themeToEdit._id, temaCompleto);
      console.log('✅ Tema actualizado exitosamente:', resultado);
    } else {
      // MODO CREACIÓN: Crear nuevo tema
      console.log('🆕 Creando nuevo tema');
      resultado = await temaService.createTema(temaCompleto);
      console.log('✅ Tema creado exitosamente:', resultado);
    }
    
    // Limpiar estados
    setThemeTitle('');
    setThemeDescription('');
    setIsEditingTheme(false);  // ✅ AGREGAR ESTO
    setThemeToEdit(null);      // ✅ AGREGAR ESTO
    
    // Volver a la vista anterior y recargar contenido
    navigateBackFromTheme(currentFolderId);
    await loadCarpetas();
    
  } catch (error) {
    console.error('❌ Error procesando tema:', error);
  }
};

  const handleThemeFormCancel = () => {
    navigateBackFromTheme(currentFolderId);
  };

  // Handlers para ContentFilters
  const handleToggleFiltersVisibility = () => {
    setAreFiltersVisible(!areFiltersVisible);
  };

  const handleContentFilterClick = (filterLabel: string) => {
    setActiveContentFilters(prev => {
      if (prev.includes(filterLabel)) {
        return prev.filter(f => f !== filterLabel);
      } else {
        return [...prev, filterLabel];
      }
    });
  };

  const handleSortOptionClick = (option: any) => {
    // Si hacen clic en la opción ya seleccionada, desactivar el filtro
    if (currentSortBy === option.label) {
      setCurrentSortBy('Ordenar por');
      console.log('Filtro de ordenamiento desactivado');
    } else {
      // Si seleccionan una opción diferente, activarla
      setCurrentSortBy(option.label);
      console.log(`Ordenando por: ${option.label}`);
    }
  };

  // Handler para FoldersGrid
  const handleFolderSelection = async (folder: Folder) => {
    try {
      const folderDetails = await carpetaService.getCarpetaById(folder._id);
      
      const transformedDetails: FolderDetails = {
        name: folderDetails.folder_name,
        elements: 0,
        creator: folderDetails.user_creator_id?.nombre && folderDetails.user_creator_id?.aPaterno 
          ? `${folderDetails.user_creator_id.nombre} ${folderDetails.user_creator_id.aPaterno}`
          : folderDetails.user_creator_id?.nombre || 'Desconocido',
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

  const handleFolderDoubleClick = async (folder: Folder) => {
    console.log('Double click en carpeta:', folder.folder_name);
    navigateToFolder(folder._id, folder.folder_name);
    setSelectedFolderDetails(null);
  };

const handleFolderMenuAction = (action: string, folder: Folder) => {
  switch(action) {
    case 'rename':
      setSelectedFolder(folder);              // guardamos la carpeta seleccionada
      setIsRenameFolderModalOpen(true);       // abrimos el modal
      break;
    case 'delete':
      setFolderToDelete(folder);
      setIsDeleteModalOpen(true);
      break;
    default:
      break;
  }
};



  // Handler para RenameFolderModal
const handleRenameFolder = async (newName: string) => {
  try {
    if (!selectedFolder) return;

    console.log(`Renombrando carpeta ${selectedFolder._id} -> ${newName}`);

    await carpetaService.updateCarpeta(selectedFolder._id, {
      folder_name: newName,
      description: newName
    });

    setIsRenameFolderModalOpen(false);
    setSelectedFolder(null);

    await loadCarpetas();
    await loadSidebarFolders();
    await refreshUserData();
    await loadUserFavorites();
    await loadFavoritesContent();
  } catch (error) {
    console.error("Error renombrando carpeta:", error);
  }
};


  // Handler para NewFolderModal
const handleCreateFolder = async (folderName) => {
  try {
    console.log(`Creando carpeta: ${folderName}`);

    const carpetaData = {
      folder_name: folderName,
      description: folderName,
      user_creator_id: CURRENT_USER_ID,
      parent_id_folder: currentFolderId || "68acb06886d455d16cceef05"
    };

    const nuevaCarpeta = await carpetaService.createCarpeta(carpetaData);
    setIsNewFolderModalOpen(false);
    
    // Solo estas dos llamadas:
    await loadCarpetas();      // Recarga contenido actual
    await loadSidebarFolders(); // Recarga sidebar "Contenedor"
    await refreshUserData();   // Actualiza sidebar "Mis archivos" + contenido completo
    await loadUserFavorites();
  } catch (error) {
    console.error('Error creating folder:', error);
  }
};

const handleDeleteFolder = async () => {
  if (folderToDelete) {
    try {
      await carpetaService.moveToTrash(folderToDelete._id, CURRENT_USER_ID);

      setFolders(folders.filter(folder => folder._id !== folderToDelete._id));

      setIsDeleteModalOpen(false);
      setFolderToDelete(null);

      await loadCarpetas();
      await loadSidebarFolders();
      await refreshUserData();
      await loadUserFavorites();
      await loadFavoritesContent();
    } catch (error) {
      console.error('Error moviendo carpeta a la papelera:', error);
    }
  }
};

    // Handler para ThemesGrid
    const handleThemeSelection = (theme: any) => {
      console.log('Tema seleccionado:', theme.title_name);
      // ✅ Guardamos el id del tema para que el DetailsPanel lo cargue
      setSelectedTemaId(theme._id);
      // ❌ Limpiamos lo de carpeta, porque ahora estamos viendo un tema
      setSelectedFolderDetails(null);
      setSelectedFolder(null);
    };


const handleThemeMenuAction = (action: string, theme: Theme) => {
  switch (action) {
    case "rename":
      setSelectedTheme(theme);
      setIsRenameThemeModalOpen(true);
      break;
    case "delete":
      setThemeToDelete(theme);
      setIsDeleteThemeModalOpen(true); 
      break;
    default:
      break;
  }
};

const handleRenameTheme = async (newName: string) => {
  try {
    if (!selectedTheme) return;

    console.log(`Renombrando tema ${selectedTheme._id} -> ${newName}`);

    await temaService.updateTema(selectedTheme._id, {
      title_name: newName,
      description: newName,
    });

    setIsRenameThemeModalOpen(false);
    setSelectedTheme(null);
    await loadCarpetas();
    await refreshUserData();
    await loadUserFavorites();
    await loadFavoritesContent(); 
  } catch (error) {
    console.error("Error renombrando tema:", error);
  }
};



//  Handler para confirmar eliminación del tema
//  Handler para confirmar "eliminación" (mover a papelera) del tema
const handleDeleteTheme = async () => {
  if (themeToDelete) {
    try {
      console.log(`Moviendo tema a papelera: ${themeToDelete.title_name}`);
      
      await temaService.moveToTrash(themeToDelete._id, CURRENT_USER_ID);
      
      console.log('Tema movido a la papelera exitosamente');
      
      // Actualizar la lista de temas (eliminar del estado local)
      setThemes(themes.filter(theme => theme._id !== themeToDelete._id));
      
      setIsDeleteThemeModalOpen(false);
      setThemeToDelete(null);
      
      await loadCarpetas();
      await refreshUserData();
      await loadUserFavorites();
      await loadFavoritesContent(); 
      
    } catch (error) {
      console.error('Error al mover tema a la papelera:', error);
    }
  }
};


// AGREGAR función para manejar doble click en temas
const handleThemeDoubleClick = (theme: Theme) => {
  console.log('Doble click en tema:', theme.title_name);
  navigateToThemeDetail(theme._id);
};

// AGREGAR handlers para acciones desde la vista detallada
const handleThemeEditFromDetail = (theme: Theme) => {
  // Usar la lógica existente de edición
  setSelectedTheme(theme);
  setIsRenameThemeModalOpen(true);
};

const handleThemeDeleteFromDetail = (theme: Theme) => {
  // Usar la lógica existente de eliminación
  setThemeToDelete(theme);
  setIsDeleteThemeModalOpen(true);
};



  // Handler genérico para cerrar modales
  const closeModal = (setModalState, clearDataFunction = null) => {
    setModalState(false);
    if (clearDataFunction) clearDataFunction();
  };


const handleToggleFolderFavorite = async (folderId: string) => {
  try {
    const userId = CURRENT_USER_ID;
    const isFavorite = folderFavorites.has(folderId);

    if (isFavorite) {
      await favoritoService.removeFolderFromFavorites(userId, folderId);

      setFolderFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(folderId);
        return newSet;
      });

      console.log('Removed from favorites');

    } else {
      await favoritoService.addFolderToFavorites(userId, folderId);

      setFolderFavorites(prev => new Set(prev).add(folderId));

      console.log('Added to favorites');
    }

    await loadUserFavorites();
    await refreshUserData();

    if (activeSection === 'Favoritos') {
      await loadFavoritesContent();
    }
  } catch (error) {
    console.error('Error toggling folder favorite:', error);
  }
};


const handleToggleThemeFavorite = async (themeId: string) => {
  try {
    const userId = CURRENT_USER_ID;
    const isFavorite = themeFavorites.has(themeId);
    
    if (isFavorite) {
      await favoritoService.removeTopicFromFavorites(userId, themeId);
      setThemeFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(themeId);
        return newSet;
      });
      console.log('Removed topic from favorites');
    } else {
      await favoritoService.addTopicToFavorites(userId, themeId);
      setThemeFavorites(prev => new Set(prev).add(themeId));
      console.log('Added topic to favorites');
    }

  } catch (error) {
    console.error('Error toggling theme favorite:', error);
  }
};


// Función para cargar favoritos
const loadUserFavorites = async () => {
  try {
    const userId = CURRENT_USER_ID;

    
    const favoritesResponse = await favoritoService.getFavoritoById(userId);


    if (!favoritesResponse) {
      console.log('No hay favoritos para este usuario');
      return;
    }

    let favorites = null;
    
    if (Array.isArray(favoritesResponse)) {
      if (favoritesResponse.length === 0) {
        console.log('Usuario sin favoritos guardados');
        return;
      }
      favorites = favoritesResponse[0];
    } else if (typeof favoritesResponse === 'object') {
      favorites = favoritesResponse;
    } else {
      return;
    }

    if (!favorites || typeof favorites !== 'object') {
      return;
    }

    const folderFavorites = favorites.content_folder || [];
    const topicFavorites = favorites.content_topic || [];
    const fileFavorites = favorites.content_file || [];


    // Siempre actualizar estados
    const folderIds = folderFavorites.map(folder => folder._id);
    setFolderFavorites(new Set(folderIds));

    const topicIds = topicFavorites.map(topic => topic._id);
    setThemeFavorites(new Set(topicIds));

    const fileIds = fileFavorites.map(file => file._id);
    setFileFavorites(new Set(fileIds));


    // Actualizar sidebar
    const favFolders = folderFavorites.map(folder => ({
      _id: folder._id,
      folder_name: folder.folder_name || `Carpeta ${folder._id.slice(-6)}`
    }));

    if (favFolders.length > 0) {
      setSidebarFolders(prev => ({
        ...prev,
        Favoritos: favFolders
      }));
    }

  } catch (error) {
    console.error("Error loading favorites:", error);
    setFolderFavorites(new Set());
    setThemeFavorites(new Set());
    setFileFavorites(new Set());
  }
};


  // Cargar favoritos al inicio
useEffect(() => {
  const initializeData = async () => {
      await Promise.all([
      loadUserFavorites(),     // Carga estados de favoritos
      loadSidebarFolders(),    // Carga sidebar
      refreshUserData(),       // Carga contenido del usuario  
      loadFavoritesContent()   // Carga contenido completo de favoritos
    ]);
  };
  
  initializeData();
}, []);




const handleMultimediaUpload = async (files: FileList) => {
  try {
    console.log('📁 Subiendo archivos a carpeta:', currentFolderId);
    console.log('👤 Usuario:', CURRENT_USER_ID);
    console.log('📄 Archivos:', files.length);
    
    // Convertir FileList a Array para el servicio
    const filesArray = Array.from(files);
    
    // Subir archivos usando el servicio
    const response = await archivoService.uploadArchivos(
      filesArray,
      currentFolderId || "68acb06886d455d16cceef05", // Carpeta actual o root
      CURRENT_USER_ID
    );
    
    console.log('✅ Respuesta del servidor:', response);
    
    // Recargar contenido para mostrar los archivos nuevos
    await loadCarpetas();
    
    // Actualizar datos del usuario si está en "Mis archivos"
    if (activeSection === 'Mis archivos') {
      await refreshUserData();
    }
    
    // Mostrar mensaje de éxito (opcional)
    // Puedes agregar aquí una notificación toast si tienes sistema de notificaciones
    
  } catch (error) {
    console.error('❌ Error al subir archivos:', error);
    
    // Aquí puedes mostrar un mensaje de error al usuario
    // Por ejemplo, si tienes un sistema de notificaciones:
    // showErrorNotification('Error al subir archivos. Inténtalo de nuevo.');
    
    throw error; // Re-lanzar para que el modal pueda manejarlo
  }
};


  const loadCarpetas = async () => {
    
     console.log('Loading content for folder:', currentFolderId);
  try {
    setLoading(true);
    
    const carpetas = await carpetaService.getFolderContent(currentFolderId);
    console.log('Loaded carpetas:', carpetas.length);
    setFolders(carpetas);
      
      const temas = await temaService.getTemasByFolder(currentFolderId);
      setThemes(temas);

      const archivos = await archivoService.getFilesByFolderId(currentFolderId);
    setFiles(archivos);
    } catch (error) {
      console.error('Error loading content:', error);
      setFolders([]);
      setThemes([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };



  const loadSidebarFolders = async () => {
    try {
      const response = await carpetaService.getFolderContent("68acb06886d455d16cceef05");
      setSidebarFolders({ 'Contenedor': response });
    } catch (error) {
      console.error('Error loading sidebar folders:', error);
    }
  };


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
        [folderId]: []
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
    
    if (!expandedSidebarItems[key] && !sidebarFolders[folderId]) {
      await loadSubfolderContent(folderId, folderName);
    }
  };

const handleSectionChange = async (sectionName) => {
  console.log('Cambiando a sección:', sectionName);
  
  // Usar la función del hook
  navigateToSection(sectionName);
  
  // Cargar contenido según la sección
  if (sectionName === 'Mis archivos') {
    setUserContentLoading(true);
    await refreshUserData();
    setUserContentLoading(false);
  }
  
  if (sectionName === 'Favoritos') {
    await loadFavoritesContent();
  }

  if (sectionName === 'Papelera') {
    await loadTrashContent();
  }
};

// Agregar esta función en tu componente principal
const getActiveView = () => {
  if (isCreatingTheme) {
    return 'folder';
  }

  switch (activeSection) {
    case 'theme-detail':
      return 'theme-detail';
    case 'Mis archivos':
      return 'user-content';
    case 'Favoritos':
      return 'favorites';
    case 'Papelera':  
      return 'trash';
    default:
      return 'folder';
  }
};


const loadFavoritesContent = async () => {
  try {
    setFavoritesContentLoading(true);
    setFavoritesContentError(null);
    

    
    const favoritesResponse = await favoritoService.getFavoritoById(CURRENT_USER_ID);


    if (!favoritesResponse) {
      setFavoritesContent({ folders: [], themes: [], files: [] }); // Agregar files
      return;
    }

    let favorites = null;
    if (Array.isArray(favoritesResponse)) {
      if (favoritesResponse.length === 0) {
        setFavoritesContent({ folders: [], themes: [], files: [] });
        return;
      }
      favorites = favoritesResponse[0];
    } else {
      favorites = favoritesResponse;
    }

    const folderFavorites = favorites.content_folder || [];
    const topicFavorites = favorites.content_topic || [];
    const fileFavorites = favorites.content_file || []; // Nuevo


    // Obtener datos completos
    const folderDetails = await Promise.all(
      folderFavorites.map(async (folder) => {
        try {
          return await carpetaService.getCarpetaById(folder._id);
        } catch (error) {
          return { _id: folder._id, folder_name: folder.folder_name };
        }
      })
    );

    const themeDetails = await Promise.all(
      topicFavorites.map(async (theme) => {
        try {
          return await temaService.getTemaById(theme._id);
        } catch (error) {
          return { _id: theme._id, title_name: theme.title_name };
        }
      })
    );

    // Nuevo: obtener datos de archivos favoritos
    const fileDetails = await Promise.all(
      fileFavorites.map(async (file) => {
        try {
          return await archivoService.getArchivoById(file._id);
        } catch (error) {
          return { _id: file._id, file_name: file.file_name };
        }
      })
    );

    setFavoritesContent({
      folders: folderDetails,
      themes: themeDetails,
      files: fileDetails // Agregar archivos
    });

    console.log('🔍 setFavoritesContent llamado con files:', fileDetails);

  } catch (error) {
    console.error('Error cargando contenido de favoritos:', error);
    setFavoritesContentError('Error al cargar el contenido de favoritos');
    setFavoritesContent({ folders: [], themes: [], files: [] });
  } finally {
    setFavoritesContentLoading(false);
  }
};


/////////////////////////////////////////MULTIMEDIA Y ARCHIVOS /////////////////////////////////////////////////////////////////////////////////////////////

// Handlers
const handleFileSelection = (file) => {
  console.log('Archivo seleccionado:', file.file_name);
  // Lógica para mostrar detalles del archivo
};

const handleFileDoubleClick = (file) => {
  console.log('Doble click en archivo:', file.file_name);
  // Lógica para abrir/descargar archivo
};

const handleFileMenuAction = (action, file) => {
  switch(action) {
    case 'rename':
      setSelectedFile(file);
      setIsRenameFileModalOpen(true);
      break;
    case 'delete':
      setFileToDelete(file);
      setIsDeleteFileModalOpen(true);
      break;
  }
};


////////////////////////////  Handler para RENOMBRAR Y ELIMINAR //// ////////////////////////////////

const handleRenameFile = async (newName) => {
  try {
    if (!selectedFile) return;

    console.log(`Renombrando archivo ${selectedFile._id} -> ${newName}`);

    await archivoService.updateArchivoById(selectedFile._id, {
      file_name: newName
    });

    setIsRenameFileModalOpen(false);
    setSelectedFile(null);

    // Recargar archivos después de renombrar
    await loadCarpetas();
    
    // Actualizar "Mis archivos" si está activo
    if (activeSection === 'Mis archivos') {
      await refreshUserData();
    }

  } catch (error) {
    console.error("Error renombrando archivo:", error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};

const handleDeleteFile = async () => {
  if (fileToDelete) {
    try {
      console.log(`Eliminando archivo: ${fileToDelete.file_name}`);
      
      await archivoService.deleteArchivoById(fileToDelete._id);
      console.log('Archivo eliminado exitosamente');
      
      // Actualizar la lista local de archivos
      setFiles(files.filter(file => file._id !== fileToDelete._id));
      
      // Cerrar modal y limpiar estado
      setIsDeleteFileModalOpen(false);
      setFileToDelete(null);
      
      // Recargar contenido para asegurar consistencia
      await loadCarpetas();
      
      // Actualizar "Mis archivos" si está activo
      if (activeSection === 'Mis archivos') {
        await refreshUserData();
      }
      
    } catch (error) {
      console.error('Error eliminando archivo:', error);
    }
  }
};

const handleCancelRenameFile = () => {
  setIsRenameFileModalOpen(false);
  setSelectedFile(null);
};

const handleCancelDeleteFile = () => {
  setIsDeleteFileModalOpen(false);
  setFileToDelete(null);
};





/////////////////////////////////////////// handlers Para AGREGAR A FAVORITOS ////////////////////////////////////////////////////////////////////////////////////////////////////////

// Handler para favoritos de archivos
const handleToggleFileFavorite = async (fileId) => {
  try {
    const userId = CURRENT_USER_ID;
    const isFavorite = fileFavorites.has(fileId);
    
    if (isFavorite) {
      await favoritoService.removeFileFromFavorites(userId, fileId);
      setFileFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      console.log('Removed file from favorites');
    } else {
      try {
        await favoritoService.addFileToFavorites(userId, fileId);
        setFileFavorites(prev => new Set(prev).add(fileId));
        console.log('Added file to favorites');
      } catch (error) {
        if (error.response?.status === 409) {
          // El archivo ya estaba en favoritos, solo sincronizar estado local
          setFileFavorites(prev => new Set(prev).add(fileId));
          console.log('Archivo ya estaba en favoritos, estado sincronizado');
        } else {
          throw error; // Re-lanzar otros errores
        }
      }
    }

  } catch (error) {
    console.error('Error toggling file favorite:', error);
  }
};







const loadTrashContent = async () => {
  try {
    setTrashContentLoading(true);
    setTrashContentError(null);
    
    console.log('🗑️ Cargando papelera para usuario:', CURRENT_USER_ID);
    
    // Obtener elementos de papelera del usuario
    const trashItems = await papeleraService.getPapelerasByUser(CURRENT_USER_ID);
    
    console.log('🗑️ Items de papelera recibidos:', trashItems);
    
    // Separar por tipo - USANDO MAYÚSCULAS
    const folderIds = trashItems.filter(item => item.type_content === 'Carpeta');
    const themeIds = trashItems.filter(item => item.type_content === 'Tema');
    const fileIds = trashItems.filter(item => item.type_content === 'Archivo');
    
    console.log('🔍 Elementos por tipo:', {
      carpetas: folderIds.length,
      temas: themeIds.length, 
      archivos: fileIds.length
    });
    
    // ✅ CREAR OBJETOS BÁSICOS EN LUGAR DE LLAMAR A LOS SERVICIOS
    // porque el contenido "eliminado" puede no existir en su estado normal
    
// Cambiar las llamadas en loadTrashContent:
const folders = await Promise.all(
  folderIds.map(async (item) => {
    try {
      const folderData = await carpetaService.getCarpetaByIdPapelera(item.content_id);
      return {
        ...folderData,
        trash_id: item._id,
        trash_type: item.type_content
      };
    } catch (error) {
      console.log(`⚠️ Carpeta ${item.content_id} no encontrada en papelera`);
      return null;
    }
  })
);

const themes = await Promise.all(
  themeIds.map(async (item) => {
    try {
      const themeData = await temaService.getTemaByIdPapelera(item.content_id);
      return {
        ...themeData,
        trash_id: item._id,
        trash_type: item.type_content
      };
    } catch (error) {
      console.log(`⚠️ Tema ${item.content_id} no encontrado en papelera`);
      return null;
    }
  })
);
    
    const files = fileIds.map(item => ({
      _id: item.content_id,
      file_name: `Archivo eliminado`, // Nombre genérico
      creation_date: item.expireAt || new Date().toISOString(),
      // Agregar referencia a la papelera
      trash_id: item._id,
      trash_type: item.type_content
    }));
    
    setTrashContent({
      items: trashItems,
      folders: folders,
      themes: themes,
      files: files
    });
    
    console.log('✅ Datos de papelera procesados:', {
      items: trashItems.length,
      folders: folders.length,
      themes: themes.length,
      files: files.length
    });
    
  } catch (error) {
    console.error('❌ Error cargando papelera:', error);
    setTrashContentError('Error al cargar la papelera');
  } finally {
    setTrashContentLoading(false);
  }
};


// Agregar esta función junto con tus otros handlers
const handleThemeEdit = (theme: Theme) => {
  console.log('🖊️ Editando tema:', theme);
  
  // Guardar tema a editar en estado
  setThemeToEdit(theme);
  setIsEditingTheme(true);
  
  // Pre-llenar datos en el editor
  setThemeTitle(theme.title_name);
  setThemeDescription(theme.description || '');
  
  // Navegar a modo edición (usando la función que ya tienes)
  navigateToEditTheme(theme._id);
};

// Agregar esta función junto con tus otras funciones de navegación
const navigateToEditTheme = (themeId: string) => {
  // Por ahora, puedes reutilizar la navegación existente
  // Más adelante agregaremos la ruta específica
  navigateToCreateTheme(currentFolderId);
};

  // ============= RENDER =============
  if (!mounted) {
  return <div>Loading...</div>;
}
  return (
  <div className={styles.baseConocimientos}>
    {/* Todo tu contenido existente */}
    
    {/* 🆕 Solo agregar esto al final */}
    <AuthModal
      isOpen={showAuthModal}
      onClose={handleCloseModal}
      onAuthSuccess={handleAuthSuccess}
    />      {/* Usar componente modular HeaderSection */}
      <HeaderSection />

      <div className={styles.mainContentWrapper}>
        {/* Usar componente modular MainSidebar */}
        <MainSidebar onItemClick={handleSidebarItemClick} />

        <div className={styles.mainContent}>
          {/* Search and New Button Area */}
          <div className={styles.searchContainer}>
            <NewButton onOptionClick={handleNewButtonAction} />
            <SearchSection 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Content Area - completamente modular */}
          <div className={styles.contentArea}>
            {/* Content Sidebar */}
            <ContentSidebar 
              sidebarFolders={sidebarFolders}
              expandedSidebarItems={expandedSidebarItems}
              activeSection={activeSection} // Este viene del hook ahora
              onItemClick={handleContentSidebarItemClick}
              onSubfolderClick={handleSubfolderClick}
              onExpandClick={handleContentSidebarExpand}
              onSubfolderExpand={handleSubfolderExpandClick}
              onSectionChange={handleSectionChange}
            />
            
            {/* Content Area Principal */}
            <ContentArea 
              folders={folders}
              themes={themes}
              files={files}
              loading={loading}
              error={error}
              folderFavorites={folderFavorites}
              themeFavorites={themeFavorites}
              fileFavorites={fileFavorites} 
              navigationPath={navigationPath}
              onNavigate={handleBreadcrumbNavigate}
              isCreatingNewTopic={isCreatingTheme}
              areFiltersVisible={areFiltersVisible}
              activeContentFilters={activeContentFilters}
              currentSortBy={currentSortBy}
              onToggleFiltersVisibility={handleToggleFiltersVisibility}
              onFilterClick={handleContentFilterClick}
              onSortOptionClick={handleSortOptionClick}
              onFolderSelect={handleFolderSelection}
              onFolderDoubleClick={handleFolderDoubleClick}
              onFolderMenuAction={handleFolderMenuAction}
              onToggleFolderFavorite={handleToggleFolderFavorite} 
              onToggleThemeFavorite={handleToggleThemeFavorite}
              onThemeSelect={handleThemeSelection}
              onThemeMenuAction={handleThemeMenuAction}
              onThemeDoubleClick={handleThemeDoubleClick} 
              onThemeEditorBack={handleThemeEditorBack}
              onThemeEditorSave={handleThemeEditorSave}
              userContent={userContent}
              userContentLoading={userContentLoading}
              userContentError={userContentError}
              activeView={getActiveView()}
              favoritesContent={favoritesContent}
              favoritesContentLoading={favoritesContentLoading}
              favoritesContentError={favoritesContentError}
              onToggleFileFavorite={handleToggleFileFavorite} 
              onFileMenuAction={handleFileMenuAction} 
              onFileSelect={handleFileSelection}
              themeTitle={themeTitle}
              themeDescription={themeDescription}
              onThemeTitleChange={setThemeTitle}
              onThemeDescriptionChange={setThemeDescription}
              viewingThemeId={currentThemeId}
              onThemeDetailBack={navigateBackFromThemeDetail}
              onThemeEdit={handleThemeEditFromDetail}
              onThemeDelete={handleThemeDeleteFromDetail}
              onRestoreItem={() => {}}
              onPermanentDelete={() => {}}
              onEmptyTrash={() => {}}
              onRestoreSelected={() => {}}
              onDeleteSelected={() => {}}
              trashContent={trashContent}
              trashContentLoading={trashContentLoading}
              trashContentError={trashContentError}
              onThemeEdit={handleThemeEdit}  // ✅ AGREGAR ESTA LÍNEA

            />

            {/* Details Panel - siempre visible, cambia contenido según el contexto */}
            {/* Panel derecho - cambiar según el contexto */}
            {activeSection === 'theme-detail' && currentThemeId ? (  // Mostrar panel de comentarios cuando estás viendo un tema
              <ThemeCommentsPanel themeId={currentThemeId} />
            ) : (
              // Mostrar DetailsPanel normal para otras vistas
              <DetailsPanel 
                selectedFolderDetails={selectedFolderDetails}
                selectedTemaId={selectedTemaId}
                isCreatingNewTopic={isCreatingTheme}
                isEditingTheme={isEditingTheme}
                themeToEdit={themeToEdit}
              >
              {isCreatingTheme && (
                  <ThemeForm 
                    onSubmit={handleThemeFormSubmit}
                    onCancel={handleThemeFormCancel}
                    currentFolderId={currentFolderId || "68acb06886d455d16cceef05"}
                    userId={CURRENT_USER_ID}
                    isEditMode={isEditingTheme}
                    themeToEdit={themeToEdit}
                  />
                )}
              </DetailsPanel>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Renombrar Carpeta */}
      <RenameFolderModal
        isOpen={isRenameFolderModalOpen}
        onClose={() => setIsRenameFolderModalOpen(false)}
        onRenameFolder={handleRenameFolder}
        currentName={selectedFolder?.folder_name || ""}
      />

      {/* Modal para Renombrar Tema */}
      <RenameThemeModal
        isOpen={isRenameThemeModalOpen}
        onClose={() => setIsRenameThemeModalOpen(false)}
        onRenameTheme={handleRenameTheme}
        currentName={selectedTheme?.title_name || ""}
      />

      {/* Modal para crear nuevo Folder */}
      <NewFolderModal 
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      {/*  Modal para Eliminar Carpeta */}
      <DeleteFolderModal 
        isOpen={isDeleteModalOpen}
        folderToDelete={folderToDelete}
        onConfirmDelete={handleDeleteFolder}
        onCancel={handleCancelDelete}
      />

      {/* Modal de Multimedia  */}
      <MultimediaModal 
        isOpen={isMultimediaModalOpen}
        onClose={() => setIsMultimediaModalOpen(false)}
        onUpload={handleMultimediaUpload}
        currentFolderId={currentFolderId || "68acb06886d455d16cceef05"}
        userId={CURRENT_USER_ID}
      />

      {/* Modal para Eliminar Tema */}
      <DeleteThemeModal 
        isOpen={isDeleteThemeModalOpen}
        themeToDelete={themeToDelete}
        onConfirmDelete={handleDeleteTheme}
        onCancel={handleCancelThemeDelete}
      />

      <RenameFileModal 
        isOpen={isRenameFileModalOpen}
        onClose={handleCancelRenameFile}
        onRenameFile={handleRenameFile}
        currentName={selectedFile?.file_name || ''}
      />

      <DeleteFileModal 
        isOpen={isDeleteFileModalOpen}
        fileToDelete={fileToDelete}
        onConfirmDelete={handleDeleteFile}
        onCancel={handleCancelDeleteFile}
      />
    </div>
  );
};

export default BaseConocimientos;