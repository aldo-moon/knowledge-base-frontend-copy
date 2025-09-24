// hooks/useBaseConocimientosRouter.ts
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { carpetaService } from './../services/carpetaService';

interface NavigationPath {
  id: string;
  name: string;
}

export const useBaseConocimientosRouter = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [navigationPath, setNavigationPath] = useState<NavigationPath[]>([
    { id: "68acb06886d455d16cceef05", name: "Contenedor" }
  ]);

  const navigateToEditTheme = (themeId: string) => {
  const currentQuery = { ...router.query };
  delete currentQuery.slug;
  
  const url = `/edit-theme/${themeId}`;
  const queryString = Object.keys(currentQuery).length > 0 
    ? '?' + Object.entries(currentQuery).map(([k, v]) => `${k}=${v}`).join('&')
    : '';
  
  router.push(url + queryString, undefined, { shallow: true });
};

  // Parsear la URL desde el slug
// Parsear la URL desde el slug
const parseSlugFromUrl = () => {
  if (!slug || !Array.isArray(slug)) {
    return {
      folderId: "68acb06886d455d16cceef05",
      themeId: null,
      isCreatingTheme: false,
          isEditingTheme:true, // Nuevo estado
      isViewingTheme: false,
      activeSection: 'Contenedor'
      
    };
  }

  let folderId = "68acb06886d455d16cceef05";
  let themeId = null;
  let isCreatingTheme = false;
  let  isEditingTheme = true;  // Nuevo estado

  let isViewingTheme = false;
  let activeSection = 'Contenedor';

  // Verificar secciones especiales primero
  if (slug[0] === 'mis-archivos') {
    activeSection = 'Mis archivos';
    return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection };
  }

  if (slug[0] === 'favoritos') {
    activeSection = 'Favoritos';
    return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection };
  }

  // AGREGAR: Verificar vista de tema detallada
  if (slug[0] === 'theme-detail' && slug[1]) {
    themeId = slug[1] as string;
    isViewingTheme = true;
    activeSection = 'theme-detail';
    return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection };
  }

  if (slug[0] === 'papelera') {
  activeSection = 'Papelera';
  return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection };
}

  // Verificación para folder (lógica existente)
  if (slug[0] === 'folder' && slug[1]) {
    folderId = slug[1] as string;
    activeSection = 'Contenedor';
  }

  if (slug.includes('theme') && slug.length >= 2) {
    const themeIndex = slug.indexOf('theme');
    themeId = slug[themeIndex + 1] as string;
    isViewingTheme = true;
  }

  if (slug.includes('new-theme')) {
    isCreatingTheme = true;
  }

  // En parseSlugFromUrl, agregar:
  if (slug[0] === 'edit-theme' && slug[1]) {
    themeId = slug[1] as string;
    isCreatingTheme = true; // Reutilizar el mismo estado
    isEditingTheme = true;  // Nuevo estado
    activeSection = 'edit-theme';
    return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection, isEditingTheme };
  }

  return { folderId, themeId, isCreatingTheme, isViewingTheme, activeSection };
};

  // 🆕 Navegar a secciones especiales
  const navigateToSection = (sectionName: string) => {
    const currentQuery = { ...router.query };
    delete currentQuery.slug; // Limpiar slug
    
    let url;
    switch (sectionName) {
      case 'Mis archivos':
        url = '/mis-archivos';
        break;
      case 'Favoritos':
        url = '/favoritos';
        break;
      case 'Contenedor':
      default:
        url = '';
        break;
        case 'Papelera':
        url = '/papelera';
        break;
    }
    
    const queryString = Object.keys(currentQuery).length > 0 
      ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
      : '';
    
    router.push(`${url}${queryString}`);
  };

  // Construir path de navegación desde URL (lógica existente)
  const buildNavigationPathFromUrl = async (targetFolderId: string) => {
    try {
      if (targetFolderId === "68acb06886d455d16cceef05") {
        return [{ id: "68acb06886d455d16cceef05", name: "Contenedor" }];
      }

      try {
        const response = await fetch(`/api/carpetas/test/${targetFolderId}`);
        if (response.ok) {
          const data = await response.json();
          return data.ruta || await buildPathManually(targetFolderId);
        }
      } catch {
        return await buildPathManually(targetFolderId);
      }
      
      return await buildPathManually(targetFolderId);
    } catch (error) {
      console.error('Error building navigation path:', error);
      return [
        { id: "68acb06886d455d16cceef05", name: "Contenedor" },
        { id: targetFolderId, name: "Carpeta" }
      ];
    }
  };

  // Función auxiliar para construir ruta manualmente (lógica existente)
  const buildPathManually = async (targetFolderId: string) => {
    try {
      const path = [{ id: "68acb06886d455d16cceef05", name: "Contenedor" }];
      
      const folderDetails = await carpetaService.getCarpetaById(targetFolderId);
      
      if (folderDetails.parent_id_folder && folderDetails.parent_id_folder !== "68acb06886d455d16cceef05") {
        const parentPath = await buildPathManually(folderDetails.parent_id_folder);
        const pathWithoutRoot = parentPath.slice(1);
        path.push(...pathWithoutRoot);
      }
      
      path.push({ 
        id: targetFolderId, 
        name: folderDetails.folder_name 
      });
      
      return path;
    } catch (error) {
      console.error('Error building path manually:', error);
      return [
        { id: "68acb06886d455d16cceef05", name: "Contenedor" },
        { id: targetFolderId, name: "Carpeta" }
      ];
    }
  };
  
  // Navegar a carpeta (lógica existente pero actualizada)
  const navigateToFolder = (folderId: string, folderName: string) => {
    const currentQuery = { ...router.query };
    delete currentQuery.slug;
    
    if (folderId === "68acb06886d455d16cceef05") {
      router.push({
        pathname: '',
        query: currentQuery
      });
    } else {
      const queryString = Object.keys(currentQuery).length > 0 
        ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
        : '';
      
      router.push(`/folder/${folderId}${queryString}`);
    }
  };
  
  // Navegar a tema (lógica existente)
  const navigateToTheme = (themeId: string, currentFolderId?: string) => {
    const currentQuery = { ...router.query };
    delete currentQuery.slug;
    
    let url;
    if (currentFolderId && currentFolderId !== "68acb06886d455d16cceef05") {
      url = `/folder/${currentFolderId}/theme/${themeId}`;
    } else {
      url = `/theme/${themeId}`;
    }
    
    const queryString = Object.keys(currentQuery).length > 0 
      ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
      : '';
    
    router.push(`${url}${queryString}`);
  };

  // Navegar a creación de tema (lógica existente)
  const navigateToCreateTheme = (currentFolderId?: string) => {
    const currentQuery = { ...router.query };
    delete currentQuery.slug;
    
    let url;
    if (currentFolderId && currentFolderId !== "68acb06886d455d16cceef05") {
      url = `/folder/${currentFolderId}/new-theme`;
    } else {
      url = `/new-theme`;
    }
    
    const queryString = Object.keys(currentQuery).length > 0 
      ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
      : '';
    
    router.push(`${url}${queryString}`);
  };

  // Volver a la carpeta (lógica existente)
  const navigateBackFromTheme = (currentFolderId?: string) => {
    const currentQuery = { ...router.query };
    delete currentQuery.slug;
    
    let url;
    if (currentFolderId && currentFolderId !== "68acb06886d455d16cceef05") {
      url = `/folder/${currentFolderId}`;
    } else {
      url = ``;
    }
    
    const queryString = Object.keys(currentQuery).length > 0 
      ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
      : '';
    
    router.push(`${url}${queryString}`);
  };
  
  // Actualizar filtros en URL (lógica existente)
  const updateSearchFilters = (filters: {
    search?: string;
    activeFilters?: string[];
    sortBy?: string;
  }) => {
    const query = { ...router.query };
    
    if (filters.search !== undefined) {
      if (filters.search) {
        query.q = filters.search;
      } else {
        delete query.q;
      }
    }
    
    if (filters.activeFilters !== undefined) {
      if (filters.activeFilters.length > 0) {
        query.filters = filters.activeFilters.join(',');
      } else {
        delete query.filters;
      }
    }
    
    if (filters.sortBy !== undefined) {
      if (filters.sortBy && filters.sortBy !== 'Ordenar por') {
        query.sortBy = filters.sortBy;
      } else {
        delete query.sortBy;
      }
    }
    
    router.replace({
      pathname: router.asPath.split('?')[0],
      query
    }, undefined, { shallow: true });
  };
  
  // Obtener filtros desde URL (lógica existente)
  const getFiltersFromUrl = () => {
    return {
      search: (router.query.q as string) || '',
      activeFilters: router.query.filters ? 
        (router.query.filters as string).split(',').filter(Boolean) : [],
      sortBy: (router.query.sortBy as string) || 'Ordenar por'
    };
  };

  // Obtener contexto actual (actualizado)
  const currentContext = parseSlugFromUrl();

  // Inicializar navegación desde URL (actualizado)
  const initializeFromUrl = async () => {
    // 🆕 Para secciones especiales, no construir path de carpetas
    if (currentContext.activeSection === 'Mis archivos' || currentContext.activeSection === 'Favoritos') {
      setNavigationPath([{ id: currentContext.activeSection, name: currentContext.activeSection }]);
      return;
    }
    
    // Para navegación normal por carpetas
    const path = await buildNavigationPathFromUrl(currentContext.folderId);
    setNavigationPath(path);
  };

  // Generar URL compartible (actualizado)
  const generateShareableUrl = (type: 'folder' | 'theme' | 'section', itemId: string) => {
    const baseUrl = window.location.origin;
    
    if (type === 'section') {
      // 🆕 URLs para secciones especiales
      switch (itemId) {
        case 'Mis archivos':
          return `${baseUrl}/mis-archivos`;
        case 'Favoritos':
          return `${baseUrl}/favoritos`;
        default:
          return `${baseUrl}`;
      }
    }
    
    if (type === 'folder') {
      if (itemId === "68acb06886d455d16cceef05") {
        return `${baseUrl}`;
      }
      return `${baseUrl}/folder/${itemId}`;

      
    } else {
      return currentContext.folderId !== "68acb06886d455d16cceef05"
        ? `${baseUrl}/folder/${currentContext.folderId}/theme/${itemId}`
        : `${baseUrl}/theme/${itemId}`;
    }
  };


