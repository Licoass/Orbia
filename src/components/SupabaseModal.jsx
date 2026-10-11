import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Cloud, 
  Check, 
  LogIn, 
  LogOut, 
  Download, 
  Upload, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { getSupabaseClient, initSupabaseClient, isSupabaseConfigured } from '../supabaseClient';

export default function SupabaseModal({
  isOpen,
  onClose,
  items,
  onImportItems
}) {
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('orbia_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('orbia_supabase_anon_key') || '');
  const [user, setUser] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const client = getSupabaseClient();
    if (client) {
      client.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (supabaseUrl.trim() && supabaseKey.trim()) {
        initSupabaseClient(supabaseUrl.trim(), supabaseKey.trim());
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        initSupabaseClient('', '');
        setSaveSuccess(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al conectar');
    }
  };

  const handleGoogleLogin = async () => {
    const client = getSupabaseClient();
    if (!client) {
      alert('Primero ingresa tu URL y Anon Key de Supabase abajo.');
      return;
    }
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      alert('Error en Google Login: ' + err.message);
    }
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
      setUser(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `orbia_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportItems(parsed);
            alert(`¡Se importaron ${parsed.length} elementos correctamente!`);
            onClose();
          } else {
            alert('El archivo no contiene una lista válida de elementos.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#3ecf8e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#121212' }}>
              <Database size={18} />
            </div>
            <div>
              <div className="modal-title">Supabase & Cuenta Google</div>
              <span style={{ fontSize: '12px', color: 'var(--color-slate)' }}>100% Gratuito en la Nube</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Sección 1: Google OAuth */}
        <div style={{ background: 'var(--color-cloud)', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid var(--color-pebble)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--color-orbia-violet)" />
              <strong style={{ fontSize: '14px' }}>Inicio de Sesión con Google</strong>
            </div>
            {user ? (
              <span style={{ fontSize: '11px', color: '#10b981', background: '#d1fae5', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                Conectado
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--color-slate)', background: 'var(--color-snow)', padding: '2px 8px', borderRadius: '12px' }}>
                Modo Local / Desconectado
              </span>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{user.email}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-iron)' }}>UID: {user.id.substring(0, 10)}...</div>
              </div>
              <button className="btn-secondary" onClick={handleLogout} style={{ color: '#dc2626' }}>
                <LogOut size={13} /> Cerrar Sesión
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--color-slate)', marginBottom: '12px' }}>
                Inicia sesión con tu cuenta de Google para sincronizar tus notas y tareas automáticamente en todos tus dispositivos.
              </p>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleGoogleLogin}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogIn size={15} /> Iniciar Sesión con Google
              </button>
            </div>
          )}
        </div>

        {/* Sección 2: Configuración de Credenciales Supabase */}
        <form onSubmit={handleSaveCredentials}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Supabase Project URL</label>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer" 
                style={{ fontSize: '11px', color: 'var(--color-orbia-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                Crear gratis en Supabase <ExternalLink size={10} />
              </a>
            </div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="https://tu-proyecto.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supabase Anon Public Key</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
            />
            <span style={{ fontSize: '11px', color: 'var(--color-iron)' }}>
              Encuentra tus credenciales en: Supabase Dashboard &gt; Project Settings &gt; API.
            </span>
          </div>

          {errorMessage && (
            <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {saveSuccess && (
            <div style={{ color: '#16a34a', fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} /> ¡Credenciales guardadas y activadas con éxito!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '24px' }}>
            <button type="submit" className="btn-secondary">
              Guardar Credenciales
            </button>
          </div>
        </form>

        {/* Sección 3: Respaldo y Restauración de Datos */}
        <div style={{ borderTop: '1px solid var(--color-pebble)', paddingTop: '18px' }}>
          <div className="form-label" style={{ marginBottom: '10px' }}>Copias de Seguridad (JSON)</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleExportJSON}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Download size={14} /> Exportar Datos (Backup)
            </button>

            <label className="btn-secondary" style={{ flex: 1, justifyContent: 'center', cursor: 'pointer' }}>
              <Upload size={14} /> Importar Datos
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportJSON} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
