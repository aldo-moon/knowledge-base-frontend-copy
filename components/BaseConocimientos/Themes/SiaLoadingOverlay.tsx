// components/SiaLoadingOverlay.tsx
import React, { useState, useEffect} from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface SiaLoadingOverlayProps {
  isVisible: boolean;
  isDraft: boolean;
}

const SiaLoadingOverlay: React.FC<SiaLoadingOverlayProps> = ({ isVisible, isDraft }) => {
  
  // 1. CORRECCIÓN DE HOOKS: Los Hooks deben ir al principio, sin el 'React.'
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0); 

  const messages = isDraft 
    ? [
        "SIA está guardando tu borrador...",
        "Preparando el contenido",
        "Casi listo..."
      ]
    : [
        "SIA está aprendiendo el nuevo tema...",
        "Generando embeddings inteligentes",
        "Indexando contenido para búsquedas",
        "Preparando respuestas contextuales",
        "Finalizando..."
      ];
      
  useEffect(() => { 
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Usamos messages.length aquí
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length); 
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, messages.length]); // Dependencia messages.length es segura porque 'messages' no cambia por render

  // 2. CORRECCIÓN DE HOOKS: El 'return' temprano debe ir después de los Hooks
     if (!isVisible) return null; 
 
  return (

<div style={{

position: 'fixed',

top: 0,

left: 0,

right: 0,

bottom: 0,

backgroundColor: 'rgba(26, 28, 47, 0.95)',

backdropFilter: 'blur(8px)',

display: 'flex',

alignItems: 'center',

justifyContent: 'center',

zIndex: 9999,

animation: 'fadeIn 0.3s ease-in'

}}>

<style>

{`

@keyframes fadeIn {

from { opacity: 0; }

to { opacity: 1; }

}


@keyframes pulse {

0%, 100% { transform: scale(1); opacity: 1; }

50% { transform: scale(1.1); opacity: 0.8; }

}


@keyframes rotate {

from { transform: rotate(0deg); }

to { transform: rotate(360deg); }

}


@keyframes slideUp {

from {

opacity: 0;

transform: translateY(10px);

}

to {

opacity: 1;

transform: translateY(0);

}

}


@keyframes float {

0%, 100% { transform: translateY(0px); }

50% { transform: translateY(-10px); }

}


@keyframes shimmer {

0% { background-position: -200% 0; }

100% { background-position: 200% 0; }

}

`}

</style>



<div style={{

textAlign: 'center',

maxWidth: '400px',

padding: '2rem'

}}>

{/* Icono animado de cerebro */}

<div style={{

position: 'relative',

display: 'inline-block',

marginBottom: '2rem'

}}>

<div style={{

position: 'absolute',

top: '50%',

left: '50%',

transform: 'translate(-50%, -50%)',

width: '120px',

height: '120px',

borderRadius: '50%',

background: 'linear-gradient(135deg, rgba(98, 98, 191, 0.2) 0%, rgba(29, 140, 248, 0.2) 100%)',

animation: 'pulse 2s ease-in-out infinite'

}} />


<div style={{

position: 'relative',

zIndex: 1,

background: 'linear-gradient(135deg, #6262bf 0%, #1d8cf8 100%)',

borderRadius: '50%',

width: '80px',

height: '80px',

display: 'flex',

alignItems: 'center',

justifyContent: 'center',

boxShadow: '0 8px 24px rgba(98, 98, 191, 0.3)',

animation: 'float 3s ease-in-out infinite'

}}>

<Brain size={40} color="white" strokeWidth={2} />

</div>



{/* Partículas flotantes */}

<div style={{

position: 'absolute',

top: '10%',

right: '-20%',

animation: 'float 2s ease-in-out infinite'

}}>

<Sparkles size={20} color="#1d8cf8" />

</div>


<div style={{

position: 'absolute',

bottom: '10%',

left: '-20%',

animation: 'float 2.5s ease-in-out infinite'

}}>

<Sparkles size={16} color="#6262bf" />

</div>

</div>



{/* Texto animado */}

<div style={{

minHeight: '60px',

display: 'flex',

alignItems: 'center',

justifyContent: 'center'

}}>

<h2 key={currentMessageIndex} style={{

color: 'white',

fontSize: '1.25rem',

fontWeight: '600',

margin: '0 0 0.5rem 0',

animation: 'slideUp 0.5s ease-out'

}}>

{messages[currentMessageIndex]}

</h2>

</div>



{/* Barra de progreso animada */}

<div style={{

width: '100%',

height: '4px',

backgroundColor: 'rgba(98, 98, 191, 0.2)',

borderRadius: '2px',

overflow: 'hidden',

marginTop: '1.5rem'

}}>

<div style={{

height: '100%',

background: 'linear-gradient(90deg, #6262bf, #1d8cf8, #6262bf)',

backgroundSize: '200% 100%',

animation: 'shimmer 2s linear infinite',

borderRadius: '2px'

}} />

</div>



{/* Texto adicional */}

<p style={{

color: '#9ca3af',

fontSize: '0.875rem',

marginTop: '1rem',

lineHeight: '1.5'

}}>

{isDraft

? 'Guardando tu progreso de forma segura'

: 'Este proceso puede tardar unos segundos mientras SIA procesa el contenido'

}

</p>

</div>

</div>

);

};



export default SiaLoadingOverlay;