// AGREGAR nuevas funciones de navegación
const navigateToThemeDetail = (themeId: string) => {
  const currentQuery = { ...router.query };
  delete currentQuery.slug;
  
  const url = `/theme-detail/${themeId}`;
  const queryString = Object.keys(currentQuery).length > 0 
    ? '?' + new URLSearchParams(currentQuery as Record<string, string>).toString()
    : '';
  
  router.push(`${url}${queryString}`);
};

const navigateBackFromThemeDetail = () => {
  // Volver a la vista de contenedor por defecto
  navigateToSection('Contenedor');
};
  
  return {
    // Estados actuales (actualizado)
    currentFolderId: currentContext.folderId,
    currentThemeId: currentContext.themeId,
    isCreatingTheme: currentContext.isCreatingTheme,
    isViewingTheme: currentContext.isViewingTheme,
    activeSection: currentContext.activeSection, 
    navigationPath,
    
    // Funciones de navegación (actualizado)
    navigateToFolder,
    navigateToTheme,
    navigateToCreateTheme,
    navigateBackFromTheme,
    navigateToSection,
     navigateToThemeDetail,
  navigateBackFromThemeDetail, // 🆕 Nueva función
    
    // Funciones de filtros
    updateSearchFilters,
    getFiltersFromUrl,
    
    // Utilidades
    initializeFromUrl,
    generateShareableUrl
  };
};