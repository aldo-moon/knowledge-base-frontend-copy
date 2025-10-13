// components/BaseConocimientos/Content/UserContentView.jsx
import React, { useState, useRef, useEffect } from 'react';
import FoldersGrid from '../Folders/FoldersGrid';
import ThemesGrid from '../Themes/ThemesGrid';
import FilesGrid from '../Files/FilesGrid';
import { 
  SlidersHorizontal, 
  FileText, 
  Image, 
  Video, 
  ArrowUpDown, 
  Type, 
  Calendar 
} from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface FilterTag {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

interface SortOption {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface UserContentViewProps {
  // Datos del usuario
  userFolders: any[];
  
  userThemes: any[];
  userFiles: any[];
  loading: boolean;
  error: string | null;
  
  // Estados de filtros - NUEVAS PROPS
  areFiltersVisible: boolean;
  activeContentFilters: string[];
  currentSortBy: string;
  onToggleFiltersVisibility: () => void;
  onFilterClick: (filterLabel: string) => void;
  onSortOptionClick: (option: any) => void;
  
  // Estados de favoritos
  folderFavorites?: Set<string>;
  themeFavorites?: Set<string>;
  fileFavorites?: Set<string>;

  // Handlers para carpetas
  onFolderSelect: (folder: any) => void;
  onFolderDoubleClick: (folder: any) => void;
  onFolderMenuAction: (action: string, folder: any) => void;
  onToggleFolderFavorite?: (folderId: string) => void;
  
  // Handlers para temas
  onThemeSelect: (theme: any) => void;
  onThemeMenuAction?: (action: string, theme: any) => void;
  onToggleThemeFavorite?: (themeId: string) => void;
  onThemeDoubleClick?: (theme: any) => void;

  // Handlers para archivos
  onFileSelect: (file: any) => void;
  onFileDoubleClick?: (file: any) => void;
  onFileMenuAction?: (action: string, file: any) => void;

  onToggleFileFavorite?: (fileId: string) => void;
}

export const UserContentView: React.FC<UserContentViewProps> = ({
  userFolders,
  userThemes,
  userFiles,
  loading,
  error,
  folderFavorites,
  themeFavorites,
  fileFavorites,
  areFiltersVisible,
  activeContentFilters,
  currentSortBy,
  onToggleFiltersVisibility,
  onFilterClick,
  onSortOptionClick,
  onFolderSelect,
  onFolderDoubleClick,
  onFolderMenuAction,
  onToggleFolderFavorite,
  onThemeSelect,
  onThemeMenuAction,
  onToggleThemeFavorite,
  onThemeDoubleClick,
  onFileSelect,
  onFileDoubleClick,
  onFileMenuAction,
  onToggleFileFavorite,
  
}) => {
    console.log('👤 UserContentView recibió fileFavorites:', Array.from(fileFavorites || []));

  const filtersRef = useRef<HTMLDivElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const filterTags: FilterTag[] = [
    { label: 'Documentos', icon: FileText },
    { label: 'Imagenes', icon: Image },
    { label: 'Videos', icon: Video }
  ];

  const sortOptions: SortOption[] = [
    { icon: Type, label: 'Nombre', value: 'nombre' },
    { icon: Calendar, label: 'Fecha', value: 'fecha' }
  ];

  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar menú de ordenar por
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }

      // Cerrar filtros de contenido
      if (filtersRef.current && 
          !filtersRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest(`.${styles.filterToggleButton}`) && 
          areFiltersVisible) {
        onToggleFiltersVisibility();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [areFiltersVisible, onToggleFiltersVisibility]);

if (loading) {
  return (
    <div className={styles.foldersSection}>
      {/* Header con botón de filtros */}
      <div className={styles.contentHeaderTop}>
        <div className={styles.contentHeaderLeft}>
          <h2 className={styles.sectionTitle1}>Mis archivos</h2>
        </div>
        
        {/* Botón de filtros */}
        <div className={styles.contentHeaderActions}>
          <button 
            className={`${styles.filterToggleButton} ${areFiltersVisible ? styles.filterToggleActive : ''}`}
            onClick={onToggleFiltersVisibility}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.contentStats}>
        <span>{userFolders.length} carpetas</span>
        <span>{userThemes.length} temas</span>
        <span>{userFiles.length} archivos</span>
      </div>
      
      {/* Mostrar skeletons mientras carga */}
      <div className={styles.contentSections}>
        <FoldersGrid
          folders={[]}
          folderFavorites={folderFavorites}
          loading={true}
          error={null}
          onFolderSelect={onFolderSelect}
          onFolderDoubleClick={onFolderDoubleClick}
          onFolderMenuAction={onFolderMenuAction}
          onToggleFolderFavorite={onToggleFolderFavorite}
        />
        
        <ThemesGrid
          themes={[]}
          themeFavorites={themeFavorites}
          loading={true}
          error={null}
          onThemeSelect={onThemeSelect}
          onThemeDoubleClick={onThemeDoubleClick}
          onThemeMenuAction={onThemeMenuAction}
          onToggleThemeFavorite={onToggleThemeFavorite}
        />
        
        <FilesGrid
          files={[]}
          fileFavorites={fileFavorites}
          loading={true}
          error={null}
          onFileSelect={onFileSelect}
          onFileDoubleClick={onFileDoubleClick}
          onFileMenuAction={onFileMenuAction}
          onToggleFileFavorite={onToggleFileFavorite}
        />
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className={styles.foldersSection}>
        <div className={styles.contentHeader}>
          <h2 className={styles.sectionTitle1}>Mis archivos</h2>
        </div>
        <div className={styles.errorContainer}>
          <p>Error al cargar el contenido: {error}</p>
        </div>
      </div>
    );
  }

  const hasContent = userFolders.length > 0 || userThemes.length > 0 || userFiles.length > 0;

  if (!hasContent) {
    return (
      <div className={styles.foldersSection}>
        <div className={styles.contentHeader}>
          <h3 className={styles.sectionTitle1}>Mis archivos</h3>
        </div>
        <div className={styles.emptyState}>
          <p>No tienes contenido creado aún.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.foldersSection}>
      {/* Header con botón de filtros */}
      <div className={styles.contentHeaderTop}>
        <div className={styles.contentHeaderLeft}>
          <h2 className={styles.sectionTitle1}>Mis archivos</h2>
        </div>
        
        {/* Botón de filtros */}
        <div className={styles.contentHeaderActions}>
          <button 
            className={`${styles.filterToggleButton} ${areFiltersVisible ? styles.filterToggleActive : ''}`}
            onClick={onToggleFiltersVisibility}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.contentStats}>
        <span>{userFolders.length} carpetas</span>
        <span>{userThemes.length} temas</span>
        <span>{userFiles.length} archivos</span>
      </div>

      {/* Sección de filtros (cuando están visibles) */}
      {areFiltersVisible && (
        <div className={styles.contentHeaderTags1} ref={filtersRef}>
          {/* Filtros de contenido */}
          {filterTags.map((filter, index) => (
            <button
              key={index}
              className={`${styles.contentTag} ${
                activeContentFilters.includes(filter.label) ? styles.contentTagActive : ''
              }`}
              onClick={() => onFilterClick(filter.label)}
            >
              <filter.icon size={14} style={{ marginRight: '6px' }} />
              {filter.label}
            </button>
          ))}

          {/* Botón de ordenar */}
          <div className={styles.sortMenuContainer} ref={sortMenuRef}>
            <button
              className={`${styles.contentTag} ${isSortMenuOpen ? styles.contentTagActive : ''}`}
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              <ArrowUpDown size={14} style={{ marginRight: '6px' }} />
              {currentSortBy}
            </button>

            {isSortMenuOpen && (
              <div className={styles.sortDropdownMenu}>
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.sortDropdownOption} ${
                      currentSortBy === option.label ? styles.sortDropdownActive : ''
                    }`}
                    onClick={() => {
                      onSortOptionClick(option);
                      setIsSortMenuOpen(false);
                    }}
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

      {/* Contenido */}
      <div className={styles.contentSections}>
        {/* Sección de Carpetas */}
        {userFolders.length > 0 && (
          <div className={styles.userContentSection}>
            <FoldersGrid
              folders={userFolders}
              folderFavorites={folderFavorites}
              loading={false}
              error={null}
              onFolderSelect={onFolderSelect}
              onFolderDoubleClick={onFolderDoubleClick}
              onFolderMenuAction={onFolderMenuAction}
              onToggleFolderFavorite={onToggleFolderFavorite}
            />
          </div>
        )}

        {/* Sección de Temas */}
        {userThemes.length > 0 && (
          <div className={styles.userContentSection}>
            <ThemesGrid
              themes={userThemes}
              themeFavorites={themeFavorites}
              loading={false}
              error={null}
              onThemeSelect={onThemeSelect}
              onThemeDoubleClick={onThemeDoubleClick}  
              onThemeMenuAction={onThemeMenuAction}
              onToggleThemeFavorite={onToggleThemeFavorite}
            />
          </div>
        )}

        {/* Sección de Archivos */}
          {userFiles.length > 0 && (
            <div className={styles.userContentSection}>
              <FilesGrid
                files={userFiles}
                fileFavorites={fileFavorites}
                loading={false}
                error={null}
                onFileSelect={onFileSelect}
                onFileDoubleClick={onFileDoubleClick}
                onFileMenuAction={onFileMenuAction}
                onToggleFileFavorite={onToggleFileFavorite} 
              />
            </div>
          )}
        </div>
    </div>
  );
};

export default UserContentView;