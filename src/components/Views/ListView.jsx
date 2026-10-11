import React from 'react';
import { 
  Check, 
  Clock, 
  ExternalLink, 
  FileText, 
  CheckSquare, 
  ShoppingCart, 
  Bookmark, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ListView({
  items,
  onToggleComplete,
  onEditItem,
  onDeleteItem
}) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <CheckSquare size={32} />
        </div>
        <h3>No hay elementos en esta vista</h3>
        <p style={{ color: 'var(--color-slate)', fontSize: '14px', maxWidth: '360px' }}>
          Usa el botón "+ Capturar" para agregar una nueva tarea, nota, compra o enlace.
        </p>
      </div>
    );
  }

  const handleCheckClick = (e, item) => {
    e.stopPropagation();
    const willBeDone = item.status !== 'done';
    if (willBeDone) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6161ff', '#bcfe90', '#abf0ff', '#e98dfe']
        });
      } catch (err) {}
    }
    onToggleComplete(item.id);
  };

  const getDueDateLabel = (dueDateStr) => {
    if (!dueDateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    if (dueDateStr < today) {
      return { text: `Vencido (${dueDateStr})`, className: 'overdue' };
    } else if (dueDateStr === today) {
      return { text: 'Hoy', className: 'today' };
    }
    return { text: dueDateStr, className: 'normal' };
  };

  return (
    <div className="list-view-container">
      {items.map(item => {
        const isCompleted = item.status === 'done';
        const dueInfo = getDueDateLabel(item.due_date);
        const subtasksTotal = item.subtasks?.length || 0;
        const subtasksDone = item.subtasks?.filter(s => s.is_completed).length || 0;

        return (
          <div 
            key={item.id} 
            className={`list-item-row ${isCompleted ? 'completed' : ''}`}
            onClick={() => onEditItem(item)}
          >
            {/* Custom Checkbox */}
            <div 
              className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}
              onClick={(e) => handleCheckClick(e, item)}
              title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
            >
              {isCompleted && <Check size={14} strokeWidth={3} />}
            </div>

            {/* Main Info */}
            <div className="list-item-main">
              <span className="item-title">{item.title}</span>
              
              {/* Context Tag */}
              <span className={`card-context-tag tag-${item.context}`}>
                {item.context === 'work' ? '💼 Trabajo' : '🏡 Personal'}
              </span>

              {/* Subtasks pill if present */}
              {subtasksTotal > 0 && (
                <span className="due-date-pill" style={{ background: 'var(--color-cloud)' }}>
                  ✓ {subtasksDone}/{subtasksTotal}
                </span>
              )}

              {/* Due Date */}
              {dueInfo && (
                <span className={`due-date-pill ${dueInfo.className}`}>
                  <Calendar size={11} /> {dueInfo.text}
                </span>
              )}
            </div>

            {/* Metadata & Actions */}
            <div className="list-item-meta">
              <span className={`status-pill status-${item.status}`}>
                {item.status === 'in_progress' ? 'En curso' : item.status === 'done' ? 'Hecho' : 'Por hacer'}
              </span>

              <button 
                className="btn-icon" 
                onClick={(e) => { e.stopPropagation(); onEditItem(item); }}
                title="Editar"
              >
                <Edit3 size={14} />
              </button>

              <button 
                className="btn-icon" 
                onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
