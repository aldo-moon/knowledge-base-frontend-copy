import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! ¿En qué puedo ayudarte?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    // Aquí conectarías tu API de chatbot
  };

  return (
    <div className={styles.widgetContainer}>
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className={styles.floatingButton}>
          <MessageCircle size={28} />
        </button>
      ) : (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <span>Asistente Virtual</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          <div className={styles.messages}>
            {messages.map(msg => (
              <div key={msg.id} className={styles[msg.sender]}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.inputArea}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe..."
            />
            <button onClick={handleSend}><Send size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;