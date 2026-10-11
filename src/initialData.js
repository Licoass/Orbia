export const initialItems = [
  {
    id: 'item-1',
    type: 'task',
    context: 'work',
    title: '🚀 Lanzamiento del Módulo de Inteligencia Orbital',
    content: 'Revisión final de arquitectura y pipelines de datos antes de pasar a staging.',
    status: 'in_progress',
    priority: 'urgent',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // En 2 días
    color_accent: 'pastel-periwinkle',
    is_pinned: true,
    tags: ['trabajo', 'lanzamiento', 'urgente'],
    subtasks: [
      { id: 'sub-1', title: 'Revisar endpoints de Supabase', is_completed: true },
      { id: 'sub-2', title: 'Optimizar consultas SQL', is_completed: true },
      { id: 'sub-3', title: 'Probar Google OAuth en dispositivos móviles', is_completed: false },
      { id: 'sub-4', title: 'Generar reporte de métricas', is_completed: false }
    ],
    metadata: {}
  },
  {
    id: 'item-2',
    type: 'shopping_list',
    context: 'personal',
    title: '🛒 Lista de Mercado Semanal',
    content: 'Comprar provisiones para la semana en el supermercado local.',
    status: 'todo',
    priority: 'normal',
    due_date: new Date().toISOString().split('T')[0], // Hoy
    color_accent: 'pastel-mint',
    is_pinned: true,
    tags: ['personal', 'hogar', 'compras'],
    subtasks: [
      { id: 'sub-201', title: 'Café de grano tostado colombiano', is_completed: true },
      { id: 'sub-202', title: 'Leche de almendras sin azúcar', is_completed: false },
      { id: 'sub-203', title: 'Aguacates maduros (x4)', is_completed: false },
      { id: 'sub-204', title: 'Pan artesanal de masa madre', is_completed: false },
      { id: 'sub-205', title: 'Aceite de oliva extra virgen', is_completed: false }
    ],
    metadata: {}
  },
  {
    id: 'item-3',
    type: 'link',
    context: 'work',
    title: '🔗 Arquitectura Limpia en Aplicaciones Web Modernas',
    content: 'Artículo imperdible sobre separación de responsabilidades y patrones offline-first.',
    status: 'todo',
    priority: 'normal',
    due_date: '',
    color_accent: 'pastel-sky',
    is_pinned: false,
    tags: ['trabajo', 'lectura', 'arquitectura'],
    subtasks: [],
    metadata: {
      url: 'https://martinfowler.com/architecture',
      site_name: 'Martin Fowler Blog',
      read_status: 'unread'
    }
  },
  {
    id: 'item-4',
    type: 'note',
    context: 'personal',
    title: '💡 Ideas para el Jardín & Espacio Zen',
    content: '✦ Esquema de iluminación con guirnaldas solares.\n➜ Instalar maceteros colgantes en la pared este.\n★ Plantas recomendadas: Lavanda, Helecho y Suculentas.\n⚡ Recordar regar en las mañanas temprano.',
    status: 'done',
    priority: 'low',
    due_date: '',
    color_accent: 'pastel-lavender',
    is_pinned: false,
    tags: ['personal', 'creatividad', 'casa'],
    subtasks: [],
    metadata: {
      image_url: './logo-pastel.png'
    }
  },
  {
    id: 'item-5',
    type: 'task',
    context: 'personal',
    title: '🩺 Cita de Control Médico Anual',
    content: 'Llevar exámenes previos de sangre y consultar sobre vitaminas.',
    status: 'todo',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // En 5 días
    color_accent: 'pastel-apricot',
    is_pinned: false,
    tags: ['personal', 'salud'],
    subtasks: [
      { id: 'sub-501', title: 'Imprimir orden de exámenes', is_completed: true },
      { id: 'sub-502', title: 'Confirmar hora 24h antes', is_completed: false }
    ],
    metadata: {}
  },
  {
    id: 'item-6',
    type: 'link',
    context: 'personal',
    title: '🔗 Receta: Pasta fresca al pesto con nueces',
    content: 'Guardado para la cena especial del fin de semana.',
    status: 'todo',
    priority: 'low',
    due_date: '',
    color_accent: 'pastel-peony',
    is_pinned: false,
    tags: ['personal', 'cocina', 'fin-de-semana'],
    subtasks: [],
    metadata: {
      url: 'https://www.bonappetit.com/recipe/fresh-pesto-pasta',
      site_name: 'Bon Appétit',
      read_status: 'unread'
    }
  }
];
