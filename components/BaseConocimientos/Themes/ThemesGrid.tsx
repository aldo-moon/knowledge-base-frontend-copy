// components/BaseConocimientos/Themes/ThemesGrid.tsx
import React from 'react';
import ThemeCard from './ThemeCard';
import styles from '../../../styles/base-conocimientos.module.css';

interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  keywords?: string[];
  creation_date?: string;
}

interface ThemesGridProps {
  themes: Theme[];
  loading?: boolean;
  error?: string | null;
  themeFavorites?: Set<string>; 
  onThemeSelect: (theme: Theme) => void;
  onThemeDoubleClick?: (theme: Theme) => void;
  onThemeMenuAction?: (action: string, theme: Theme) => void;
  onToggleThemeFavorite?: (folderId: string) => void; 
}

export const ThemesGrid: React.FC<ThemesGridProps> = ({
  themes,
  loading = false,
  error = null,
  themeFavorites = new Set(),
  onThemeSelect,
  onThemeDoubleClick,
  onThemeMenuAction,
  onToggleThemeFavorite
}) => {
  if (loading) {
    return (
      <div className={styles.contentSection}>
        <p>Cargando temas...</p>
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

  if (themes.length === 0) {
    return null; // No mostrar nada si no hay temas
  }

  return (
    <div className={styles.contentSection}>
      <h3 className={styles.sectionTitle}>Temas</h3>
      <div className={styles.themesGrid}>
        {themes.map((theme) => (
          <ThemeCard
            key={theme._id}
            theme={theme}
            isFavorite={themeFavorites.has(theme._id)}
            onSelect={onThemeSelect}
            onDoubleClick={onThemeDoubleClick}
            onMenuAction={onThemeMenuAction}
            onToggleFavorite={onToggleThemeFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemesGrid;