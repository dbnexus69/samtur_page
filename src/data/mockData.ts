import { AppData, DEFAULT_VENDOR_PERMISSIONS } from '../types';

const AVATARS_CLIENTS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Casper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Finn',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Arlo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy'
];

export const mockData: AppData = {
  users: [
    { id: 1, name: 'Admin Samtour', docType: 'CC', docNumber: '123456789', phone: '3001234567', birthDate: '1990-01-15', email: 'admin@samtour.com', password: 'Admin123', role: 'admin', status: 'active' },
    { id: 2, name: 'Juan Perez', docType: 'CC', docNumber: '987654321', phone: '3002345678', birthDate: '1985-06-20', email: 'juan@samtour.com', password: 'Vendor123', role: 'vendor', status: 'active' },
    { id: 3, name: 'Maria Garcia', docType: 'CE', docNumber: '5555555', phone: '3003456789', birthDate: '1992-03-10', email: 'maria@samtour.com', password: 'Vendor123', role: 'vendor', status: 'active' },
    { id: 4, name: 'Carlos Lopez', docType: 'Pasaporte', docNumber: 'XY789654', phone: '3004567890', birthDate: '1988-11-25', email: 'carlos@samtour.com', password: 'Vendor123', role: 'vendor', status: 'inactive' }
  ],
  clients: [
    { id: 1, firstName: 'Ana Maria', lastName: 'Torres', name: 'Ana Maria Torres', docType: 'CC', docNumber: '12345678', phone: '3001234567', email: 'ana@email.com', birthDate: '1992-05-15', status: 'active', avatar: AVATARS_CLIENTS[0], registrationDate: '2025-01-15' },
    { id: 2, firstName: 'Roberto', lastName: 'Sanchez', name: 'Roberto Sanchez', docType: 'CC', docNumber: '87654321', phone: '3002345678', email: 'roberto@email.com', birthDate: '1988-08-20', status: 'active', avatar: AVATARS_CLIENTS[1], registrationDate: '2025-02-20' },
    { id: 3, firstName: 'Laura', lastName: 'Martinez', name: 'Laura Martinez', docType: 'Pasaporte', docNumber: 'AB123456', phone: '3003456789', email: 'laura@email.com', birthDate: '1995-03-10', status: 'active', avatar: AVATARS_CLIENTS[2], registrationDate: '2025-03-10' },
    { id: 4, firstName: 'Miguel Angel', lastName: 'Rodriguez', name: 'Miguel Angel Rodriguez', docType: 'CC', docNumber: '11223344', phone: '3004567890', email: 'miguel@email.com', birthDate: '1990-11-25', status: 'active', avatar: AVATARS_CLIENTS[3], registrationDate: '2025-03-25' },
    { id: 5, firstName: 'Sofia', lastName: 'Hernandez', name: 'Sofia Hernandez', docType: 'CE', docNumber: '5555555', phone: '3005678901', email: 'sofia@email.com', birthDate: '1993-07-01', status: 'active', avatar: AVATARS_CLIENTS[4], registrationDate: '2025-04-01' },
    { id: 6, firstName: 'Diego', lastName: 'Fernandez', name: 'Diego Fernandez', docType: 'CC', docNumber: '99887766', phone: '3006789012', email: 'diego@email.com', birthDate: '1987-04-15', status: 'inactive', avatar: AVATARS_CLIENTS[5], registrationDate: '2025-04-15' },
    { id: 7, firstName: 'Carmen', lastName: 'Lopez', name: 'Carmen Lopez', docType: 'Pasaporte', docNumber: 'XY789654', phone: '3007890123', email: 'carmen@email.com', birthDate: '1991-12-01', status: 'active', avatar: AVATARS_CLIENTS[6], registrationDate: '2025-05-01' },
    { id: 8, firstName: 'Jose Manuel', lastName: 'Gil', name: 'Jose Manuel Gil', docType: 'CC', docNumber: '44556677', phone: '3008901234', email: 'jose@email.com', birthDate: '1989-09-20', status: 'active', avatar: AVATARS_CLIENTS[7], registrationDate: '2025-05-20' },
    { id: 9, firstName: 'Isabella', lastName: 'Diaz', name: 'Isabella Diaz', docType: 'CC', docNumber: '66778899', phone: '3009012345', email: 'isabella@email.com', birthDate: '1994-06-05', status: 'active', avatar: AVATARS_CLIENTS[8], registrationDate: '2025-06-05' },
    { id: 10, firstName: 'Fernando', lastName: 'Morales', name: 'Fernando Morales', docType: 'CE', docNumber: '1234888', phone: '3010123456', email: 'fernando@email.com', birthDate: '1986-06-18', status: 'inactive', avatar: AVATARS_CLIENTS[9], registrationDate: '2025-06-18' },
    { id: 11, firstName: 'Patricia', lastName: 'Ruiz', name: 'Patricia Ruiz', docType: 'Pasaporte', docNumber: 'ZZ555555', phone: '3011234567', email: 'patricia@email.com', birthDate: '1997-07-01', status: 'active', avatar: AVATARS_CLIENTS[10], registrationDate: '2025-07-01' },
    { id: 12, firstName: 'Alejandro', lastName: 'Castro', name: 'Alejandro Castro', docType: 'CC', docNumber: '33445566', phone: '3012345678', email: 'alejandro@email.com', birthDate: '1991-07-15', status: 'active', avatar: AVATARS_CLIENTS[11], registrationDate: '2025-07-15' }
  ],
  sales: [
    { id: 1, clientId: 1, clientName: 'Ana Maria Torres', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-01', total: 2500000, status: 'pagado', paymentMethod: 'Transferencia', observations: 'Paquete familiar a Cartagena' },
    { id: 2, clientId: 3, clientName: 'Laura Martinez', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-05', total: 1800000, status: 'abonado', paymentMethod: 'Tarjeta', observations: 'Vuelo Bogota-Medellin' },
    { id: 3, clientId: 5, clientName: 'Sofia Hernandez', vendorId: 3, vendorName: 'Maria Garcia', date: '2025-12-08', total: 3200000, status: 'pendiente', paymentMethod: 'Efectivo', observations: 'Crucero Caribbean' },
    { id: 4, clientId: 2, clientName: 'Roberto Sanchez', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-10', total: 950000, status: 'pagado', paymentMethod: 'Transferencia', observations: 'Vuelo nacional' },
    { id: 5, clientId: 4, clientName: 'Miguel Angel Rodriguez', vendorId: 3, vendorName: 'Maria Garcia', date: '2025-12-12', total: 4500000, status: 'abonado', paymentMethod: 'Tarjeta', observations: 'Paquete premium Punta Cana' },
    { id: 6, clientId: 6, clientName: 'Diego Fernandez', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-15', total: 1200000, status: 'pagado', paymentMethod: 'Efectivo', observations: 'Vuelo Bogota-Cali' },
    { id: 7, clientId: 7, clientName: 'Carmen Lopez', vendorId: 3, vendorName: 'Maria Garcia', date: '2025-12-18', total: 5500000, status: 'pendiente', paymentMethod: 'Transferencia', observations: 'Viaje luna de miel Europa' },
    { id: 8, clientId: 8, clientName: 'Jose Manuel Gil', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-20', total: 780000, status: 'pagado', paymentMethod: 'Tarjeta', observations: 'Vuelo ejecutivo' },
    { id: 9, clientId: 9, clientName: 'Isabella Diaz', vendorId: 3, vendorName: 'Maria Garcia', date: '2025-12-22', total: 2100000, status: 'abonado', paymentMethod: 'Efectivo', observations: 'Paquete adventure' },
    { id: 10, clientId: 10, clientName: 'Fernando Morales', vendorId: 2, vendorName: 'Juan Perez', date: '2025-12-25', total: 1500000, status: 'pendiente', paymentMethod: 'Tarjeta', observations: 'Vuelo internacional' }
  ],
  flights: [
    { id: 1, passenger: 'Ana Maria Torres', route: 'BOG-MDE', airline: 'Avianca', date: '2026-04-25', time: '08:30', type: 'ida', checkin: 'pendiente' },
    { id: 2, passenger: 'Roberto Sanchez', route: 'BOG-CTG', airline: 'LATAM', date: '2026-04-26', time: '14:15', type: 'ida', checkin: 'realizado' },
    { id: 3, passenger: 'Laura Martinez', route: 'MDE-BOG', airline: 'Avianca', date: '2026-04-28', time: '16:45', type: 'regreso', checkin: 'pendiente' },
    { id: 4, passenger: 'Miguel Angel Rodriguez', route: 'BOG-PTY', airline: 'Copa Airlines', date: '2026-04-27', time: '10:00', type: 'ida', checkin: 'realizado' },
    { id: 5, passenger: 'Sofia Hernandez', route: 'BOG-MIA', airline: 'American Airlines', date: '2026-04-29', time: '22:30', type: 'ida', checkin: 'pendiente' },
    { id: 6, passenger: 'Diego Fernandez', route: 'CTG-BOG', airline: 'Avianca', date: '2026-04-30', time: '12:00', type: 'regreso', checkin: 'pendiente' },
    { id: 7, passenger: 'Carmen Lopez', route: 'BOG-MAD', airline: 'Iberia', date: '2026-05-01', time: '19:00', type: 'ida', checkin: 'pendiente' },
    { id: 8, passenger: 'Jose Manuel Gil', route: 'MAD-BOG', airline: 'Iberia', date: '2026-05-10', time: '14:30', type: 'regreso', checkin: 'pendiente' },
    { id: 9, passenger: 'Carlos Eduardo Gomez', route: 'BOG-MDE', airline: 'Avianca', date: '2026-05-05', time: '06:30', type: 'ida', checkin: 'pendiente' },
    { id: 10, passenger: 'Maria Fernanda Lopez', route: 'BOG-CTG', airline: 'LATAM', date: '2026-05-05', time: '09:00', type: 'ida', checkin: 'pendiente' },
    { id: 11, passenger: 'Pedro Antonio Ruiz', route: 'BOG-Cali', airline: 'Avianca', date: '2026-05-05', time: '11:15', type: 'ida', checkin: 'realizado' },
    { id: 12, passenger: 'Lucia Daniela Peña', route: 'BOG-SM', airline: 'Copa Airlines', date: '2026-05-05', time: '14:45', type: 'ida', checkin: 'pendiente' },
    { id: 13, passenger: 'Andres Felipe Castro', route: 'MDE-BOG', airline: 'Avianca', date: '2026-05-05', time: '17:30', type: 'ida', checkin: 'pendiente' }
  ],
  config: {
    cards: [
      { id: 1, bank: 'Banco de Colombia', type: 'Credito' },
      { id: 2, bank: 'Banco de Bogota', type: 'Debito' },
      { id: 3, bank: 'Bancolombia', type: 'Credito' },
      { id: 4, bank: 'Davivienda', type: 'Debito' }
    ],
    paymentMethods: [
      { id: 1, name: 'Efectivo' },
      { id: 2, name: 'Transferencia' },
      { id: 3, name: 'Tarjeta Debito' },
      { id: 4, name: 'Tarjeta Credito' },
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
      { id: 3, name: 'Viajes Exito', type: 'Operador', contact: 'operaciones@viajesexito.com' },
      { id: 4, name: 'Alsa Viajes', type: 'Operador', contact: 'ventas@alsaviajes.com' }
    ],
    routes: [
      { id: 1, origin: 'Bogota', destination: 'Medellin', duration: '1h 15m' },
      { id: 2, origin: 'Bogota', destination: 'Cartagena', duration: '1h 30m' },
      { id: 3, origin: 'Bogota', destination: 'Cali', duration: '1h 05m' },
      { id: 4, origin: 'Bogota', destination: 'Miami', duration: '5h 30m' },
      { id: 5, origin: 'Bogota', destination: 'Madrid', duration: '10h 00m' }
    ],
    baggage: [
      { id: 1, name: 'Equipaje de Mano', maxWeight: '8 kg' },
      { id: 2, name: 'Equipaje Documentado', maxWeight: '23 kg' },
      { id: 3, name: 'Equipaje Extra', maxWeight: '32 kg' }
    ],
    rolePermissions: {
      vendor: DEFAULT_VENDOR_PERMISSIONS
    }
  }
};