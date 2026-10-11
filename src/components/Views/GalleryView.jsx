import React from 'react';
import { 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Calendar, 
  CheckSquare, 
  FileText, 
  ShoppingCart, 
  Bookmark,
  Pin
} from 'lucide-react';

export default function GalleryView({
  items,
  onEditItem,
  onDeleteItem,
  onTogglePin
}) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Bookmark size={32} />
        </div>
        <h3>No hay notas ni tarjetas para mostrar</h3>
        <p style={{ color: 'var(--color-slate)', fontSize: '14px', maxWidth: '360px' }}>
          Crea tu primera nota enriquecida, lista de compras o enlace de interés con el botón "+ Capturar".
        </p>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shopping_list': return <ShoppingCart size={13} />;
      case 'note': return <FileText size={13} />;
      case 'link': return <Bookmark size={13} />;
      default: return <CheckSquare size={13} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'shopping_list': return 'Compras';
      case 'note': return 'Nota';
      case 'link': return 'Enlace';
      default: return 'Tarea';
    }
  };

  return (
    <div className="gallery-grid">
      {items.map(item => {
        const subtasksTotal = item.subtasks?.length || 0;
        const subtasksDone = item.subtasks?.filter(s => s.is_completed).length || 0;

        return (
          <div 
            key={item.id} 
            className={`orbia-card ${item.color_accent || 'pastel-snow'}`}
            onClick={() => onEditItem(item)}
          >
            {/* Card Header */}
            <div className="card-top">
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="card-type-badge">
                  {getTypeIcon(item.type)} {getTypeLabel(item.type)}
                </span>
                <span className={`card-context-tag tag-${item.context}`}>
                  {item.context === 'work' ? '💼 Trabajo' : '🏡 Personal'}
                </span>
              </div>

              <div className="card-actions-hover">
                <button 
                  className="btn-icon" 
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Card Title */}
            <div className="card-title">{item.title}</div>

            {/* Attached Image if present */}
            {item.metadata?.image_url && (
              <img 
                src={item.metadata.image_url} 
                alt="Adjunto" 
                className="card-image-preview" 
              />
            )}

            {/* Link Preview if type is link */}
            {item.type === 'link' && item.metadata?.url && (
              <a 
                href={item.metadata.url} 
                target="_blank" 
                rel="noreferrer" 
                className="card-link-preview"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="link-icon-wrap">
                  <ExternalLink size={16} />
                </div>
                <div className="link-details">
                  <div className="link-title">{item.metadata.site_name || 'Abrir enlace'}</div>
                  <div className="link-url">{item.metadata.url}</div>
                </div>
              </a>
            )}

            {/* Note Content / Text */}
            {item.content && (
              <div className="card-body">
                {item.content}
              </div>
            )}

            {/* Checklists or Subtasks */}
            {subtasksTotal > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                {item.subtasks.slice(0, 4).map(st => (
                  <div key={st.id} className={`subtask-item ${st.is_completed ? 'done' : ''}`}>
                    <span style={{ fontSize: '11px' }}>{st.is_completed ? '✓' : '○'}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {st.title}
                    </span>
                  </div>
                ))}
                {subtasksTotal > 4 && (
                  <span style={{ fontSize: '11px', color: 'var(--color-iron)' }}>
                    +{subtasksTotal - 4} más...
                  </span>
                )}
              </div>
            )}

            {/* Card Footer: Due Date & Status */}
            <div className="card-footer">
              {item.due_date ? (
                <span className="due-date-pill">
                  <Calendar size={11} /> {item.due_date}
                </span>
              ) : (
                <span />
              )}

              <span className={`status-pill status-${item.status}`}>
                {item.status === 'in_progress' ? 'En curso' : item.status === 'done' ? 'Hecho' : 'Por hacer'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
