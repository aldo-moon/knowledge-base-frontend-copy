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
  isDraft?: boolean; // ✅ Nueva propiedad

}

interface ThemesGridProps {
  themes: Theme[];
  loading?: boolean;
  error?: string | null;
  themeFavorites?: Set<string>; 
  onThemeSelect?: (theme: Theme) => void; // ← Ya opcional
  onThemeDoubleClick?: (theme: Theme) => void;
  onThemeMenuAction?: (action: string, theme: Theme) => void;
  onToggleThemeFavorite?: (folderId: string) => void;
  
  // Props para vista de papelera (igual que en FoldersGrid)
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
    console.log('🔍 ThemesGrid recibió:', {
    totalThemes: themes.length,
    themes: themes,
    themesWithDraft: themes.filter(t => t?.isDraft).length
  });


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
}).map((theme) => (
  <ThemeCard
    key={theme._id}
    theme={theme}
    isFavorite={themeFavorites.has(theme._id)}
    isDraft={theme.isDraft} // ✅ Asegúrate de pasar isDraft
    onSelect={onThemeSelect || (() => {})}
    onThemeDoubleClick={onThemeDoubleClick}
    onMenuAction={onThemeMenuAction}
    onToggleFavorite={onToggleThemeFavorite}
  />
))}
</div>
    </div>
  );
};

export default ThemesGrid;