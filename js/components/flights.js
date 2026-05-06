const Flights = {
  currentTab: 'ida',
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),

  render(data, user) {
    return `
      <div class="card">
        <div class="tabs">
          <div class="tab ${this.currentTab === 'ida' ? 'active' : ''}" onclick="Flights.switchTab('ida')">
            Vuelos de Ida
          </div>
          <div class="tab ${this.currentTab === 'regreso' ? 'active' : ''}" onclick="Flights.switchTab('regreso')">
            Vuelos de Regreso
          </div>
        </div>
        <div class="card-header">
          <button class="btn btn-outline btn-sm" onclick="Flights.changeMonth(-1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h2 id="flights-month-title">${this.getMonthName()} ${this.currentYear}</h2>
          <button class="btn btn-outline btn-sm" onclick="Flights.changeMonth(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="card-body">
          ${this.renderCalendar(data)}
        </div>
      </div>
      
      <style>
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          background: var(--gray-200);
        }
        .calendar-header {
          background: var(--gray-100);
          padding: 12px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          color: var(--gray-600);
        }
        .calendar-day {
          background: var(--white);
          min-height: 120px;
          padding: 8px;
          position: relative;
        }
        .calendar-day.other-month {
          background: var(--gray-50);
          color: var(--gray-400);
        }
        .calendar-day-number {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .flight-item {
          padding: 6px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .flight-item:hover {
          transform: scale(1.02);
        }
        .flight-item.near {
          background: rgba(34, 197, 94, 0.15);
          border-left: 3px solid var(--success);
          color: #15803d;
        }
        .flight-item.far {
          background: rgba(59, 130, 246, 0.15);
          border-left: 3px solid var(--primary);
          color: #1d4ed8;
        }
        .flight-item.overdue {
          background: rgba(220, 38, 38, 0.15);
          border-left: 3px solid var(--danger);
          color: #b91c1c;
        }
        .flight-type-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          margin-left: 4px;
        }
        .flight-type-badge.ida {
          background: var(--primary);
          color: white;
        }
        .flight-type-badge.regreso {
          background: #8b5cf6;
          color: white;
        }
      </style>
    `;
  },

  getMonthName() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[this.currentMonth];
  },

  getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  },

  getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  },

  renderCalendar(data) {
    const daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    const firstDay = this.getFirstDayOfMonth(this.currentMonth, this.currentYear);
    const daysInPrevMonth = this.getDaysInMonth(this.currentMonth - 1, this.currentYear);
    
    const flights = data.flights
      .filter(f => f.type === this.currentTab)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let html = '<div class="calendar-grid">';
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
      html += `<div class="calendar-header">${day}</div>`;
    });
    
    let dayCounter = 1;
    let nextMonthDay = 1;
    
    for (let i = 0; i < 42; i++) {
      let dayNumber = '';
      let dateStr = '';
      let isOtherMonth = false;
      let flightsOfDay = [];
      
      if (i < firstDay) {
        dayNumber = daysInPrevMonth - firstDay + i + 1;
        isOtherMonth = true;
        const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      } else if (dayCounter > daysInMonth) {
        dayNumber = nextMonthDay++;
        isOtherMonth = true;
        const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
        const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
        dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      } else {
        dayNumber = dayCounter++;
        dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      }
      
      flightsOfDay = flights.filter(f => f.date === dateStr);
      
      const isToday = dateStr === today.toISOString().split('T')[0];
      
      html += `<div class="calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today-cell' : ''}" ${!isOtherMonth ? `data-date="${dateStr}"` : ''}>`;
      if (!isOtherMonth) {
        html += `<div class="calendar-day-number ${isToday ? 'today-number' : ''}">${dayNumber}</div>`;
      }
      
      flightsOfDay.forEach(flight => {
        const flightDate = new Date(flight.date);
        const diffDays = Math.ceil((flightDate - today) / (1000 * 60 * 60 * 24));
        let flightClass = 'far';
        let statusLabel = '';
        
        if (diffDays < 0) {
          flightClass = 'overdue';
          statusLabel = 'Vencido';
        } else if (diffDays <= 3) {
          flightClass = 'near';
          statusLabel = 'Próximo';
        } else {
          flightClass = 'far';
        }
        
        html += `
          <div class="flight-item ${flightClass}" onclick="Flights.showFlightDetail(${flight.id})">
            <div style="font-weight: 600;">${flight.passenger}</div>
            <div>${flight.route} - ${flight.time}</div>
            <div style="opacity: 0.8;">${flight.airline}</div>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              <span class="status-badge ${flight.checkin}">${flight.checkin === 'realizado' ? 'Check-in' : 'Pendiente'}</span>
              <span style="font-size: 9px; color: var(--gray-500);">${statusLabel}</span>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    html += '</div>';
    
    html += `
      <div style="margin-top: 16px; padding: 12px; background: var(--gray-50); border-radius: var(--radius); display: flex; gap: 24px; font-size: 13px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; background: rgba(34, 197, 94, 0.3); border-left: 3px solid var(--success); border-radius: 2px;"></span>
          <span>Próximo (0-3 días)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; background: rgba(59, 130, 246, 0.3); border-left: 3px solid var(--primary); border-radius: 2px;"></span>
          <span>Lejano (+3 días)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; background: rgba(220, 38, 38, 0.3); border-left: 3px solid var(--danger); border-radius: 2px;"></span>
          <span>Vencido</span>
        </div>
      </div>
    `;
    
    return html;
  },

  switchTab(tab) {
    this.currentTab = tab;
    app.renderModule();
  },

  changeMonth(delta) {
    this.currentMonth += delta;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    app.renderModule();
  },

  showFlightDetail(id) {
    const data = getData();
    const flight = data.flights.find(f => f.id === id);
    if (!flight) return;
    
    const today = new Date();
    const flightDate = new Date(flight.date);
    const diffDays = Math.ceil((flightDate - today) / (1000 * 60 * 60 * 24));
    
    let statusText = diffDays < 0 ? 'Vencido' : diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Mañana' : `En ${diffDays} días`;
    
    alert(`✈️ VUELO #${flight.id}

👤 Pasajero: ${flight.passenger}
📍 Ruta: ${flight.route}
🛫 Aerolínea: ${flight.airline}
📅 Fecha: ${formatDate(flight.date)}
⏰ Hora: ${flight.time}
🏷️ Tipo: ${flight.type === 'ida' ? 'Ida' : 'Regreso'}
✅ Check-in: ${flight.checkin === 'realizado' ? 'Realizado' : 'Pendiente'}

⏱️ Estado: ${statusText}`);
  },

  markCheckin(id) {
    if (!confirm('¿Marcar este check-in como realizado?')) return;
    
    const data = getData();
    const flight = data.flights.find(f => f.id === id);
    if (flight) {
      flight.checkin = 'realizado';
      saveData(data);
      showNotification('Check-in marcado como realizado');
      app.refreshData();
    }
  }
};

window.Flights = Flights;