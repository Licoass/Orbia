import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import QuickCaptureModal from './components/QuickCaptureModal';
import SupabaseModal from './components/SupabaseModal';
import ListView from './components/Views/ListView';
import KanbanView from './components/Views/KanbanView';
import GalleryView from './components/Views/GalleryView';
import CalendarView from './components/Views/CalendarView';
import MobileBottomNav from './components/MobileBottomNav';
import { initialItems } from './initialData';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { Plus, Sparkles, Filter } from 'lucide-react';

export default function App() {
  // Estado principal de items persistido en localStorage (Offline-first)
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('orbia_items');
      return saved ? JSON.parse(saved) : initialItems;
    } catch (e) {
      return initialItems;
    }
  });

  // Filtros y modos de visualización
  const [contextFilter, setContextFilter] = useState('all'); // 'all' | 'work' | 'personal'
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'tasks' | 'notes' | 'links' | 'calendar'
  const [viewMode, setViewMode] = useState('gallery'); // 'list' | 'kanban' | 'gallery' | 'calendar'
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Barra de captura rápida rápida en pantalla
  const [quickInput, setQuickInput] = useState('');

  // Sincronización automática a localStorage
  useEffect(() => {
    localStorage.setItem('orbia_items', JSON.stringify(items));
  }, [items]);

  // Si se cambia de sección a "calendar", cambiar automáticamente a vista de calendario para conveniencia
  useEffect(() => {
    if (activeSection === 'calendar') {
      setViewMode('calendar');
    }
  }, [activeSection]);

  // Extracción de todas las etiquetas únicas
  const allTags = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      it.tags?.forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [items]);

  // Contadores para el menú lateral
  const counts = useMemo(() => {
    const filterByCtx = (it) => contextFilter === 'all' || it.context === contextFilter;
    return {
      all: items.filter(filterByCtx).length,
      tasks: items.filter(it => filterByCtx(it) && (it.type === 'task' || it.type === 'shopping_list')).length,
      notes: items.filter(it => filterByCtx(it) && it.type === 'note').length,
      links: items.filter(it => filterByCtx(it) && it.type === 'link').length,
      calendar: items.filter(it => filterByCtx(it) && Boolean(it.due_date)).length
    };
  }, [items, contextFilter]);

  // Filtrado de items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Filtro de contexto de vida (Trabajo vs Personal)
      if (contextFilter !== 'all' && item.context !== contextFilter) {
        return false;
      }

      // 2. Filtro de sección del menú
      if (activeSection === 'tasks' && item.type !== 'task' && item.type !== 'shopping_list') {
        return false;
      }
      if (activeSection === 'notes' && item.type !== 'note') {
        return false;
      }
      if (activeSection === 'links' && item.type !== 'link') {
        return false;
      }
      if (activeSection === 'calendar' && !item.due_date) {
        return false;
      }

      // 3. Filtro por etiqueta
      if (selectedTag && !item.tags?.includes(selectedTag)) {
        return false;
      }

      // 4. Búsqueda por texto (Omnisearch)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchContent = item.content?.toLowerCase().includes(q);
        const matchTags = item.tags?.some(t => t.toLowerCase().includes(q));
        const matchUrl = item.metadata?.url?.toLowerCase().includes(q);
        return matchTitle || matchContent || matchTags || matchUrl;
      }

      return true;
    });
  }, [items, contextFilter, activeSection, selectedTag, searchQuery]);

  // Guardar o actualizar item
  const handleSaveItem = (savedItem) => {
    setItems(prev => {
      const exists = prev.some(it => it.id === savedItem.id);
      if (exists) {
        return prev.map(it => it.id === savedItem.id ? savedItem : it);
      } else {
        return [savedItem, ...prev];
      }
    });
  };

  // Eliminar item
  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // Alternar completado
  const handleToggleComplete = (id) => {
    setItems(prev => prev.map(it => {
      if (it.id === id) {
        return {
          ...it,
          status: it.status === 'done' ? 'todo' : 'done'
        };
      }
      return it;
    }));
  };

  // Actualizar estado Kanban
  const handleUpdateStatus = (id, newStatus) => {
    setItems(prev => prev.map(it => {
      if (it.id === id) {
        return { ...it, status: newStatus };
      }
      return it;
    }));
  };

  // Captura instantánea desde la barra superior de contenido
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const newItem = {
      id: 'item-' + Date.now(),
      type: quickInput.startsWith('http') ? 'link' : 'task',
      context: contextFilter === 'work' ? 'work' : 'personal',
      title: quickInput.trim(),
      content: '',
      color_accent: 'pastel-snow',
      priority: 'normal',
      status: 'todo',
      due_date: new Date().toISOString().split('T')[0],
      tags: [contextFilter === 'work' ? 'trabajo' : 'personal'],
      subtasks: [],
      metadata: quickInput.startsWith('http') ? { url: quickInput.trim() } : {}
    };

    handleSaveItem(newItem);
    setQuickInput('');
  };

  // Importar copia de seguridad
  const handleImportItems = (imported) => {
    setItems(imported);
  };

  // Abrir modal de edición
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsCaptureModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setIsCaptureModalOpen(true);
  };

  const getSectionTitle = () => {
    if (selectedTag) return `Etiqueta: #${selectedTag}`;
    switch (activeSection) {
      case 'tasks': return 'Tareas & Listas de Compras';
      case 'notes': return 'Notas & Canvas Visual';
      case 'links': return 'Enlaces de Interés & Lecturas';
      case 'calendar': return 'Agenda & Calendario';
      default: return 'Bandeja Global';
    }
  };

  return (
    <div className="orbia-app">
      {/* Barra Lateral (Desktop & Mobile Drawer) */}
      <Sidebar 
        contextFilter={contextFilter}
        setContextFilter={setContextFilter}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        counts={counts}
        allTags={allTags}
        isOnline={isSupabaseConfigured()}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenCaptureModal={handleOpenNew}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Área Principal */}
      <main className="orbia-main">
        {/* Cabecera Superior con búsqueda y selector de vistas */}
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenCaptureModal={handleOpenNew}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Contenido Central */}
        <div className="orbia-content">
          {/* Título de la sección y contadores */}
          <div className="filter-bar">
            <div className="filter-left">
              <h2 className="section-title">{getSectionTitle()}</h2>
              <span className="count-badge">{filteredItems.length} elementos</span>
              {contextFilter !== 'all' && (
                <span className={`card-context-tag tag-${contextFilter}`}>
                  {contextFilter === 'work' ? '💼 Solo Trabajo' : '🏡 Solo Personal'}
                </span>
              )}
            </div>
          </div>

          {/* Barra de Captura Rápida Instantánea */}
          <form className="quick-capture-bar" onSubmit={handleQuickSubmit}>
            <Sparkles size={20} color="var(--color-orbia-violet)" />
            <input 
              type="text" 
              className="quick-capture-input" 
              placeholder="Captura rápida: escribe una tarea, nota o pega un enlace y pulsa Enter..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Plus size={14} /> Añadir
            </button>
          </form>

          {/* Renderizado de la Vista Seleccionada */}
          {viewMode === 'list' && (
            <ListView 
              items={filteredItems}
              onToggleComplete={handleToggleComplete}
              onEditItem={handleOpenEdit}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {viewMode === 'kanban' && (
            <KanbanView 
              items={filteredItems}
              onUpdateStatus={handleUpdateStatus}
              onEditItem={handleOpenEdit}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {viewMode === 'gallery' && (
            <GalleryView 
              items={filteredItems}
              onEditItem={handleOpenEdit}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {viewMode === 'calendar' && (
            <CalendarView 
              items={filteredItems}
              onEditItem={handleOpenEdit}
              onOpenCaptureModal={handleOpenNew}
            />
          )}
        </div>
      </main>

      {/* Navegación móvil inferior */}
      <MobileBottomNav 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenCaptureModal={handleOpenNew}
      />

      {/* Modal de Captura Rápida / Edición */}
      <QuickCaptureModal 
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
      />

      {/* Modal de Supabase y Google Auth */}
      <SupabaseModal 
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        items={items}
        onImportItems={handleImportItems}
      />
    </div>
  );
}
