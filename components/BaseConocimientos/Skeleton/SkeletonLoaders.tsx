// components/BaseConocimientos/Skeleton/SkeletonLoaders.tsx
import React from 'react';
import styles from './SkeletonLoaders.module.css';

interface SkeletonProps {
  index?: number;
}

export const FolderCardSkeleton: React.FC<SkeletonProps> = ({ index = 0 }) => (
  <div 
    className={styles.folderCardSkeleton}
  >
    <div className={styles.skeletonIcon} />
    <div className={styles.skeletonTextLarge} />
    <div className={styles.skeletonTextSmall} />
  </div>
);

export const ThemeCardSkeleton: React.FC<SkeletonProps> = ({ index = 0 }) => (
  <div 
    className={styles.themeCardSkeleton}
  >
    <div className={styles.skeletonBadge} />
    <div className={styles.skeletonTextLarge} />
    <div className={styles.skeletonTextMedium} />
    <div className={styles.skeletonTextSmall} />
  </div>
);

export const FileCardSkeleton: React.FC<SkeletonProps> = ({ index = 0 }) => (
  <div 
    className={styles.fileCardSkeleton}
  >
    <div className={styles.skeletonIcon} />
    <div className={styles.skeletonTextMedium} />
    <div className={styles.skeletonTextSmall} />
  </div>
);

export default {
  FolderCardSkeleton,
  ThemeCardSkeleton,
  FileCardSkeleton
};