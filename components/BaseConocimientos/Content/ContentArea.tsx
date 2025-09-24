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
import ThemeDetailView from './ThemeDetailView';
import TrashContentView from './TrashContentView';

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
  file_name: string;  // ← Cambiar de "name" a "file_name"
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

interface TrashItem {
  _id: string;
  type_content: 'Carpeta' | 'Tema' | 'Archivo';
  content_id: string;
  created_at?: string;
  user_bin_id?: string; // ✅ Hacer opcional con ?
  expireAt?: string; // ✅ Agregar esta propiedad
  originalContent?: any; // ← Cambiar de "Folder | Theme | File" a "any"
  // ... otras propiedades que pueda tener
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
    themeTitle?: string;
  themeDescription?: string;
  onThemeTitleChange?: (title: string) => void;
  onThemeDescriptionChange?: (description: string) => void;
  showCommentsPanel?: boolean;
  isEditingTheme?: boolean;

  viewingThemeId?: string | null;
  onThemeDetailBack: () => void;
  onThemeEdit?: (theme: Theme) => void;
  onThemeDelete?: (theme: Theme) => void;
  onThemeDoubleClick?: (theme: Theme) => void;
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
  files: File[];  // ← AGREGAR esta línea
};
  favoritesContentLoading?: boolean;
  favoritesContentError?: string | null;
  
  
  //  Vista activa
activeView: 'folder' | 'user-content' | 'favorites' | 'trash' | 'theme-detail';

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

  trashContent?: {
    items: TrashItem[];
    folders: Folder[];
    themes: Theme[];
    files: File[];
  };
  trashContentLoading?: boolean;
  trashContentError?: string | null;
  
  // Handlers de papelera
  onRestoreItem?: (papeleraId: string, type: string) => void;
  onPermanentDelete?: (papeleraId: string, type: string) => void;
  onEmptyTrash?: () => void;
  onRestoreSelected?: (papeleraIds: string[]) => void;
  onDeleteSelected?: (papeleraIds: string[]) => void;
  


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
    isEditingTheme,
  themeTitle,
  themeDescription,
  onThemeTitleChange,
  onThemeDescriptionChange,
  viewingThemeId,
  onThemeDetailBack,
  onThemeEdit,
  onThemeDelete,
  onThemeDoubleClick,
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
   trashContent,
  trashContentLoading = false,
  trashContentError = null,
  onRestoreItem,
  onPermanentDelete,
  onEmptyTrash,
  onRestoreSelected,
  onDeleteSelected,

}) => {

  if (activeView === 'theme-detail' && viewingThemeId) {
    return (
      <ThemeDetailView
        themeId={viewingThemeId}
        onBack={onThemeDetailBack}
        onEdit={onThemeEdit}
        onDelete={onThemeDelete}
        onToggleFavorite={onToggleThemeFavorite}
        isFavorite={themeFavorites?.has(viewingThemeId)}
      />
    );
  }

  // Si está creando un nuevo tema, mostrar el editor
  if (isCreatingNewTopic) {
    return (
      <ThemeEditor 
        onBack={onThemeEditorBack}
        onSave={onThemeEditorSave}
        title={themeTitle || ''}
        description={themeDescription || ''}
onTitleChange={onThemeTitleChange || (() => {})}
onDescriptionChange={onThemeDescriptionChange || (() => {})}
      />
    );
  }

  if (isEditingTheme) {
    return (
      <ThemeEditor 
        onBack={onThemeEditorBack}
        onSave={onThemeEditorSave}
        title={themeTitle || ''}
        description={themeDescription || ''}
        onTitleChange={onThemeTitleChange || (() => {})}
        onDescriptionChange={onThemeDescriptionChange || (() => {})}
        isEditMode={true} // ✅ Importante: pasar true para modo edición
      />
    );
  }
  //  Si la vista activa es "user-content", mostrar UserContentView
  if (activeView === 'user-content') {

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
        onThemeDoubleClick={onThemeDoubleClick}
        onFileSelect={onFileSelect}
        onFileDoubleClick={onFileDoubleClick}
        onFileMenuAction={onFileMenuAction}
        onToggleFileFavorite={onToggleFileFavorite} 
        
      />
    );
  }

  //  Si la vista activa es "favorites", mostrar FavoritesContentView
  if (activeView === 'favorites') {

  
    return (
    <FavoritesContentView
      favoriteFolders={favoritesContent?.folders || []}
      favoriteThemes={favoritesContent?.themes || []}
      favoriteFiles={favoritesContent?.files || []}
      loading={favoritesContentLoading}
      error={favoritesContentError}
      onThemeDoubleClick={onThemeDoubleClick}  // ← CLAVE
      onFileDoubleClick={onFileDoubleClick}
      onFileMenuAction={onFileMenuAction}
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
        onFileSelect={onFileSelect}  // ← AGREGAR esta línea
    />
    );
  }

  if (activeView === 'trash') {
      console.log('🎯 Renderizando TrashContentView con:', {
    items: trashContent?.items?.length,
    folders: trashContent?.folders?.length,
    themes: trashContent?.themes?.length,
    files: trashContent?.files?.length
  });
    return (
      <TrashContentView
        trashItems={trashContent?.items || []}
        trashFolders={trashContent?.folders || []}
        trashThemes={trashContent?.themes || []}
        trashFiles={trashContent?.files || []}
        loading={trashContentLoading}
        error={trashContentError}
        areFiltersVisible={areFiltersVisible}
        activeContentFilters={activeContentFilters}
        currentSortBy={currentSortBy}
        onToggleFiltersVisibility={onToggleFiltersVisibility}
        onFilterClick={onFilterClick}
        onSortOptionClick={onSortOptionClick}
        onRestoreItem={onRestoreItem || (() => {})}
        onPermanentDelete={onPermanentDelete || (() => {})}
        onEmptyTrash={onEmptyTrash || (() => {})}
        onRestoreSelected={onRestoreSelected || (() => {})}
        onDeleteSelected={onDeleteSelected || (() => {})}
        onThemeSelect={onThemeSelect}
        onFolderSelect={onFolderSelect}
onFileSelect={onFileSelect as any}        
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
          onThemeSelect={onThemeSelect}
          onThemeMenuAction={onThemeMenuAction}
          onThemeDoubleClick={onThemeDoubleClick}  // NUEVO
          onToggleThemeFavorite={onToggleThemeFavorite}
          themeFavorites={themeFavorites}
        />

        <FilesGrid
          files={files}
          loading={loading}
          error={error}
          fileFavorites={fileFavorites}
onFileSelect={onFileSelect as any}
          onFileDoubleClick={onFileDoubleClick as any}
onFileMenuAction={onFileMenuAction as any}
          onToggleFileFavorite={onToggleFileFavorite} 
        />
      </div>
    </div>
  );
};

export default ContentArea;