// components/BaseConocimientos/Navigation/Breadcrumb.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbProps {
  navigationPath: BreadcrumbItem[];
  onNavigate: (targetIndex: number) => void;
  maxVisible?: number;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  navigationPath,
  onNavigate,
  maxVisible = 2
}) => {
  const renderBreadcrumb = () => {
    if (navigationPath.length <= maxVisible) {
      // Si hay pocos elementos, mostrar todos
      return navigationPath.map((folder, index) => (
        <span key={folder.id} className={styles.breadcrumbItem}>
          <button 
            className={styles.breadcrumbButton}
            onClick={() => onNavigate(index)}
          >
            {folder.name}
          </button>
          {index < navigationPath.length - 1 && (
            <ChevronRight size={16} className={styles.breadcrumbSeparator} />
          )}
        </span>
      ));
    }
    
    // Si hay muchos elementos, mostrar primero, puntos y último
    const firstItem = navigationPath[0];
    const lastItem = navigationPath[navigationPath.length - 1];
    
    return (
      <>
        {/* Primer elemento */}
        <span className={styles.breadcrumbItem}>
          <button 
            className={styles.breadcrumbButton}
            onClick={() => onNavigate(0)}
          >
            {firstItem.name}
          </button>
          <ChevronRight size={16} className={styles.breadcrumbSeparator} />
        </span>
        
        {/* Puntos como botón navegable */}
        <span className={styles.breadcrumbItem}>
          <button 
            className={styles.breadcrumbEllipsis}
            onClick={() => onNavigate(navigationPath.length - 2)}
          >
            ...
          </button>
          <ChevronRight size={16} className={styles.breadcrumbSeparator} />
        </span>
        
        {/* Último elemento */}
        <span className={styles.breadcrumbItem}>
          <span className={styles.breadcrumbCurrent}>
            {lastItem.name}
          </span>
        </span>
      </>
    );
  };

  return (
    <div className={styles.breadcrumb}>
      {renderBreadcrumb()}
    </div>
  );
};

export default Breadcrumb;