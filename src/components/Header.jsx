import React from 'react';
import { 
  Search, 
  List, 
  Columns3, 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  Plus, 
  Menu,
  SlidersHorizontal
} from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onOpenCaptureModal,
  onToggleMobileSidebar
}) {
  return (
    <header className="orbia-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Abrir Menú"
        >
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar notas, tareas, enlaces o etiquetas... (Cmd + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Selector de Vistas: Lista | Kanban | Galería | Calendario */}
        <div className="view-tabs">
          <button 
            className={`view-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista Lista"
          >
            <List size={15} />
            <span>Lista</span>
          </button>

          <button 
            className={`view-tab-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Vista Tablero Kanban"
          >
            <Columns3 size={15} />
            <span>Kanban</span>
          </button>

          <button 
            className={`view-tab-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => setViewMode('gallery')}
            title="Vista Galería de Tarjetas"
          >
            <LayoutGrid size={15} />
            <span>Galería</span>
          </button>

          <button 
            className={`view-tab-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
            title="Vista Calendario"
          >
            <CalendarIcon size={15} />
            <span>Calendario</span>
          </button>
        </div>

        {/* Botón Píldora Principal "+ Capturar" */}
        <button className="btn-primary" onClick={onOpenCaptureModal}>
          <Plus size={16} />
          <span>Capturar</span>
        </button>
      </div>
    </header>
  );
}
