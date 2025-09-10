// components/BaseConocimientos/Navigation/MainSidebar.tsx
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Settings 
} from 'lucide-react';
import styles from '../../../styles/base-conocimientos.module.css';

interface SidebarItem {
  icon: React.ElementType;
  active?: boolean;
}

interface MainSidebarProps {
  onItemClick?: (item: SidebarItem, index: number) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ onItemClick }) => {
  const sidebarItems: SidebarItem[] = [
    { icon: Home},
    { icon: BookOpen, active: true },
    { icon: BarChart3},
    { icon: FileText},
    { icon: Settings}
  ];

  return (
    <div className={styles.mainSidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>ZIMPLE</div>
      </div>
      
      <nav className={styles.mainSidebarNav}>
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.mainSidebarItem} ${item.active ? styles.mainSidebarActive : ''}`}
            title={item.label}
            onClick={() => onItemClick?.(item, index)}
          >
            <item.icon size={20} />
            <span className={styles.mainSidebarLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainSidebar;