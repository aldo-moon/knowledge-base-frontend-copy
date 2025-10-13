// components/BaseConocimientos/Content/FavoritesContentView.jsx
import React, { useState, useRef, useEffect } from 'react';
import FoldersGrid from '../Folders/FoldersGrid';
import { 
  SlidersHorizontal, 
  FileText, 
  Image, 
  Video, 
  ArrowUpDown, 
  Type, 
  Calendar 
} from 'lucide-react';
import ThemesGrid from '../Themes/ThemesGrid';
import FilesGrid from '../Files/FilesGrid';  
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


interface FavoritesContentViewProps {
  // Datos de favoritos
  favoriteFolders: any[];
  favoriteThemes: any[];
  favoriteFiles: any[];
  loading: boolean;
  error: string | null;
  onToggleFiltersVisibility: () => void;
  areFiltersVisible: boolean;


    activeContentFilters: string[];
  currentSortBy: string;
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
  onThemeDoubleClick?: (theme: any) => void;  // ← ESTE ES EL MÁS IMPORTANTE


  onFileSelect: (file: any) => void;  
  onFileDoubleClick?: (file: any) => void;  
  onFileMenuAction?: (action: string, file: any) => void;  
  onToggleFileFavorite?: (fileId: string) => void;  
}

export const FavoritesContentView: React.FC<FavoritesContentViewProps> = ({
  favoriteFolders,
  favoriteThemes,
  favoriteFiles,  
  fileFavorites,  
  onFileSelect,   
  onFileDoubleClick,
  onThemeDoubleClick,  
  onFileMenuAction,   
  onToggleFileFavorite,
  loading,
  error,
  folderFavorites,
  themeFavorites,
  onFolderSelect,
    activeContentFilters, // 🆕
  currentSortBy, // 🆕
  onToggleFiltersVisibility,
  onFilterClick, // 🆕
  onSortOptionClick, // 🆕
  onFolderDoubleClick,
  areFiltersVisible,
  onFolderMenuAction,
  onToggleFolderFavorite,
  onThemeSelect,
  onThemeMenuAction,
  onToggleThemeFavorite
}) => {


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
          <h2 className={styles.sectionTitle1}>Favoritos</h2>
          
        </div>
        
        {/*  Botón de filtros agregado */}
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
            <span>{favoriteFolders.length} carpetas</span>
            <span>{favoriteThemes.length} temas</span>
            <span>{favoriteFiles.length} archivos</span>  

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
          <h2 className={styles.sectionTitle1}>Favoritos</h2>
        </div>
        <div className={styles.errorContainer}>
          <p>Error al cargar favoritos: {error}</p>
        </div>
      </div>
    );
  }

  const hasContent = favoriteFolders.length > 0 || favoriteThemes.length > 0 || favoriteFiles.length > 0;

  if (!hasContent) {
    return (
      <div className={styles.foldersSection}>
        <div className={styles.contentHeader}>
          <h2 className={styles.sectionTitle1}>Favoritos</h2>
        </div>
        <div className={styles.emptyState}>
          <p>No tienes elementos marcados como favoritos aún.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.foldersSection}>
      {/* Header con botón de filtros */}
      <div className={styles.contentHeaderTop}>
        <div className={styles.contentHeaderLeft}>
          <h2 className={styles.sectionTitle1}>Favoritos</h2>
          
        </div>
        
        {/*  Botón de filtros agregado */}
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
            <span>{favoriteFolders.length} carpetas</span>
            <span>{favoriteThemes.length} temas</span>
            <span>{favoriteFiles.length} archivos</span>  

          </div>
      
      {/* Sección de filtros (cuando están visibles) */}
      {areFiltersVisible && (
        <div className={styles.contentHeaderTags1} ref={filtersRef}>
            {/* Filtros de contenido */}
              {filterTags.map((filter, index) => (
                <button
                  key={index}
                  className={`${styles.contentTag} ${
                  activeContentFilters.includes(filter.label) ? styles.contentTagActive : ''}`}  
                  onClick={() => onFilterClick(filter.label)}
                >
                  <filter.icon size={14} style={{ marginRight: '6px' }} />
                  {filter.label}
                </button>
              ))}

            {/* Botón de ordenar */}
              <div className={styles.sortMenuContainer} ref={sortMenuRef}>
                <button
                  className={`${styles.contentTag} ${isSortMenuOpen ? styles.sortButton : ''}`}
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                >
                  <ArrowUpDown size={14}  style={{ marginRight: '6px' }} />
                   {currentSortBy}
                </button>

                {isSortMenuOpen && (
                  <div className={styles.sortDropdownMenu}>
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        className={styles.sortDropdownOption}
                        onClick={() => {
                          onSortOptionClick(option); 
                        }}
                      >
                        <option.icon size={16}  className={styles.sortOptionIcon} />
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
        {/* Sección de Carpetas Favoritas */}
        {favoriteFolders.length > 0 && (
          <div className={styles.userContentSection}>
            <FoldersGrid
              folders={favoriteFolders}
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

        {/* Sección de Temas Favoritos */}
        {favoriteThemes.length > 0 && (
          <div className={styles.userContentSection}>
            <ThemesGrid
              themes={favoriteThemes}
              themeFavorites={themeFavorites}
              loading={false}
              error={null}
              onThemeSelect={onThemeSelect}
              onThemeDoubleClick={onThemeDoubleClick}  // ← AGREGAR ESTA LÍNEA
              onThemeMenuAction={onThemeMenuAction}
              onToggleThemeFavorite={onToggleThemeFavorite}
            />
          </div>
        )}

          {/* Sección de Archivos Favoritos */}
          {favoriteFiles.length > 0 && (
            <div className={styles.userContentSection}>
              <FilesGrid
                files={favoriteFiles}
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

export default FavoritesContentView;