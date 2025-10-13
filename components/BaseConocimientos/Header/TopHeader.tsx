// components/BaseConocimientos/Header/TopHeader.tsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, ChevronDown, Bell, Search, HelpCircle } from 'lucide-react';
import { authService } from '../../../services/authService';
import styles from './TopHeader.module.css';
import { FaApple, FaAndroid } from 'react-icons/fa';
import { Type } from 'lucide-react';

interface UserData {
  _id: string;
  user_id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  position?: string;
}

interface TopHeaderProps {
  currentUserId?: string | null;
  onLogout?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  currentUserId,
  onLogout 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUserId) return;
      
      setIsLoadingUser(true);
      try {
        // Obtener datos reales del usuario usando tu backend
        const { usuarioService } = await import('../../../services/usuarioService');
        const rawUserData = await usuarioService.getUserById(currentUserId);
        
        if (rawUserData) {
          // Usar la función de formateo para obtener datos consistentes
          const formattedData = usuarioService.formatUserData(rawUserData);
          setUserData(formattedData);
          //console.log('✅ Datos del usuario cargados:', formattedData);
        } else {
          console.log('⚠️ No se encontraron datos para el usuario:', currentUserId);
          // Fallback si no se encuentran datos
          setUserData({
            _id: currentUserId,
            user_id: currentUserId,
            name: `Usuario ${currentUserId.toString().slice(-4)}`,
            email: 'usuario@empresa.com'
          });
        }
      } catch (error) {
        console.error('❌ Error al obtener datos del usuario:', error);
        // Fallback en caso de error
        setUserData({
          _id: currentUserId,
          user_id: currentUserId,
          name: `Usuario ${currentUserId.toString().slice(-4)}`,
          email: 'usuario@empresa.com'
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [currentUserId]);

  const handleLogout = () => {
    authService.logout();
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
    // Recargar la página para reiniciar la aplicación
    window.location.reload();
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Aquí puedes implementar la navegación al perfil
    console.log('Navegar a perfil');
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    // Aquí puedes implementar la navegación a configuraciones
    console.log('Navegar a configuraciones');
  };

  const getDisplayName = () => {
    if (isLoadingUser) return 'Cargando...';
    if (!userData) return 'Usuario';
    
    // Priorizar first_name + last_name
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    
    // Si solo hay first_name
    if (userData.first_name) {
      return userData.first_name;
    }
    
    // Usar el campo name si existe
    if (userData.name) {
      return userData.name;
    }
    
    // Fallback con user_id o _id
    const idToUse = userData.user_id || userData._id;
    return `Usuario ${idToUse.toString().slice(-4)}`;
  };

  const getInitials = () => {
    if (!userData) return 'U';
    
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
    }
    
    if (userData.name) {
      const names = userData.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return userData.name[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <header className={styles.topHeader}>
      {/* Lado izquierdo - Título del sistema */}
      <div className={styles.leftSection}>
        <h1 className={styles.systemTitle}>
          SISTEMA DE REPORTES E INDICADORES
        </h1>
      </div>

      {/* Lado derecho - Información del usuario e iconos */}
      <div className={styles.rightSection}>
        {/* Iconos adicionales */}
        <div className={styles.iconSection}>
          <button 
            className={styles.iconButton} 
            title="Descargar para iOS"
            onClick={() => window.open('https://apps.apple.com/us/app/sri-m%C3%B3vil/id6479270163', '_blank')}
          >
            {/* @ts-ignore */}
            <FaApple size={22} />
          </button>
          
          <button 
            className={styles.iconButton} 
            title="Descargar para Android"
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.zimple.aemretailapp&pli=1', '_blank')}
          >
            {/* @ts-ignore */}
            <FaAndroid size={22} />
          </button>
          
          <button className={styles.iconButton} title="Ayuda">
          <img src="/knowledge/Supporte_a.svg" alt="Tema" className={styles.themeIcon2} />
          </button>
        </div>

        {/* Dropdown del usuario */}
        <div className={styles.userSection} ref={dropdownRef}>
          <button
            className={styles.userButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            {/* Avatar */}
            <div className={styles.avatar}>
              {userData?.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="Avatar del usuario"
                  className={styles.avatarImage}
                />
              ) : (
                <span className={styles.avatarInitials}>
                  {getInitials()}
                </span>
              )}
            </div>
            
            {/* Información del usuario */}
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {getDisplayName()}
              </span>
              {userData?.email && (
                <span className={styles.userEmail}>
                  {userData.email}
                </span>
              )}
            </div>
            
            {/* Icono de dropdown */}
            <ChevronDown 
              size={16} 
              className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button 
                className={styles.dropdownItem}
                onClick={handleProfileClick}
              >
                <User size={16} />
                <span>Perfil</span>
              </button>
              
              <button 
                className={styles.dropdownItem}
                onClick={handleSettingsClick}
              >
                <Settings size={16} />
                <span>Configuraciones</span>
              </button>
              
              <div className={styles.dropdownDivider} />
              
              <button 
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;