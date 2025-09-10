// components/BaseConocimientos/Content/ContentArea.tsx
import React from 'react';
import FoldersGrid from '../Folders/FoldersGrid';
import ThemesGrid from '../Themes/ThemesGrid';
import Breadcrumb from '../Navigation/Breadcrumb';
import ContentFilters from './ContentFilters';
import ThemeEditor from '../Themes/ThemeEditor';
import UserContentView from './UserContentView';
import FavoritesContentView from './FavoritesContentView';
import FilesGrid from '../Files/FilesGrid';

import styles from './../../../styles/base-conocimientos.module.css';

interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
}

interface File {
  _id: string;
  name: string;
  type: string;
  size?: number;
  url?: string;
  creation_date?: string;
}

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
}

interface SortOption {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface ContentAreaProps {
  // Datos
  folders: Folder[];
  themes: Theme[];
  loading: boolean;
  error: string | null;
  files: File[];
  folderFavorites?: Set<string>; 
  themeFavorites?: Set<string>; 
  fileFavorites?: Set<string>;
  
  //  Datos del usuario para vista "Mis archivos"
  userContent?: {
    folders: Folder[];
    themes: Theme[];
    files: File[];
  };
  userContentLoading?: boolean;
  userContentError?: string | null;

    //  Datos de favoritos para vista "Favoritos"
  favoritesContent?: {
    folders: Folder[];
    themes: Theme[];
  };
  favoritesContentLoading?: boolean;
  favoritesContentError?: string | null;
  
  
  //  Vista activa
  activeView: 'folder' | 'user-content' | 'favorites';
  
  onFileSelect: (file: File) => void;
  onFileDoubleClick?: (file: File) => void;
  onFileMenuAction?: (action: string, file: File) => void;
  onToggleFolderFavorite?: (folderId: string) => void;
  onToggleThemeFavorite?: (themeId: string) => void; 
    
  navigationPath: Array<{id: string, name: string}>;
  onNavigate: (targetIndex: number) => void;
  
  // Estados de vista
  isCreatingNewTopic: boolean;
  
  // Filtros
  areFiltersVisible: boolean;
  activeContentFilters: string[];
  currentSortBy: string;
  onToggleFiltersVisibility: () => void;
  onFilterClick: (filterLabel: string) => void;
  onSortOptionClick: (option: SortOption) => void;
  
  // Handlers de carpetas
  onFolderSelect: (folder: Folder) => void;
  onFolderDoubleClick: (folder: Folder) => void;
  onFolderMenuAction: (action: string, folder: Folder) => void;
  
  // Handlers de temas
  onThemeSelect: (theme: Theme) => void;
  onThemeMenuAction?: (action: string, theme: Theme) => void;
  
  // Handlers del editor
  onThemeEditorBack: () => void;
  onThemeEditorSave?: (themeData: any) => void;

