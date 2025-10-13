// utils/iconMapper.js
// Mapea iconos tim-icons a Font Awesome usando patrones inteligentes

// Mapeos exactos para iconos específicos conocidos
const exactMapping = {
  'icon-coins': 'fas fa-coins',
  'icon-tag': 'fas fa-tag', 
  'icon-notes': 'fas fa-sticky-note',
  'icon-chart-bar-32': 'fas fa-chart-bar',
  'icon-settings': 'fas fa-cog',
  'icon-settings-gear-63': 'fas fa-cogs',
};

// Patrones de mapeo automático basado en palabras clave
const patternMapping = [
  // Dinero y finanzas
  { patterns: ['coin', 'money', 'dollar', 'cash', 'bank', 'credit'], icon: 'fas fa-coins' },
  { patterns: ['credit-card', 'card'], icon: 'fas fa-credit-card' },
  { patterns: ['bank', 'building'], icon: 'fas fa-university' },
  { patterns: ['cart', 'shopping'], icon: 'fas fa-shopping-cart' },
  
  // Usuarios y personas
  { patterns: ['user', 'person', 'profile', 'account'], icon: 'fas fa-user' },
  { patterns: ['users', 'team', 'group', 'people'], icon: 'fas fa-users' },
  { patterns: ['single'], icon: 'fas fa-user' },
  
  // Documentos y archivos
  { patterns: ['paper', 'document', 'file', 'note'], icon: 'fas fa-file-alt' },
  { patterns: ['folder', 'directory'], icon: 'fas fa-folder' },
  { patterns: ['book', 'manual', 'guide'], icon: 'fas fa-book' },
  { patterns: ['bookmark'], icon: 'fas fa-bookmark' },
  
  // Gráficos y análisis
  { patterns: ['chart', 'graph', 'analytics', 'report'], icon: 'fas fa-chart-bar' },
  { patterns: ['pie'], icon: 'fas fa-chart-pie' },
  { patterns: ['line'], icon: 'fas fa-chart-line' },
  { patterns: ['dashboard'], icon: 'fas fa-tachometer-alt' },
  
  // Configuración y herramientas
  { patterns: ['setting', 'config', 'gear', 'tool'], icon: 'fas fa-cog' },
  { patterns: ['wrench', 'repair'], icon: 'fas fa-wrench' },
  { patterns: ['key', 'lock', 'security'], icon: 'fas fa-key' },
  
  // Comunicación
  { patterns: ['email', 'mail', 'message'], icon: 'fas fa-envelope' },
  { patterns: ['phone', 'call'], icon: 'fas fa-phone' },
  { patterns: ['bell', 'notification', 'alert'], icon: 'fas fa-bell' },
  { patterns: ['sound', 'audio', 'speaker'], icon: 'fas fa-volume-up' },
  
  // Tiempo y calendario
  { patterns: ['time', 'clock', 'hour'], icon: 'fas fa-clock' },
  { patterns: ['calendar', 'date', 'schedule'], icon: 'fas fa-calendar-alt' },
  { patterns: ['alarm'], icon: 'fas fa-bell' },
  
  // Ubicación y navegación
  { patterns: ['map', 'location', 'place', 'pin'], icon: 'fas fa-map-marker-alt' },
  { patterns: ['world', 'globe', 'earth'], icon: 'fas fa-globe' },
  { patterns: ['navigation', 'compass'], icon: 'fas fa-compass' },
  { patterns: ['left', 'back'], icon: 'fas fa-arrow-left' },
  { patterns: ['right', 'forward'], icon: 'fas fa-arrow-right' },
  { patterns: ['up'], icon: 'fas fa-arrow-up' },
  { patterns: ['down'], icon: 'fas fa-arrow-down' },
  
  // Tecnología
  { patterns: ['laptop', 'computer'], icon: 'fas fa-laptop' },
  { patterns: ['mobile', 'phone'], icon: 'fas fa-mobile-alt' },
  { patterns: ['wifi', 'signal'], icon: 'fas fa-wifi' },
  { patterns: ['cloud'], icon: 'fas fa-cloud' },
  { patterns: ['database', 'server'], icon: 'fas fa-database' },
  
  // Transporte y logística
  { patterns: ['car', 'vehicle'], icon: 'fas fa-car' },
  { patterns: ['truck', 'delivery'], icon: 'fas fa-truck' },
  { patterns: ['plane', 'flight'], icon: 'fas fa-plane' },
  { patterns: ['ship', 'boat'], icon: 'fas fa-ship' },
  { patterns: ['train'], icon: 'fas fa-train' },
  
  // Entretenimiento
  { patterns: ['game', 'play', 'controller'], icon: 'fas fa-gamepad' },
  { patterns: ['music', 'song'], icon: 'fas fa-music' },
  { patterns: ['video', 'film'], icon: 'fas fa-video' },
  { patterns: ['camera'], icon: 'fas fa-camera' },
  
  // Acciones y estados
  { patterns: ['add', 'plus', 'new'], icon: 'fas fa-plus' },
  { patterns: ['edit', 'pencil', 'write'], icon: 'fas fa-edit' },
  { patterns: ['delete', 'trash', 'remove'], icon: 'fas fa-trash' },
  { patterns: ['save', 'download'], icon: 'fas fa-download' },
  { patterns: ['upload', 'import'], icon: 'fas fa-upload' },
  { patterns: ['refresh', 'reload', 'sync'], icon: 'fas fa-sync-alt' },
  { patterns: ['search', 'find'], icon: 'fas fa-search' },
  { patterns: ['filter'], icon: 'fas fa-filter' },
  { patterns: ['sort'], icon: 'fas fa-sort' },
  
  // Símbolos y formas
  { patterns: ['star', 'favourite', 'favorite'], icon: 'fas fa-star' },
  { patterns: ['heart', 'like', 'love'], icon: 'fas fa-heart' },
  { patterns: ['circle', 'dot'], icon: 'fas fa-circle' },
  { patterns: ['square'], icon: 'fas fa-square' },
  { patterns: ['triangle'], icon: 'fas fa-play' },
  { patterns: ['diamond'], icon: 'fas fa-gem' },
  
  // Elementos de interfaz
  { patterns: ['menu', 'bars', 'hamburger'], icon: 'fas fa-bars' },
  { patterns: ['close', 'x'], icon: 'fas fa-times' },
  { patterns: ['check', 'ok', 'confirm'], icon: 'fas fa-check' },
  { patterns: ['warning', 'danger'], icon: 'fas fa-exclamation-triangle' },
  { patterns: ['info', 'information'], icon: 'fas fa-info-circle' },
  
  // Objetos diversos
  { patterns: ['gift', 'present'], icon: 'fas fa-gift' },
  { patterns: ['trophy', 'award', 'prize'], icon: 'fas fa-trophy' },
  { patterns: ['badge', 'certificate'], icon: 'fas fa-certificate' },
  { patterns: ['umbrella'], icon: 'fas fa-umbrella' },
  { patterns: ['glasses'], icon: 'fas fa-glasses' },
  { patterns: ['bulb', 'idea', 'light'], icon: 'fas fa-lightbulb' },
  { patterns: ['puzzle'], icon: 'fas fa-puzzle-piece' },
  { patterns: ['rocket', 'spaceship'], icon: 'fas fa-rocket' },
  { patterns: ['atom', 'science'], icon: 'fas fa-atom' },
  
  // Tags y etiquetas
  { patterns: ['tag', 'label'], icon: 'fas fa-tag' },
  { patterns: ['tags'], icon: 'fas fa-tags' },
];

