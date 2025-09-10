// components/BaseConocimientos/Content/ContentFilters.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  FileText, 
  Image, 
  Video, 
  ArrowUpDown, 
  Type, 
  Calendar 
} from 'lucide-react';
import Breadcrumb from '../Navigation/Breadcrumb';
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

interface ContentFiltersProps {
  // Navegación
  navigationPath: Array<{id: string, name: string}>;
  onNavigate: (targetIndex: number) => void;
  
  // Filtros
  areFiltersVisible: boolean;
  activeContentFilters: string[];
  currentSortBy: string;
  onToggleFiltersVisibility: () => void;
  onFilterClick: (filterLabel: string) => void;
  onSortOptionClick: (option: SortOption) => void;
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  navigationPath,
  onNavigate,
  areFiltersVisible,
  activeContentFilters,
  currentSortBy,
  onToggleFiltersVisibility,
  onFilterClick,
  onSortOptionClick
}) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
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

  const handleSortClick = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  const handleSortOptionSelect = (option: SortOption) => {
    onSortOptionClick(option);
    setIsSortMenuOpen(false);
  };

  return (
    <>
      {/* Header principal con Breadcrumb y botón de filtros */}
      <div className={styles.contentHeaderTop}>
        <div className={styles.contentHeaderLeft}>
          <Breadcrumb 
            navigationPath={navigationPath}
            onNavigate={onNavigate}
          />
        </div>
        
        <div className={styles.contentHeaderActions}>
          <button 
            className={`${styles.filterToggleButton} ${areFiltersVisible ? styles.filterToggleActive : ''}`}
            onClick={onToggleFiltersVisibility}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Filtros expandibles */}
      {areFiltersVisible && (
        <div className={styles.contentHeaderTags} ref={filtersRef}>
          {/* Filtros de tipo */}
          {filterTags.map((tag) => (
            <button
              key={tag.label}
              className={`${styles.contentTag} ${
                activeContentFilters.includes(tag.label) ? styles.contentTagActive : ''
              }`}
              onClick={() => onFilterClick(tag.label)}
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
              onClick={handleSortClick}
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
                    onClick={() => handleSortOptionSelect(option)}
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
    </>
  );
};

export default ContentFilters;