  onToggleFileFavorite?: (fileId: string) => void;

}

export const ContentArea: React.FC<ContentAreaProps> = ({
  folders,
  themes,
  files,       
  folderFavorites,
  themeFavorites,
  fileFavorites,     
  onToggleFileFavorite,        
  loading,
  error,
  
  //  Props para contenido del usuario
  userContent,
  userContentLoading = false,
  userContentError = null,
  activeView, // 

   //  Props para contenido de favoritos
  favoritesContent,
  favoritesContentLoading = false,
  favoritesContentError = null,
  
  onFileSelect,           
  onFileDoubleClick,      
  onFileMenuAction,       
  navigationPath,
  onNavigate,
  isCreatingNewTopic,
  areFiltersVisible,
  activeContentFilters,
  currentSortBy,
  onToggleFiltersVisibility,
  onFilterClick,
  onSortOptionClick,
  onFolderSelect,
  onFolderDoubleClick,
  onFolderMenuAction,
  onThemeSelect,
  onThemeMenuAction,
  onThemeEditorBack,
  onThemeEditorSave,
  onToggleFolderFavorite,
  onToggleThemeFavorite,
  

}) => {
  
  // Si está creando un nuevo tema, mostrar el editor
  if (isCreatingNewTopic) {
    return (
      <ThemeEditor 
        onBack={onThemeEditorBack}
        onSave={onThemeEditorSave}
      />
    );
  }

  //  Si la vista activa es "user-content", mostrar UserContentView
  if (activeView === 'user-content') {
  console.log('🏠 ContentArea - fileFavorites recibido:', fileFavorites);
  console.log('🏠 ContentArea - tipo:', typeof fileFavorites);
    return (
      <UserContentView
        userFolders={userContent?.folders || []}
        userThemes={userContent?.themes || []}
        userFiles={userContent?.files || []}
        fileFavorites={fileFavorites}  
        loading={userContentLoading}
        error={userContentError}
        areFiltersVisible={areFiltersVisible}
        activeContentFilters={activeContentFilters}
        currentSortBy={currentSortBy}
        onToggleFiltersVisibility={onToggleFiltersVisibility}
        onFilterClick={onFilterClick}
        onSortOptionClick={onSortOptionClick}
        folderFavorites={folderFavorites}
        themeFavorites={themeFavorites}
        onFolderSelect={onFolderSelect}
        onFolderDoubleClick={onFolderDoubleClick}
        onFolderMenuAction={onFolderMenuAction}
        onToggleFolderFavorite={onToggleFolderFavorite}
        onThemeSelect={onThemeSelect}
        onThemeMenuAction={onThemeMenuAction}
        onToggleThemeFavorite={onToggleThemeFavorite}
        onFileSelect={onFileSelect}
        onFileDoubleClick={onFileDoubleClick}
        onFileMenuAction={onFileMenuAction}
        onToggleFileFavorite={onToggleFileFavorite} 
        
      />
    );
  }

  // 🆕 Si la vista activa es "favorites", mostrar FavoritesContentView
  if (activeView === 'favorites') {
      console.log('🔍 ContentArea - favoritesContent completo:', favoritesContent);
  console.log('🔍 ContentArea - favoriteFiles que voy a pasar:', favoritesContent?.files || []);
  
    return (
    <FavoritesContentView
      favoriteFolders={favoritesContent?.folders || []}
      favoriteThemes={favoritesContent?.themes || []}
      favoriteFiles={favoritesContent?.files || []}
      loading={favoritesContentLoading}
      error={favoritesContentError}
      folderFavorites={folderFavorites}
      themeFavorites={themeFavorites}
      fileFavorites={fileFavorites}
      areFiltersVisible={areFiltersVisible}
      activeContentFilters={activeContentFilters}
      currentSortBy={currentSortBy}
      onToggleFiltersVisibility={onToggleFiltersVisibility}
      onFilterClick={onFilterClick}
      onSortOptionClick={onSortOptionClick}
      onFolderSelect={onFolderSelect}
      onFolderDoubleClick={onFolderDoubleClick}
      onFolderMenuAction={onFolderMenuAction}
      onToggleFolderFavorite={onToggleFolderFavorite}
      onThemeSelect={onThemeSelect}
      onThemeMenuAction={onThemeMenuAction}
      onToggleThemeFavorite={onToggleThemeFavorite}
      onToggleFileFavorite={onToggleFileFavorite}
      
    />
    );
  }

  // Vista normal de carpetas y temas (navegación por carpetas)
  return (
    <div className={styles.foldersSection}>
      {/* Header con Breadcrumb y Filtros */}
      <div className={styles.contentHeader}>
        <ContentFilters 
          navigationPath={navigationPath}
          onNavigate={onNavigate}
          areFiltersVisible={areFiltersVisible}
          activeContentFilters={activeContentFilters}
          currentSortBy={currentSortBy}
          onToggleFiltersVisibility={onToggleFiltersVisibility}
          onFilterClick={onFilterClick}
          onSortOptionClick={onSortOptionClick}
        />
      </div>

      {/* Contenido: Carpetas y Temas */}
      <div className={styles.contentSections}>
        {/* Sección de Carpetas */}
        {folders.length > 0 && (
          <FoldersGrid
            folders={folders}
            folderFavorites={folderFavorites}
            loading={loading}
            error={error}
            onFolderSelect={onFolderSelect}
            onFolderDoubleClick={onFolderDoubleClick}
            onFolderMenuAction={onFolderMenuAction}
            onToggleFolderFavorite={onToggleFolderFavorite} 
          />
        )}

        {/* Sección de Temas */}
        <ThemesGrid
          themes={themes}
          themeFavorites={themeFavorites} 
          loading={loading}
          error={error}
          onThemeSelect={onThemeSelect}
          onThemeMenuAction={onThemeMenuAction}
          onToggleThemeFavorite={onToggleThemeFavorite} 
        />

        <FilesGrid
          files={files}
          loading={loading}
          error={error}
          fileFavorites={fileFavorites}
          onFileSelect={onFileSelect}
          onFileDoubleClick={onFileDoubleClick}
          onFileMenuAction={onFileMenuAction}
          onToggleFileFavorite={onToggleFileFavorite} 
        />
      </div>
    </div>
  );
};

export default ContentArea;