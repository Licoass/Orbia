-- ========================================================
-- ORBIA — Esquema de Base de Datos para Supabase (100% Gratuito)
-- ========================================================
-- Ejecuta este script en el "SQL Editor" de tu proyecto de Supabase.

-- 1. Tabla de Elementos (Tareas, Notas, Listas de Compras, Enlaces)
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('task', 'note', 'link', 'shopping_list')),
    context TEXT NOT NULL DEFAULT 'personal' CHECK (context IN ('personal', 'work', 'both')),
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'archived')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    due_date TEXT,
    reminder_at TIMESTAMPTZ,
    color_accent TEXT DEFAULT 'pastel-snow',
    is_pinned BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    subtasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad (Cada usuario solo puede ver y editar sus propios datos)
CREATE POLICY "Los usuarios pueden ver sus propios elementos"
ON public.items
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Los usuarios pueden insertar sus propios elementos"
ON public.items
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Los usuarios pueden actualizar sus propios elementos"
ON public.items
FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Los usuarios pueden eliminar sus propios elementos"
ON public.items
FOR DELETE
USING (auth.uid() = user_id OR user_id IS NULL);

-- 4. Índice para búsquedas rápidas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_due_date ON public.items(due_date);
