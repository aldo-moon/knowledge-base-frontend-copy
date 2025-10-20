// components/BaseConocimientos/ChatbotWidget/ChatBot.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader } from 'lucide-react';
import Lottie from 'lottie-react';
import styles from './ChatbotWidget.module.css';
import { chatbotService } from '../../../services/chatbotService';
import chatbotAnimation from '../../../public/Animations/Animation - 1748036348670.json';
import headerAnimation from '../../../public/Animations/Animation - 1748036609476.json';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  temas?: Array<{ id: string; titulo: string; url: string; similarity: number }>;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isWelcomeDismissed, setIsWelcomeDismissed] = useState(false); 

  const welcomeMessages = [
    "¡Hola! ¿Necesitas ayuda?",
    "¿Tienes alguna pregunta?",
    "Estoy aquí para ayudarte"
  ];
  const MODELO_ID = '68ed53b5506f8032f23fba37'; // TODO: Id del modelo a usar
  const USER_ID = null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 useEffect(() => {
  if (!isOpen && !isWelcomeDismissed) { 
    const messageInterval = setInterval(() => {
      if (showWelcomeMessage) {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setShowWelcomeMessage(false);
          setIsAnimatingOut(false);
          setCurrentMessageIndex(prev => (prev + 1) % welcomeMessages.length);
        }, 500);
      } else {
        setShowWelcomeMessage(true);
      }
    }, 20000);

    return () => clearInterval(messageInterval);
  }
}, [isOpen, showWelcomeMessage, isWelcomeDismissed]); 

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const preguntaActual = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.preguntar(
        preguntaActual,
        MODELO_ID,
        sessionId as any,
        USER_ID
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.respuesta,
        sender: 'bot',
        temas: response.temas_relacionados
      };

      setMessages(prev => [...prev, botMessage]);
      
      console.log('📊 Métricas:', {
        similarity: response.similarity_score,
        needs_review: response.needs_review,
        session: response.session_id
      });
      
    } catch (error) {
      console.error('❌ Error consultando chatbot:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.',
        sender: 'bot'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {!isOpen ? (
        <div style={{ position: 'relative' }}>
          {showWelcomeMessage && (
            <div className={`${styles.speechBubble} ${isAnimatingOut ? styles.fadeOut : ''}`}>
              {welcomeMessages[currentMessageIndex]}
              <button 
                className={styles.closeBubble}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAnimatingOut(true);
                  setTimeout(() => {
                    setShowWelcomeMessage(false);
                    setIsAnimatingOut(false);
                    setIsWelcomeDismissed(true); 
                  }, 500);
                }}
              >
                ×
              </button>
            </div>
          )}
        <button onClick={() => setIsOpen(true)} className={styles.floatingButton}>
          <Lottie 
            animationData={chatbotAnimation}
            loop={true}
            style={{ width: 90, height: 90 }}
          />
        </button>
      </div>
      ) : (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Lottie 
                animationData={headerAnimation}
                loop={true}
                style={{ width: 90, height: 90 }}
              />
              <span>Agente SIA</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className={styles.messages}>
            {messages.map(msg => (
              <div key={msg.id} className={styles[msg.sender]}>
                <div>{msg.text}</div>
                {msg.temas && msg.temas.length > 0 && (
                  <div className={styles.temasRelacionados}>
                    <small>Temas relacionados:</small>
                    {msg.temas.map(tema => (
                      <span 
                        key={tema.id} 
                        className={styles.temaLink}
                      >
                        {tema.titulo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={styles.bot}>
                <Loader size={16} className={styles.spinner} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;