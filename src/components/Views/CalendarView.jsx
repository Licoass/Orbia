import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalIcon, 
  Plus,
  Clock
} from 'lucide-react';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function CalendarView({
  items,
  onEditItem,
  onOpenCaptureModal
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calcular días del mes
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Ajustar día de la semana para que Lunes sea 0
  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  const totalDays = lastDayOfMonth.getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Mapear items por fecha YYYY-MM-DD
  const itemsByDate = {};
  items.forEach(item => {
    if (item.due_date) {
      if (!itemsByDate[item.due_date]) itemsByDate[item.due_date] = [];
      itemsByDate[item.due_date].push(item);
    }
  });

  // Generar celdas del mes
  const cells = [];
  // Celdas vacías antes del 1er día
  for (let i = 0; i < startingDay; i++) {
    cells.push(null);
  }
  // Celdas de los días del mes
  for (let day = 1; day <= totalDays; day++) {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const dayFormatted = String(day).padStart(2, '0');
    const dateKey = `${year}-${monthFormatted}-${dayFormatted}`;
    cells.push({
      dayNumber: day,
      dateKey,
      isToday: dateKey === todayStr,
      dayItems: itemsByDate[dateKey] || []
    });
  }

  return (
    <div className="calendar-container">
      {/* Barra de cabecera del calendario */}
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalIcon size={22} color="var(--color-orbia-violet)" />
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
            {monthNames[month]} {year}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-icon" onClick={handlePrevMonth} title="Mes anterior">
            <ChevronLeft size={16} />
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentDate(new Date())}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Hoy
          </button>
          <button className="btn-icon" onClick={handleNextMonth} title="Mes siguiente">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="calendar-grid" style={{ marginBottom: '8px' }}>
        {WEEKDAYS.map(w => (
          <div key={w} className="cal-weekday">{w}</div>
        ))}
      </div>

      {/* Celdas del mes */}
      <div className="calendar-grid">
        {cells.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} style={{ minHeight: '90px', background: 'transparent' }} />;
          }

          return (
            <div 
              key={cell.dateKey} 
              className={`cal-day-cell ${cell.isToday ? 'current-day' : ''}`}
              onClick={() => onOpenCaptureModal?.()}
              title="Click para ver o agregar tareas para este día"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cal-day-num">{cell.dayNumber}</span>
                {cell.isToday && (
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-orbia-violet)' }}>
                    HOY
                  </span>
                )}
              </div>

              {/* Eventos / Tareas del día */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '70px' }}>
                {cell.dayItems.map(item => (
                  <div 
                    key={item.id} 
                    className="cal-event-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    title={item.title}
                    style={{
                      borderLeft: `3px solid ${item.status === 'done' ? '#10b981' : 'var(--color-orbia-violet)'}`
                    }}
                  >
                    {item.status === 'done' ? '✓ ' : '• '}{item.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
