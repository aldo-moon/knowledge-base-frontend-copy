// components/BaseConocimientos/Details/ThemeCommentsPanel.tsx
import React, { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import styles from './../../../styles/base-conocimientos.module.css';
import { comentarioService } from '../../../services/comentarioService';

interface Comment {
  _id: string;
  comment_user_id: {
    nombre: string;
    aPaterno?: string;
  } | string;
  message: string;
  creation_date: string;
  topic_id: string;
}

interface ThemeCommentsPanelProps {
  themeId: string;
}

export const ThemeCommentsPanel: React.FC<ThemeCommentsPanelProps> = ({ themeId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ID del usuario actual - ajusta según tu implementación
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

// Y agrega este useEffect:
useEffect(() => {
  const userId = localStorage.getItem('user_id');
  setCurrentUserId(userId);
}, []);
  useEffect(() => {
    loadComments();
  }, [themeId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los comentarios y filtrar por tema
      const allComments = await comentarioService.getAllComentarios();
      const themeComments = allComments.filter((comment: Comment) => 
        comment.topic_id === themeId
      );
      
      // Ordenar por fecha más reciente primero
      const sortedComments = themeComments.sort((a: Comment, b: Comment) => 
        new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
      );
      
      setComments(sortedComments);
    } catch (err) {
      setError('Error al cargar los comentarios');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;

    try {
      setSubmitting(true);
      
      // En handleSubmitComment:
        const commentData = {
          message: commentText.trim(),
          comment_user_id: currentUserId, // ← Cambio aquí
          topic_id: themeId
        };

      await comentarioService.createComentario(commentData);
      
      // Limpiar el campo de texto
      setCommentText('');
      
      // Recargar comentarios para mostrar el nuevo
      await loadComments();
      
    } catch (err) {
      setError('Error al publicar el comentario');
      console.error('Error creating comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getAuthorName = (author: Comment['comment_user_id']) => {
  if (typeof author === 'string') {
    return 'Usuario';
  }
  // ✅ AGREGAR validación para nombre
  if (!author || !author.nombre) {
    return 'Usuario';
  }
  return `${author.nombre} ${author.aPaterno || ''}`.trim();
};

const getAuthorInitial = (author: Comment['comment_user_id']) => {
  if (typeof author === 'string') {
    return 'U';
  }
  // ✅ AGREGAR validación para nombre
  if (!author || !author.nombre) {
    return 'U';
  }
  return author.nombre.charAt(0).toUpperCase();
};

  return (
    <div className={styles.commentsPanel}>
      {/* Header */}
      <div className={styles.commentsPanelHeader}>
        <h2 className={styles.commentsPanelTitle}>Comentarios</h2>
        {comments.length > 0 && (
          <span className={styles.commentsCount}>({comments.length})</span>
        )}
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
          disabled={submitting}
        />
        
        <button
          className={styles.publishButton}
          onClick={handleSubmitComment}
          disabled={!commentText.trim() || submitting}
        >
          {submitting ? (
            <>
              <Loader size={16} className={styles.spinner} />
              PUBLICANDO...
            </>
          ) : (
            'PUBLICAR'
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className={styles.commentsList}>
        {loading ? (
          <div className={styles.commentsLoading}>
            <Loader size={24} className={styles.spinner} />
            <p>Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className={styles.noComments}>
            <p>No hay comentarios aún.</p>
            <p>¡Sé el primero en comentar!</p>
          </div>
        ) : (
         comments.map((comment) => (
  <div key={comment._id} className={styles.commentItem}>
    <div className={styles.commentAvatar}>
      {getAuthorInitial(comment.comment_user_id)}
    </div>
    
    <div className={styles.commentContent}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>
          {getAuthorName(comment.comment_user_id)}
        </span>
      </div>
      
      <p className={styles.commentText}>{comment.message}</p>
      
      <span className={styles.commentTime}>
        {formatDate(comment.creation_date)}
      </span>
    </div>
    
  </div>
))
        )}
      </div>
    </div>
  );
};

export default ThemeCommentsPanel;