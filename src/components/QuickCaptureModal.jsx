import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckSquare, 
  FileText, 
  ShoppingCart, 
  Calendar, 
  Sparkles,
  Paperclip
} from 'lucide-react';

const PASTEL_COLORS = [
  { id: 'pastel-snow', bg: '#ffffff', label: 'Blanco' },
  { id: 'pastel-mint', bg: '#bcfe90', label: 'Menta' },
  { id: 'pastel-sky', bg: '#abf0ff', label: 'Celeste' },
  { id: 'pastel-apricot', bg: '#ff8940', label: 'Durazno' },
  { id: 'pastel-lavender', bg: '#eddff7', label: 'Lavanda' },
  { id: 'pastel-periwinkle', bg: '#e7ecff', label: 'Gris Azulado' },
  { id: 'pastel-peony', bg: '#fcd0f8', label: 'Rosa' }
];

const QUICK_SYMBOLS = ['➜', '✦', '★', '⚡', '📌', '🛒', '💡', '🎯', '✔️', '⚠️', '✓', '❌', '🔥', '📅'];

export default function QuickCaptureModal({
  isOpen,
  onClose,
  onSave,
  editItem
}) {
  const [type, setType] = useState('task');
  const [context, setContext] = useState('personal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorAccent, setColorAccent] = useState('pastel-snow');
  const [priority, setPriority] = useState('normal');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Enlaces & Imágenes
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Subtareas
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (editItem) {
      setType(editItem.type || 'task');
      setContext(editItem.context || 'personal');
      setTitle(editItem.title || '');
      setContent(editItem.content || '');
      setColorAccent(editItem.color_accent || 'pastel-snow');
      setPriority(editItem.priority || 'normal');
      setStatus(editItem.status || 'todo');
      setDueDate(editItem.due_date || '');
      setTagsInput(editItem.tags ? editItem.tags.join(', ') : '');
      setSubtasks(editItem.subtasks || []);
      setLinkUrl(editItem.metadata?.url || '');
      setImageUrl(editItem.metadata?.image_url || '');
    } else {
      // Valores por defecto
      setType('task');
      setContext('personal');
      setTitle('');
      setContent('');
      setColorAccent('pastel-snow');
      setPriority('normal');
      setStatus('todo');
      setDueDate('');
      setTagsInput('');
      setSubtasks([]);
      setLinkUrl('');
      setImageUrl('');
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleInsertSymbol = (sym) => {
    setContent(prev => prev + ' ' + sym + ' ');
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: 'sub-' + Date.now(),
        title: newSubtaskTitle.trim(),
        is_completed: false
      }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, is_completed: !s.is_completed } : s));
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const savedItem = {
      id: editItem ? editItem.id : 'item-' + Date.now(),
      type,
      context,
      title: title.trim(),
      content: content.trim(),
      color_accent: colorAccent,
      priority,
      status,
      due_date: dueDate,
      tags,
      subtasks,
      is_pinned: editItem ? editItem.is_pinned : false,
      metadata: {
        ...(editItem?.metadata || {}),
        url: linkUrl.trim(),
        image_url: imageUrl,
        site_name: linkUrl ? new URL(linkUrl.startsWith('http') ? linkUrl : 'https://' + linkUrl).hostname : ''
      }
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {editItem ? '✏️ Editar Elemento' : '✨ Captura Rápida'}
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo de Elemento & Contexto */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Contenido</label>
              <select 
                className="form-select" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="task">✅ Tarea (Simple / Compleja)</option>
                <option value="shopping_list">🛒 Lista de Compras / Checklist</option>
                <option value="note">📝 Nota Enriquecida & Canvas</option>
                <option value="link">🔗 Enlace de Interés (Read Later)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Espacio de Vida</label>
              <select 
                className="form-select" 
                value={context} 
                onChange={(e) => setContext(e.target.value)}
              >
                <option value="personal">🏡 Personal (Hogar, Salud, Ocio)</option>
                <option value="work">💼 Trabajo (Proyectos, Clientes)</option>
              </select>
            </div>
          </div>

          {/* Título Principal */}
          <div className="form-group">
            <label className="form-label">Título</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="¿Qué tienes en mente? (ej. Comprar frutas, Rediseño landing...)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Si es enlace, campo URL */}
          {type === 'link' && (
            <div className="form-group">
              <label className="form-label">URL del Enlace</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://ejemplo.com/articulo-interesante"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          )}

          {/* Barra de Símbolos y Flechas */}
          <div className="form-group">
            <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Contenido / Notas</span>
              <span style={{ fontSize: '11px', textTransform: 'none', color: 'var(--color-iron)' }}>
                Inserta símbolos rápidos con 1 clic:
              </span>
            </div>
            <div className="symbol-bar">
              {QUICK_SYMBOLS.map(sym => (
                <button 
                  key={sym} 
                  type="button" 
                  className="symbol-btn" 
                  onClick={() => handleInsertSymbol(sym)}
                >
                  {sym}
                </button>
              ))}
            </div>
            <textarea 
              className="form-textarea" 
              rows={4} 
              placeholder="Escribe detalles, reflexiones, descripción o apuntes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Inserción de Imagen */}
          <div className="form-group">
            <label className="form-label">Imagen Adjunta (Opcional)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="URL de imagen o pega un enlace..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <label className="btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Paperclip size={14} /> Subir archivo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
            {imageUrl && (
              <div style={{ position: 'relative', marginTop: '8px' }}>
                <img 
                  src={imageUrl} 
                  alt="Vista previa" 
                  style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '12px' }} 
                />
                <button 
                  type="button" 
                  className="btn-icon" 
                  onClick={() => setImageUrl('')}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)' }}
                  title="Eliminar imagen"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Subtareas (para tareas complejas o listas de compras) */}
          {(type === 'task' || type === 'shopping_list') && (
            <div className="form-group">
              <label className="form-label">
                {type === 'shopping_list' ? 'Artículos de la Lista' : 'Subtareas del Proyecto'}
              </label>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={type === 'shopping_list' ? 'Añadir artículo (ej. Leche)' : 'Añadir subtarea (ej. Contactar diseñador)'}
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtask(e); }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddSubtask}>
                  <Plus size={15} /> Añadir
                </button>
              </div>

              {subtasks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                  {subtasks.map(st => (
                    <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-cloud)', borderRadius: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={st.is_completed} 
                          onChange={() => handleToggleSubtask(st.id)} 
                        />
                        <span style={{ textDecoration: st.is_completed ? 'line-through' : 'none', color: st.is_completed ? 'var(--color-iron)' : 'inherit' }}>
                          {st.title}
                        </span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSubtask(st.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-iron)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fecha Límite & Prioridad & Estado */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha Límite / Calendario</label>
              <input 
                type="date" 
                className="form-input" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado Kanban</label>
              <select 
                className="form-select" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">Por Hacer</option>
                <option value="in_progress">En Progreso</option>
                <option value="done">Completado</option>
              </select>
            </div>
          </div>

          {/* Color Pastel de la Tarjeta */}
          <div className="form-group">
            <label className="form-label">Color de Tarjeta Pastel (Inspirado en monday.com)</label>
            <div className="color-picker-row">
              {PASTEL_COLORS.map(col => (
                <div 
                  key={col.id} 
                  className={`color-dot ${colorAccent === col.id ? 'selected' : ''}`}
                  style={{ backgroundColor: col.bg, border: col.id === 'pastel-snow' ? '1px solid var(--color-fog)' : 'none' }}
                  onClick={() => setColorAccent(col.id)}
                  title={col.label}
                />
              ))}
            </div>
          </div>

          {/* Etiquetas */}
          <div className="form-group">
            <label className="form-label">Etiquetas (separadas por coma)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="urgente, compras, finanzas, ideas..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={15} /> Guardar en Orbia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
