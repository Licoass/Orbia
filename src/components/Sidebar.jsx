import React from 'react';
import { 
  Compass, 
  CheckSquare, 
  FileText, 
  Bookmark, 
  Calendar, 
  Briefcase, 
  Home, 
  Layers, 
  Sparkles, 
  Tag, 
  Cloud, 
  CloudOff, 
  User, 
  Settings,
  Plus
} from 'lucide-react';

export default function Sidebar({
  contextFilter,
  setContextFilter,
  activeSection,
  setActiveSection,
  selectedTag,
  setSelectedTag,
  counts,
  allTags,
  isOnline,
  onOpenSupabaseModal,
  onOpenCaptureModal,
  isOpenMobile,
  onCloseMobile
}) {
  return (
    <>
      {isOpenMobile && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}
      <aside className={`orbia-sidebar ${isOpenMobile ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="orbia-brand">
          <img src="./emblema-orbital.png" alt="Orbia Emblema" />
          <div className="orbia-brand-text">
            <h1>Orbia</h1>
            <span>Segundo Cerebro</span>
          </div>
        </div>

        {/* Work / Personal Context Switcher */}
        <div className="context-switcher" title="Filtrar por contexto de vida">
          <button 
            className={`context-btn ${contextFilter === 'all' ? 'active' : ''}`}
            onClick={() => setContextFilter('all')}
          >
            <Layers size={13} /> Todo
          </button>
          <button 
            className={`context-btn ${contextFilter === 'work' ? 'active' : ''}`}
            onClick={() => setContextFilter('work')}
          >
            <Briefcase size={13} /> Trabajo
          </button>
          <button 
            className={`context-btn ${contextFilter === 'personal' ? 'active' : ''}`}
            onClick={() => setContextFilter('personal')}
          >
            <Home size={13} /> Personal
          </button>
        </div>

        {/* Main Navigation */}
        <div className="nav-section">
          <div className="nav-label">Organización</div>
          
          <button 
            className={`nav-item ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveSection('all'); setSelectedTag(null); onCloseMobile?.(); }}
          >
            <div className="nav-item-content">
              <Compass size={17} />
              <span>Bandeja Global</span>
            </div>
            <span className="nav-count">{counts.all}</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'tasks' ? 'active' : ''}`}
            onClick={() => { setActiveSection('tasks'); setSelectedTag(null); onCloseMobile?.(); }}
          >
            <div className="nav-item-content">
              <CheckSquare size={17} />
              <span>Tareas & Listas</span>
            </div>
            <span className="nav-count">{counts.tasks}</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'notes' ? 'active' : ''}`}
            onClick={() => { setActiveSection('notes'); setSelectedTag(null); onCloseMobile?.(); }}
          >
            <div className="nav-item-content">
              <FileText size={17} />
              <span>Notas & Canvas</span>
            </div>
            <span className="nav-count">{counts.notes}</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'links' ? 'active' : ''}`}
            onClick={() => { setActiveSection('links'); setSelectedTag(null); onCloseMobile?.(); }}
          >
            <div className="nav-item-content">
              <Bookmark size={17} />
              <span>Enlaces & Lecturas</span>
            </div>
            <span className="nav-count">{counts.links}</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => { setActiveSection('calendar'); setSelectedTag(null); onCloseMobile?.(); }}
          >
            <div className="nav-item-content">
              <Calendar size={17} />
              <span>Calendario</span>
            </div>
            <span className="nav-count">{counts.calendar}</span>
          </button>
        </div>

        {/* Tags / Categorías */}
        {allTags && allTags.length > 0 && (
          <div className="nav-section">
            <div className="nav-label">Etiquetas</div>
            <div className="filter-tags">
              {allTags.map(tag => (
                <button 
                  key={tag}
                  className={`filter-tag-pill ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                    onCloseMobile?.();
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Sincronización y Cuenta */}
        <div className="sidebar-footer">
          <div className="sync-badge" title={isOnline ? 'Base de datos sincronizada' : 'Modo local sin conexión'}>
            <span className={`sync-dot ${isOnline ? '' : 'offline'}`} />
            <span>{isOnline ? 'Supabase Nube Activa' : 'Almacenamiento Local'}</span>
          </div>

          <button 
            className="user-profile-btn" 
            onClick={onOpenSupabaseModal}
            title="Configurar Supabase y Google Login"
          >
            <div className="user-avatar">
              <User size={15} />
            </div>
            <div className="user-info">
              <div className="user-name">Mi Cuenta Orbia</div>
              <div className="user-account-type">Google OAuth / Supabase</div>
            </div>
            <Settings size={15} color="var(--color-slate)" />
          </button>
        </div>
      </aside>
    </>
  );
}
