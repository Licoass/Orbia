import React from 'react';
import { 
  Compass, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Plus 
} from 'lucide-react';

export default function MobileBottomNav({
  activeSection,
  setActiveSection,
  onOpenCaptureModal
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-btn ${activeSection === 'all' ? 'active' : ''}`}
        onClick={() => setActiveSection('all')}
      >
        <Compass size={19} />
        <span>Inicio</span>
      </button>

      <button 
        className={`mobile-nav-btn ${activeSection === 'tasks' ? 'active' : ''}`}
        onClick={() => setActiveSection('tasks')}
      >
        <CheckSquare size={19} />
        <span>Tareas</span>
      </button>

      {/* Botón Flotante Central FAB */}
      <button 
        className="mobile-fab-btn" 
        onClick={onOpenCaptureModal}
        aria-label="Capturar rápidamente"
      >
        <Plus size={26} />
      </button>

      <button 
        className={`mobile-nav-btn ${activeSection === 'notes' ? 'active' : ''}`}
        onClick={() => setActiveSection('notes')}
      >
        <FileText size={19} />
        <span>Notas</span>
      </button>

      <button 
        className={`mobile-nav-btn ${activeSection === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveSection('calendar')}
      >
        <Calendar size={19} />
        <span>Agenda</span>
      </button>
    </nav>
  );
}
