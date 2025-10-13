// components/BaseConocimientos/Header/HeaderSection.tsx
import React from 'react';
import styles from '../../../styles/base-conocimientos.module.css';

interface HeaderSectionProps {
  title?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  title = "BASE DE CONOCIMIENTOS" 
}) => {
  return (
    <div className={styles.baseConocimientosHeader}>
      <h1 className={styles.baseConocimientosTitle}>
        {title}
      </h1>
    </div>
  );
};

export default HeaderSection;