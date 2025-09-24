// types/index.ts - Definiciones centralizadas de tipos e interfaces

import { ReactElement, ElementType } from 'react';

// ==========================================
// INTERFACES BÁSICAS DE DOMINIO
// ==========================================

export interface User {
  _id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
  creation_date?: string;
  last_login?: string;
  active?: boolean;
}

export interface Folder {
  _id: string;
  folder_name: string;
  description?: string;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
  parent_folder_id?: string;
  icon?: string;
  color?: string;
}

export interface Theme {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  user_creator_id: string;
  creation_date: string;
  last_update?: string;
  tags?: string[];
  status?: 'active' | 'archived' | 'draft';
  views_count?: number;
  files_attachment_id?: string[];
  is_public?: boolean;
  likes?: number;
  comments_count?: number;
}

export interface Archivo {
  _id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  upload_date: string;
  user_uploader_id: string;
  description?: string;
  tags?: string[];
  folder_id?: string;
  theme_id?: string;
  is_public?: boolean;
  download_count?: number;
  thumbnail_path?: string;
}

export interface Comment {
  _id: string;
  content: string;
  user_id: string;
  user_name?: string;
  theme_id?: string;
  creation_date: string;
  parent_comment_id?: string;
  likes?: number;
  replies?: Comment[];
}

export interface Favorite {
  _id: string;
  user_id: string;
  content_id: string;
  content_type: 'theme' | 'folder' | 'file';
  creation_date: string;
}

export interface Aplicacion {
  id: string;
  script_id: number;
  nombre: string;
  icono: string;
  tipo: number;
  grupo: string;
  script: string;
  externo?: number;
  orden_menu: number;
  expandable: boolean;
  subsecciones: Subseccion[];
  navegacionUrl?: string | null;
  navegable: boolean;
}

export interface Subseccion {
  _id: string;
  script_id: number;
  nombre: string;
  icono: string;
  script: string;
  externo?: number;
  orden_submenu: number;
  grupo: string;
  navegacionUrl?: string | null;
  navegable: boolean;
}

// ==========================================
// INTERFACES DE UI Y COMPONENTES
// ==========================================

export interface FilterOption {
  icon: ElementType;
  label: string;
  action?: string;
  count?: number;
  color?: string;
}

export interface SortOption {
  icon: ElementType;
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

export interface NavigationItem {
  id: string;
  name: string;
  icon?: string;
  path: string;
  type: 'folder' | 'theme' | 'section';
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'theme' | 'root';
  clickable?: boolean;
}

export interface FolderDetails {
  name: string;
  elements: number;
  creator: string;
  createdDate: string;
  type: string;
  access: string;
  lastOpened: string;
  lastModified: string;
  size?: string;
  tags?: string[];
}

export interface ThemeDetails {
  _id: string;
  title_name: string;
  description?: string;
  priority?: number;
  creation_date: string;
  last_update?: string;
  user_creator_id: string;
  creator_name?: string;
  views_count?: number;
  likes?: number;
  comments_count?: number;
  tags?: string[];
  files_attachment_id?: string[];
  folder_id?: string;
  folder_name?: string;
}

// ==========================================
// INTERFACES DE FORMULARIOS
// ==========================================

export interface FolderFormData {
  folder_name: string;
  description?: string;
  parent_folder_id?: string;
  icon?: string;
  color?: string;
}

export interface ThemeFormData {
  title_name: string;
  description?: string;
  priority?: number;
  folder_id?: string;
  tags?: string[];
  files?: File[];
  is_public?: boolean;
}

export interface FileUploadData {
  file: File;
  description?: string;
  tags?: string[];
  folder_id?: string;
  theme_id?: string;
}

export interface SearchFormData {
  query: string;
  filters?: {
    type?: 'theme' | 'folder' | 'file';
    dateRange?: {
      from: string;
      to: string;
    };
    priority?: number[];
    tags?: string[];
    creator?: string;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// ==========================================
// INTERFACES DE ESTADOS Y CONTEXTO
// ==========================================

export interface AppState {
  user: User | null;
  currentFolder: Folder | null;
  currentTheme: Theme | null;
  navigationPath: NavigationItem[];
  searchTerm: string;
  activeFilters: Record<string, boolean>;
  selectedItems: string[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// ==========================================
// INTERFACES DE MODALES Y ACCIONES
// ==========================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ConfirmationModalProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: ElementType;
  action: () => void;
  variant?: 'default' | 'danger' | 'warning';
  disabled?: boolean;
  separator?: boolean;
}

// ==========================================
// INTERFACES DE API Y RESPUESTAS
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResults {
  themes: Theme[];
  folders: Folder[];
  files: Archivo[];
  total: number;
  pagination: PaginationInfo;
}

// ==========================================
// INTERFACES DE CONFIGURACIÓN
// ==========================================

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    maxFilesPerUpload: number;
  };
  ui: {
    itemsPerPage: number;
    defaultSort: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

// ==========================================
// TYPES AUXILIARES
// ==========================================

export type ContentType = 'theme' | 'folder' | 'file';
export type ViewMode = 'grid' | 'list' | 'details';
export type SortDirection = 'asc' | 'desc';
export type Priority = 0 | 1 | 2; // Baja, Media, Alta
export type UserRole = 'admin' | 'editor' | 'viewer';

// Para routing
export interface RouteParams {
  folderId?: string;
  themeId?: string;
  section?: string;
}

export interface NavigationState {
  currentFolderId: string | null;
  currentThemeId: string | null;
  isCreatingTheme: boolean;
  isViewingTheme: boolean;
  navigationPath: NavigationItem[];
  activeSection: string | null;
}

// Para eventos
export interface FileDropEvent {
  files: File[];
  folderId?: string;
  themeId?: string;
}

export interface SearchEvent {
  query: string;
  filters: SearchFormData['filters'];
}

// Para validaciones
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: Record<string, string>;
}

// Para notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// ==========================================
// EXPORT DE UTILIDADES DE TIPOS
// ==========================================

// Helper para crear tipos parciales
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper para crear tipos requeridos
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Helper para extraer tipos de arrays
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Helper para hacer campos opcionales
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;