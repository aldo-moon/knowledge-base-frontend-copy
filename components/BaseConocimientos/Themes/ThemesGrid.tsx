// components/BaseConocimientos/Themes/ThemesGrid.tsx
import React from 'react';
import ThemeCard from './ThemeCard';
import { ThemeCardSkeleton } from '../Skeleton/SkeletonLoaders';
import styles from '../../../styles/base-conocimientos.module.css';

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
  isDraft?: boolean;
}

interface ThemesGridProps {
  themes: Theme[];
  loading?: boolean;
  error?: string | null;
  themeFavorites?: Set<string>; 
  onThemeSelect?: (theme: Theme) => void;
  onThemeDoubleClick?: (theme: Theme) => void;
  onThemeMenuAction?: (action: string, theme: Theme) => void;
  onToggleThemeFavorite?: (folderId: string) => void;
  isTrashView?: boolean;
  selectedItems?: Set<string>;
  onItemSelect?: (itemId: string) => void;
}

export const ThemesGrid: React.FC<ThemesGridProps> = ({
  themes,
  loading = false,
  error = null,
  themeFavorites = new Set(),
  onThemeSelect,
  onThemeDoubleClick,
  onThemeMenuAction,
  onToggleThemeFavorite,
  isTrashView = false,
  selectedItems,
  onItemSelect
}) => {

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <div className={styles.contentSection}>
        <h3 className={styles.sectionTitle}>Temas</h3>
        <div className={styles.themesGrid}>
          {[...Array(4)].map((_, index) => (
            <ThemeCardSkeleton key={`skeleton-${index}`} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentSection}>
        <p>Error: {error}</p>
      </div>
    );
  }

if (themes.length === 0 && !loading) {
  return null;
}

  return (
    <div className={styles.contentSection}>
      <h3 className={styles.sectionTitle}>Temas</h3>
      <div className={styles.themesGrid}>
        {themes.filter(theme => {
          if (!theme) {
            console.log('❌ Tema null encontrado');
            return false;
          }
          if (!theme._id) {
            console.log('❌ Tema sin _id:', theme);
            return false;
          }
          return true;
        }).map((theme, index) => (
          <ThemeCard
            key={theme._id}
            theme={theme}
            isFavorite={themeFavorites.has(theme._id)}
            isDraft={theme.isDraft}
            onSelect={onThemeSelect || (() => {})}
            onThemeDoubleClick={onThemeDoubleClick}
            onMenuAction={onThemeMenuAction}
            onToggleFavorite={onToggleThemeFavorite}
            isTrashView={isTrashView}           // ✅ AGREGAR
            selectedItems={selectedItems}       // ✅ AGREGAR
            onItemSelect={onItemSelect}         // ✅ AGREGAR
          />
        ))}
      </div>
    </div>
  );
};

export default ThemesGrid;