// Función principal para obtener el icono
export const getIconClass = (timIcon) => {
  if (!timIcon) {
    return 'fas fa-file-alt'; // Icono por defecto
  }
  
  // Limpiar el string de entrada
  const cleanIcon = timIcon.replace(/^tim-icons\s+/, '').replace(/^icon-/, '').trim().toLowerCase();
  
  // 1. Buscar mapeo exacto primero
  const exactKey = timIcon.replace(/^tim-icons\s+/, '').trim();
  if (exactMapping[exactKey]) {
    return exactMapping[exactKey];
  }
  
  // 2. Buscar por patrones
  for (const mapping of patternMapping) {
    if (mapping.patterns.some(pattern => cleanIcon.includes(pattern))) {
      return mapping.icon;
    }
  }
  
  // 3. Mapeo por números (muchos iconos tim tienen números)
  if (/\d+/.test(cleanIcon)) {
    const baseIcon = cleanIcon.replace(/[-_]\d+$/, '');
    for (const mapping of patternMapping) {
      if (mapping.patterns.some(pattern => baseIcon.includes(pattern))) {
        return mapping.icon;
      }
    }
  }
  
  // 4. Fallback: icono por defecto
  return 'fas fa-file-alt';
};

// Función para renderizar el icono como JSX
export const renderIcon = (timIcon, size = '1x', additionalClasses = '') => {
  const iconClass = getIconClass(timIcon);
  const sizeClass = size !== '1x' ? ` fa-${size}` : '';
  
  return (
    <i className={`${iconClass}${sizeClass} ${additionalClasses}`} />
  );
};

// Función para agregar mapeos exactos específicos
export const addExactMapping = (timIconName, fontAwesomeClass) => {
  exactMapping[timIconName] = fontAwesomeClass;
};

// Función de debug (solo para desarrollo)
export const debugIcon = (timIcon) => {
  const cleanIcon = timIcon.replace(/^tim-icons\s+/, '').replace(/^icon-/, '').trim().toLowerCase();
  const result = getIconClass(timIcon);
  
  console.log(`🔍 "${timIcon}" -> "${cleanIcon}" -> "${result}"`);
  return result;
};

// Función para obtener estadísticas de mapeo
export const getMappingStats = (iconList) => {
  const stats = {
    exact: 0,
    pattern: 0,
    fallback: 0,
    total: iconList.length
  };
  
  iconList.forEach(icon => {
    const exactKey = icon.replace(/^tim-icons\s+/, '').trim();
    if (exactMapping[exactKey]) {
      stats.exact++;
    } else {
      const cleanIcon = icon.replace(/^tim-icons\s+/, '').replace(/^icon-/, '').trim().toLowerCase();
      let foundPattern = false;
      for (const mapping of patternMapping) {
        if (mapping.patterns.some(pattern => cleanIcon.includes(pattern))) {
          stats.pattern++;
          foundPattern = true;
          break;
        }
      }
      if (!foundPattern) {
        stats.fallback++;
      }
    }
  });
  
  return stats;
};