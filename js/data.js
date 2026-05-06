const mockData = {
  users: [
    { id: 1, name: 'Admin Samtour', email: 'admin@samtour.com', password: 'admin123', role: 'admin', status: 'active' },
    { id: 2, name: 'Juan Pérez', email: 'juan@samtour.com', password: 'vendor123', role: 'vendor', status: 'active' },
    { id: 3, name: 'María García', email: 'maria@samtour.com', password: 'vendor123', role: 'vendor', status: 'active' },
    { id: 4, name: 'Carlos López', email: 'carlos@samtour.com', password: 'vendor123', role: 'vendor', status: 'inactive' }
  ],
  clients: [
    { id: 1, name: 'Ana María Torres', docType: 'CC', docNumber: '12345678', phone: '3001234567', email: 'ana@email.com', registrationDate: '2025-01-15' },
    { id: 2, name: 'Roberto Sánchez', docType: 'CC', docNumber: '87654321', phone: '3002345678', email: 'roberto@email.com', registrationDate: '2025-02-20' },
    { id: 3, name: 'Laura Martínez', docType: 'Pasaporte', docNumber: 'AB123456', phone: '3003456789', email: 'laura@email.com', registrationDate: '2025-03-10' },
    { id: 4, name: 'Miguel Ángel Rodríguez', docType: 'CC', docNumber: '11223344', phone: '3004567890', email: 'miguel@email.com', registrationDate: '2025-03-25' },
    { id: 5, name: 'Sofia Hernández', docType: 'CE', docNumber: '5555555', phone: '3005678901', email: 'sofia@email.com', registrationDate: '2025-04-01' },
    { id: 6, name: 'Diego Fernández', docType: 'CC', docNumber: '99887766', phone: '3006789012', email: 'diego@email.com', registrationDate: '2025-04-15' },
    { id: 7, name: 'Carmen López', docType: 'Pasaporte', docNumber: 'XY789654', phone: '3007890123', email: 'carmen@email.com', registrationDate: '2025-05-01' },
    { id: 8, name: 'José Manuel Gil', docType: 'CC', docNumber: '44556677', phone: '3008901234', email: 'jose@email.com', registrationDate: '2025-05-20' },
    { id: 9, name: 'Isabella Díaz', docType: 'CC', docNumber: '66778899', phone: '3009012345', email: 'isabella@email.com', registrationDate: '2025-06-05' },
    { id: 10, name: 'Fernando Morales', docType: 'CE', docNumber: '1234888', phone: '3010123456', email: 'fernando@email.com', registrationDate: '2025-06-18' },
    { id: 11, name: 'Patricia Ruiz', docType: 'Pasaporte', docNumber: 'ZZ555555', phone: '3011234567', email: 'patricia@email.com', registrationDate: '2025-07-01' },
    { id: 12, name: 'Alejandro Castro', docType: 'CC', docNumber: '33445566', phone: '3012345678', email: 'alejandro@email.com', registrationDate: '2025-07-15' }
  ],
  sales: [
    { id: 1, clientId: 1, clientName: 'Ana María Torres', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-01', total: 2500000, status: 'pagado', paymentMethod: 'Transferencia', observations: 'Paquete familiar a Cartagena' },
    { id: 2, clientId: 3, clientName: 'Laura Martínez', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-05', total: 1800000, status: 'abonado', paymentMethod: 'Tarjeta', observations: 'Vuelo Bogotá-Medellín' },
    { id: 3, clientId: 5, clientName: 'Sofia Hernández', vendorId: 3, vendorName: 'María García', date: '2025-12-08', total: 3200000, status: 'pendiente', paymentMethod: 'Efectivo', observations: 'Crucero Caribbean' },
    { id: 4, clientId: 2, clientName: 'Roberto Sánchez', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-10', total: 950000, status: 'pagado', paymentMethod: 'Transferencia', observations: 'Vuelo nacional' },
    { id: 5, clientId: 4, clientName: 'Miguel Ángel Rodríguez', vendorId: 3, vendorName: 'María García', date: '2025-12-12', total: 4500000, status: 'abonado', paymentMethod: 'Tarjeta', observations: 'Paquete premium Punta Cana' },
    { id: 6, clientId: 6, clientName: 'Diego Fernández', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-15', total: 1200000, status: 'pagado', paymentMethod: 'Efectivo', observations: 'Vuelo Bogotá-Cali' },
    { id: 7, clientId: 7, clientName: 'Carmen López', vendorId: 3, vendorName: 'María García', date: '2025-12-18', total: 5500000, status: 'pendiente', paymentMethod: 'Transferencia', observations: 'Viaje luna de miel Europa' },
    { id: 8, clientId: 8, clientName: 'José Manuel Gil', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-20', total: 780000, status: 'pagado', paymentMethod: 'Tarjeta', observations: 'Vuelo ejecutivo' },
    { id: 9, clientId: 9, clientName: 'Isabella Díaz', vendorId: 3, vendorName: 'María García', date: '2025-12-22', total: 2100000, status: 'abonado', paymentMethod: 'Efectivo', observations: 'Paquete adventure' },
    { id: 10, clientId: 10, clientName: 'Fernando Morales', vendorId: 2, vendorName: 'Juan Pérez', date: '2025-12-25', total: 1500000, status: 'pendiente', paymentMethod: 'Tarjeta', observations: 'Vuelo internacional' }
  ],
  flights: [
    { id: 1, passenger: 'Ana María Torres', route: 'BOG-MDE', airline: 'Avianca', date: '2026-04-25', time: '08:30', type: 'ida', checkin: 'pendiente' },
    { id: 2, passenger: 'Roberto Sánchez', route: 'BOG-CTG', airline: 'LATAM', date: '2026-04-26', time: '14:15', type: 'ida', checkin: 'realizado' },
    { id: 3, passenger: 'Laura Martínez', route: 'MDE-BOG', airline: 'Avianca', date: '2026-04-28', time: '16:45', type: 'regreso', checkin: 'pendiente' },
    { id: 4, passenger: 'Miguel Ángel Rodríguez', route: 'BOG-PTY', airline: 'Copa Airlines', date: '2026-04-27', time: '10:00', type: 'ida', checkin: 'realizado' },
    { id: 5, passenger: 'Sofia Hernández', route: 'BOG-MIA', airline: 'American Airlines', date: '2026-04-29', time: '22:30', type: 'ida', checkin: 'pendiente' },
    { id: 6, passenger: 'Diego Fernández', route: 'CTG-BOG', airline: 'Avianca', date: '2026-04-30', time: '12:00', type: 'regreso', checkin: 'pendiente' },
    { id: 7, passenger: 'Carmen López', route: 'BOG-MAD', airline: 'Iberia', date: '2026-05-01', time: '19:00', type: 'ida', checkin: 'pendiente' },
    { id: 8, passenger: 'José Manuel Gil', route: 'MAD-BOG', airline: 'Iberia', date: '2026-05-10', time: '14:30', type: 'regreso', checkin: 'pendiente' }
  ],
  config: {
    cards: [
      { id: 1, bank: 'Banco de Colombia', type: 'Crédito' },
      { id: 2, bank: 'Banco de Bogotá', type: 'Débito' },
      { id: 3, bank: 'Bancolombia', type: 'Crédito' },
      { id: 4, bank: 'Davivienda', type: 'Débito' }
    ],
    paymentMethods: [
      { id: 1, name: 'Efectivo' },
      { id: 2, name: 'Transferencia' },
      { id: 3, name: 'Tarjeta Débito' },
      { id: 4, name: 'Tarjeta Crédito' },
      { id: 5, name: 'PSE' }
    ],
    documentTypes: [
      { id: 1, name: 'CC' },
      { id: 2, name: 'Pasaporte' },
      { id: 3, name: 'CE' },
      { id: 4, name: 'NIT' }
    ],
    airlines: [
      { id: 1, name: 'Avianca', code: 'AV' },
      { id: 2, name: 'LATAM', code: 'LA' },
      { id: 3, name: 'Copa Airlines', code: 'CM' },
      { id: 4, name: 'American Airlines', code: 'AA' },
      { id: 5, name: 'Iberia', code: 'IB' },
      { id: 6, name: 'United Airlines', code: 'UA' }
    ],
    suppliers: [
      { id: 1, name: 'Hotel Dann Carlton', type: 'Hotel', contact: 'reservas@danncarlton.com' },
      { id: 2, name: 'Decameron', type: 'Hotel', contact: 'info@decameron.com' },
      { id: 3, name: 'Viajes Éxito', type: 'Operador', contact: 'operaciones@viajesexito.com' },
      { id: 4, name: 'Alsa Viajes', type: 'Operador', contact: 'ventas@alsaviajes.com' }
    ],
    routes: [
      { id: 1, origin: 'Bogotá', destination: 'Medellín', duration: '1h 15m' },
      { id: 2, origin: 'Bogotá', destination: 'Cartagena', duration: '1h 30m' },
      { id: 3, origin: 'Bogotá', destination: 'Cali', duration: '1h 05m' },
      { id: 4, origin: 'Bogotá', destination: 'Miami', duration: '5h 30m' },
      { id: 5, origin: 'Bogotá', destination: 'Madrid', duration: '10h 00m' }
    ],
    baggage: [
      { id: 1, name: 'Equipaje de Mano', maxWeight: '8 kg' },
      { id: 2, name: 'Equipaje Documentado', maxWeight: '23 kg' },
      { id: 3, name: 'Equipaje Extra', maxWeight: '32 kg' }
    ]
  }
};

const STORAGE_KEY = 'samtour_data';

function getData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  saveData(mockData);
  return JSON.parse(JSON.stringify(mockData));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getCurrentUser() {
  const user = localStorage.getItem('samtour_user');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('samtour_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('samtour_user');
  }
}

function generateId(array) {
  return array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CO');
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('samtour_user');
  location.reload();
}