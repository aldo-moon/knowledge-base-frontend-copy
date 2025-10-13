// components/BaseConocimientos/Navigation/ContentSidebar.tsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Archive, 
  Star, 
  Clock, 
  Trash2, 
  Folder,
  ChevronRight, 
  ChevronDown,
 } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface SidebarItem {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  expandable?: boolean;
}



interface SubfolderItem {
  _id: string;
  folder_name: string;
}

interface ContentSidebarProps {
  sidebarFolders: Record<string, SubfolderItem[]>;
  expandedSidebarItems: Record<string, boolean>;
  activeSection: string; // Prop para sección activa
  onItemClick?: (item: SidebarItem) => void;
  onSubfolderClick?: (folderId: string, folderName: string) => void;
  onExpandClick?: (itemLabel: string) => void;
  onSubfolderExpand?: (folderId: string, folderName: string, event: React.MouseEvent) => void;
  onSectionChange?: (sectionName: string) => void; 
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({
  sidebarFolders,
  expandedSidebarItems,
  activeSection,
  onItemClick,
  onSubfolderClick,
  onExpandClick,
  onSubfolderExpand,
  onSectionChange 
}) => {
  const sidebarItems: SidebarItem[] = [
    { icon: Container, label: 'Contenedor', expandable: true },
    { icon: Archive, label: 'Mis archivos', expandable: true },
    { icon: Star, label: 'Favoritos', expandable: true },
    { icon: Clock, label: 'Recientes', expandable: false },
    { icon: Trash2, label: 'Papelera', expandable: false },

  ];

  // Renderizar subcarpetas de forma recursiva
  const renderSubfolder = (folder: SubfolderItem, level: number = 1) => (
    <div key={folder._id} className={styles.subfolderWrapper} style={{ marginLeft: `${level * 0.5}rem` }}>
      <button
        className={styles.subfolderItem}
        onClick={() => onSubfolderClick?.(folder._id, folder.folder_name)}
      >
        <Folder size={14} />
        <h3 className={styles.subfolderItemfoldername}>{folder.folder_name}</h3>
        
        <button
          className={styles.expandButton}
          onClick={(e) => onSubfolderExpand?.(folder._id, folder.folder_name, e)}
        >
          {expandedSidebarItems[folder._id] ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
        </button>
      </button>
      
      {/* Renderizar subcarpetas anidadas si existen */}
      {expandedSidebarItems[folder._id] && sidebarFolders[folder._id] && (
        <div className={styles.nestedFolders}>
          {sidebarFolders[folder._id].map((nestedFolder) => 
            renderSubfolder(nestedFolder, level + 1)
          )}
        </div>
      )}
    </div>
  );

  // Renderizar carpetas de "Mis archivos" y "Favoritos" (sin expansión anidada)
  const renderUserFolder = (folder: SubfolderItem) => (
    <div key={folder._id} className={styles.subfolderWrapper}>
      <button
        className={styles.subfolderItem}
        onClick={() => onSubfolderClick?.(folder._id, folder.folder_name)}
      >
        <Folder size={14} />
        <h3 className={styles.subfolderItemfoldername}>{folder.folder_name}</h3>
      </button>
    </div>
  );

  // Handler para click en item principal
  const handleItemClick = (item: SidebarItem) => {
    onItemClick?.(item);
    
    // Si se hace clic en una sección principal, cambiar la vista
if (item.label === 'Mis archivos' || item.label === 'Contenedor' || item.label === 'Favoritos' || item.label === 'Papelera') {
  onSectionChange?.(item.label);
}
  };

  const handleExpandClick = (itemLabel: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onExpandClick?.(itemLabel);
  };

  return (
    <div className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item, index) => (
          <div key={index} className={styles.sidebarItemWrapper}>
            <button
              className={`${styles.sidebarNavItem} ${
                activeSection === item.label ? styles.active : ''
              }`} // Usar activeSection para determinar el estado activo
              onClick={() => handleItemClick(item)}
            >
              <item.icon size={20} />
              {item.label}
              {item.expandable && (
                <button
                  className={styles.expandButton}
                  onClick={(e) => handleExpandClick(item.label, e)}
                >
                  {expandedSidebarItems[item.label] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
            </button>
            
            {/* Mostrar subcarpetas si están expandidas */}
            {item.expandable && 
            expandedSidebarItems[item.label] && 
            sidebarFolders[item.label] && (
              <div className={styles.subfoldersList}>
                {sidebarFolders[item.label].map((subfolder) => {
                  // Diferentes renders según la sección
                  if (item.label === 'Favoritos' || item.label === 'Mis archivos') {
                    // Sin expansión anidada
                    return renderUserFolder(subfolder);
                  } else {
                    // Con expansión anidada (Contenedor)
                    return renderSubfolder(subfolder, 1);
                  }
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ContentSidebar;