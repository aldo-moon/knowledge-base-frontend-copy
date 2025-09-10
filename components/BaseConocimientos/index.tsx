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

// Importar servicios
import { carpetaService } from '../../services/carpetaService';
import { temaService } from '../../services/temaService';
import { archivoService } from '../../services/archivoService';
import { favoritoService } from '../../services/favoritoService';
import { usuarioService } from '../../services/usuarioService';

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

  // Inicializar desde URL al montar el componente
 useEffect(() => {
  const initialize = async () => {
    await initializeFromUrl();
    loadCarpetas();
  };
  
  initialize();
}, [currentFolderId]);

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
  const CURRENT_USER_ID = "68adc29785d92b4c84e01c5b";

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
  const handleThemeFormSubmit = (formData: any) => {
    console.log('Theme form data:', formData);
    // Aquí iría la lógica para crear el tema usando temaService
    // await temaService.createTema(formData);
    navigateBackFromTheme(currentFolderId);
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
        await carpetaService.deleteCarpeta(folderToDelete._id);
        
        setFolders(folders.filter(folder => folder._id !== folderToDelete._id));
        
        setIsDeleteModalOpen(false);
        setFolderToDelete(null);
        await loadCarpetas(); 
        await loadSidebarFolders(); 
        await refreshUserData();
        await loadUserFavorites();
        await loadFavoritesContent();
      } catch (error) {
        console.error('Error deleting folder:', error);
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
const handleDeleteTheme = async () => {
  if (themeToDelete) {
    try {
      console.log(`Eliminando tema: ${themeToDelete.title_name}`);
      await temaService.deleteTema(themeToDelete._id);
      console.log('Tema eliminado exitosamente');
      
      // Actualizar la lista de temas (eliminar del estado local)
      setThemes(themes.filter(theme => theme._id !== themeToDelete._id));
      
      // Cerrar modal y limpiar estado
      setIsDeleteThemeModalOpen(false);
      setThemeToDelete(null);
      
      //recargar todo el contenido para asegurar consistencia
      await loadCarpetas();
      await refreshUserData();
      await loadUserFavorites();
      await loadFavoritesContent(); 
      
    } catch (error) {
      console.error('Error eliminando tema:', error);

    }
  }
};

  // Handler genérico para cerrar modales
  const closeModal = (setModalState, clearDataFunction = null) => {
    setModalState(false);
    if (clearDataFunction) clearDataFunction();
  };


const handleToggleFolderFavorite = async (folderId: string) => {
  try {
    const userId = "68adc29785d92b4c84e01c5b";
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
    const userId = "68adc29785d92b4c84e01c5b";
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
    const userId = "68adc29785d92b4c84e01c5b";
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
    console.log('🔍 content_file del servidor:', fileFavorites);

    // Actualizar estados de favoritos
    if (folderFavorites.length > 0) {
      const folderIds = folderFavorites.map(folder => folder._id);
      setFolderFavorites(new Set(folderIds));
    }

    if (topicFavorites.length > 0) {
      const topicIds = topicFavorites.map(topic => topic._id);
      setThemeFavorites(new Set(topicIds));
    }
    if (fileFavorites.length > 0) {
  const fileIds = fileFavorites.map(file => file._id);
  setFileFavorites(new Set(fileIds));
}else {
  console.log('🔍 No hay archivos favoritos, estado queda vacío');
}

    // Actualizar sidebar con carpetas favoritas
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
  }
};

useEffect(() => {
  console.log('📊 Estado fileFavorites cambió:', Array.from(fileFavorites));
}, [fileFavorites]);

  // Cargar favoritos al inicio
useEffect(() => {
  const initializeData = async () => {
    await Promise.all([
      loadUserFavorites(),
      loadSidebarFolders(),
      refreshUserData()
    ]);
  };
  
  initializeData();
}, []);




  const handleMultimediaUpload = () => {
    console.log('Procesando subida de multimedia...');
    // Aquí puedes agregar la lógica real de subida de archivos
    // Por ejemplo: await archivoService.uploadFile(files);
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
};

const getActiveView = () => {
  // Si está creando tema, usar vista normal
  if (isCreatingTheme) {
    return 'folder';
  }
  
  // Vista específica según la sección activa
  switch (activeSection) {
    case 'Mis archivos':
      return 'user-content';
    
    case 'Favoritos':
      return 'favorites'; 
    
    case 'Contenedor':
    default:
      return 'folder';
  }
};

const loadFavoritesContent = async () => {
  try {
    setFavoritesContentLoading(true);
    setFavoritesContentError(null);
    
    console.log('Cargando contenido completo de favoritos...');
    
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
    const userId = "68adc29785d92b4c84e01c5b";
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
      await favoritoService.addFileToFavorites(userId, fileId);
      setFileFavorites(prev => new Set(prev).add(fileId));
      console.log('Added file to favorites');
    }

    // QUITAR ESTAS LÍNEAS:
    // await loadUserFavorites();
    // await refreshUserData();

    if (activeSection === 'Favoritos') {
      await loadFavoritesContent();
    }
  } catch (error) {
    console.error('Error toggling file favorite:', error);
  }
};

  // ============= RENDER =============
  
  return (
    <div className={styles.baseConocimientos}>
      {/* Usar componente modular HeaderSection */}
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

                
            />

            {/* Details Panel - siempre visible, cambia contenido según el contexto */}
            <DetailsPanel 
              selectedFolderDetails={selectedFolderDetails}
              selectedTemaId={selectedTemaId}
              isCreatingNewTopic={isCreatingTheme}
            >
              {isCreatingTheme && (
                <ThemeForm 
                  onSubmit={handleThemeFormSubmit}
                  onCancel={handleThemeFormCancel}
                />
              )}
            </DetailsPanel>
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