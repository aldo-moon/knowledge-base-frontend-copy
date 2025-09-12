// components/BaseConocimientos/Details/ThemeCommentsPanel.tsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface ThemeCommentsPanelProps {
  themeId: string;
}

export const ThemeCommentsPanel: React.FC<ThemeCommentsPanelProps> = ({ themeId }) => {
  const [commentText, setCommentText] = useState('');
  
  // Datos estáticos de comentarios de ejemplo
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Elena Rodríguez',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      timestamp: '2:48 PM AM',
      avatar: 'E'
    },
    {
      id: '2', 
      author: 'Elena Rodríguez',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      timestamp: '2:48 PM AM',
      avatar: 'E'
    },
    {
      id: '3',
      author: 'Elena Rodríguez', 
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      timestamp: '2:48 PM AM',
      avatar: 'E'
    },
    {
      id: '4',
      author: 'Elena Rodríguez',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      timestamp: '2:48 PM AM',
      avatar: 'E'
    },
    {
      id: '5',
      author: 'Elena Rodríguez',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      timestamp: '2:48 PM AM',
      avatar: 'E'
    }
  ]);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      // Aquí iría la lógica para enviar el comentario al backend
      console.log('Enviando comentario:', commentText);
      setCommentText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className={styles.commentsPanel}>
      {/* Header */}
      <div className={styles.commentsPanelHeader}>
        <h2 className={styles.commentsPanelTitle}>Comentarios</h2>
      </div>

      {/* Comment Input */}
      <div className={styles.commentInputSection}>
        <textarea
          className={styles.commentTextarea}
          placeholder="Escribe tu comentario aquí..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
        />
        
        <button
          className={styles.publishButton}
          onClick={handleSubmitComment}
          disabled={!commentText.trim()}
        >
          PUBLICAR
        </button>
      </div>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentAvatar}>
              {comment.avatar}
            </div>
            
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentTime}>{comment.timestamp}</span>
              </div>
              
              <p className={styles.commentText}>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeCommentsPanel;