// components/BaseConocimientos/Search/SearchSection.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight,
  Filter,
  User,
  Tag,
  FileText,
  Image,
  Video,
  Folder
} from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface FilterOption {
  icon: React.ElementType;
  label: string;
}

interface SearchFilter {
  label: string;
  icon: React.ElementType;
  options: FilterOption[];
}

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchFocus?: () => void;
  onSearchCollapse?: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchTerm,
  onSearchChange,
  onSearchFocus,
  onSearchCollapse
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchFilters: SearchFilter[] = [
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

  // Manejar clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleSearchCollapse();
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    onSearchFocus?.();
  };

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
    setActiveFilter(null);
    onSearchCollapse?.();
  };

  const handleFilterToggle = (label: string) => {
    setActiveFilter(prev => prev === label ? null : label);
  };

  const handleFilterOptionClick = (filterLabel: string, option: FilterOption) => {
    console.log(`Filtro: ${filterLabel}, Opción: ${option.label}`);
    // Aquí puedes agregar lógica para manejar la selección del filtro
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div 
      className={`${styles.searchWrapper} ${isSearchExpanded ? styles.searchExpanded : ''}`}
      ref={searchRef}
    >
      <Search className={styles.searchIcon} size={20} />
      <input
        type="text"
        placeholder="Busca palabras claves, personas y etiquetas"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={handleSearchFocus}
        className={styles.searchInput}
      />
      
      {/* Botón para limpiar búsqueda */}
      {searchTerm && (
        <button
          onClick={handleClearSearch}
          className={styles.searchClearButton}
        >
          <X size={18} />
        </button>
      )}
                     
      {/* Botón para colapsar cuando está expandido */}
      {isSearchExpanded && (
        <button
          onClick={handleSearchCollapse}
          className={styles.searchCollapseButton}
        >
          <X size={18} />
        </button>
      )}

      {/* Filtros expandidos */}
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
  );
};

export default SearchSection;