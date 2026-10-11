import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Check, 
  CheckSquare, 
  Trash2, 
  Edit3,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS = [
  { id: 'todo', label: 'Por Hacer', color: '#64748b' },
  { id: 'in_progress', label: 'En Progreso', color: '#eab308' },
  { id: 'done', label: 'Completado', color: '#10b981' }
];

export default function KanbanView({
  items,
  onUpdateStatus,
  onEditItem,
  onDeleteItem
}) {
  const handleMove = (e, item, targetStatus) => {
    e.stopPropagation();
    if (targetStatus === 'done') {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#6161ff', '#bcfe90', '#abf0ff', '#e98dfe']
        });
      } catch (err) {}
    }
    onUpdateStatus(item.id, targetStatus);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map(col => {
        const columnItems = items.filter(it => it.status === col.id);

        return (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-col-title">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                <span>{col.label}</span>
              </div>
              <span className="kanban-counter">{columnItems.length}</span>
            </div>

            <div className="kanban-cards-stack">
              {columnItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-iron)', fontSize: '13px' }}>
                  Sin elementos
                </div>
              ) : (
                columnItems.map(item => {
                  const subtasksTotal = item.subtasks?.length || 0;
                  const subtasksDone = item.subtasks?.filter(s => s.is_completed).length || 0;
                  const progressPct = subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;

                  return (
                    <div 
                      key={item.id} 
                      className={`orbia-card ${item.color_accent || 'pastel-snow'}`}
                      onClick={() => onEditItem(item)}
                    >
                      <div className="card-top">
                        <span className={`card-context-tag tag-${item.context}`}>
                          {item.context === 'work' ? '💼 Trabajo' : '🏡 Personal'}
                        </span>
                        
                        <div className="card-actions-hover">
                          <button 
                            className="btn-icon" 
                            style={{ width: '26px', height: '26px' }}
                            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="card-title">{item.title}</div>

                      {item.content && (
                        <div className="card-body" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                          {item.content}
                        </div>
                      )}

                      {/* Subtasks progress bar */}
                      {subtasksTotal > 0 && (
                        <div className="subtasks-progress">
                          <div className="progress-header">
                            <span>Subtareas</span>
                            <span>{subtasksDone}/{subtasksTotal} ({Math.round(progressPct)}%)</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="card-footer">
                        {item.due_date ? (
                          <span className="due-date-pill">
                            <Calendar size={11} /> {item.due_date}
                          </span>
                        ) : <span />}

                        {/* Shift column buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {col.id !== 'todo' && (
                            <button 
                              className="btn-icon" 
                              style={{ width: '24px', height: '24px' }}
                              onClick={(e) => handleMove(e, item, col.id === 'done' ? 'in_progress' : 'todo')}
                              title="Mover atrás"
                            >
                              <ArrowLeft size={12} />
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button 
                              className="btn-icon" 
                              style={{ width: '24px', height: '24px' }}
                              onClick={(e) => handleMove(e, item, col.id === 'todo' ? 'in_progress' : 'done')}
                              title="Mover adelante"
                            >
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
