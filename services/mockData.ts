import { Booking, MenuItem, Staff, KPI, InventoryItem } from '../types';

export const mockKPIs: KPI[] = [
  { label: 'Dagens Försäljning', value: '42 500 kr', trend: 12, trendUp: true },
  { label: 'Aktiva Bokningar', value: '24', trend: 5, trendUp: true },
  { label: 'Snittnota', value: '840 kr', trend: 2, trendUp: false },
  { label: 'Personalkostnad %', value: '28%', trend: 0, trendUp: true },
];

export const mockInventory: InventoryItem[] = [
  { id: 'I1', name: 'Oxfilé (Svensk)', category: 'Kött', quantity: 12.5, unit: 'kg', minThreshold: 5, costPrice: 450, supplier: 'Köttgrossisten', lastUpdated: '2023-10-25' },
  { id: 'I2', name: 'Löjrom (Kalix)', category: 'Fisk & Skaldjur', quantity: 0.8, unit: 'kg', minThreshold: 1.0, costPrice: 2500, supplier: 'Fiskbilen', lastUpdated: '2023-10-24' },
  { id: 'I3', name: 'Rödvin (Husets)', category: 'Dryck', quantity: 4, unit: 'st', minThreshold: 12, costPrice: 85, supplier: 'Vinimporten', lastUpdated: '2023-10-20' },
  { id: 'I4', name: 'Potatis (Amandine)', category: 'Grönsaker', quantity: 45, unit: 'kg', minThreshold: 20, costPrice: 12, supplier: 'Grönsakshallen', lastUpdated: '2023-10-26' },
  { id: 'I5', name: 'Grädde 40%', category: 'Mejeri', quantity: 15, unit: 'liter', minThreshold: 5, costPrice: 35, supplier: 'Arla', lastUpdated: '2023-10-26' },
  { id: 'I6', name: 'Tryffel (Färsk)', category: 'Grönsaker', quantity: 0.1, unit: 'kg', minThreshold: 0.2, costPrice: 6000, supplier: 'Delikatesskungen', lastUpdated: '2023-10-22' },
  { id: 'I7', name: 'IPA Fat (30L)', category: 'Dryck', quantity: 2, unit: 'st', minThreshold: 2, costPrice: 1200, supplier: 'Bryggeriet', lastUpdated: '2023-10-15' },
];

export const mockMenu: MenuItem[] = [
  { 
    id: '1', name: 'Löjromstoast', category: 'Förrätt', price: 195, description: 'Kalix löjrom, smetana, rödlök, brioche', available: true,
    modifiers: [{id: 'm1', name: 'Extra löjrom', price: 95}],
    ingredients: ['I2', 'I5']
  },
  { 
    id: '2', name: 'Råbiff', category: 'Förrätt', price: 165, description: 'Svensk oxrulle, dijonnaise, kapris, äggula', available: true,
    ingredients: ['I1']
  },
  { 
    id: '3', name: 'Grillad Röding', category: 'Varmrätt', price: 295, description: 'Sandefjordsås, forellrom, dillpotatis, fänkål', available: true,
    ingredients: ['I4', 'I5']
  },
  { 
    id: '4', name: 'Oxfilé Provencale', category: 'Varmrätt', price: 345, description: 'Råstekt potatis, vitlökssmör, haricots verts', available: true,
    ingredients: ['I1', 'I4']
  },
  { 
    id: '5', name: 'Wallenbergare', category: 'Varmrätt', price: 225, description: 'Potatispuré, gröna ärtor, rårörda lingon, skirat smör', available: true,
    ingredients: ['I4', 'I5']
  },
  { 
    id: '6', name: 'Tryffelpasta', category: 'Varmrätt', price: 245, description: 'Färsk tryffel, parmesan, grädde, linguine', available: true,
    ingredients: ['I5', 'I6']
  },
  { 
    id: '7', name: 'Crème Brûlée', category: 'Efterrätt', price: 115, description: 'Klassisk vanilj', available: true,
    ingredients: ['I5']
  },
  { 
    id: '8', name: 'Chokladfondant', category: 'Efterrätt', price: 125, description: 'Vaniljglass, hallon', available: true,
    ingredients: []
  },
  { id: '9', name: 'Husets Rödvin', category: 'Dryck', price: 110, description: 'Glas', available: false, ingredients: ['I3'] },
  { id: '10', name: 'IPA Fat', category: 'Dryck', price: 89, description: '40cl', available: true, ingredients: ['I7'] },
  { id: '11', name: 'Cola Zero', category: 'Dryck', price: 39, description: '33cl', available: true },
  { id: '12', name: 'Kaffe', category: 'Dryck', price: 35, description: 'Brygg', available: true },
];

export const mockBookings: Booking[] = [
  { id: 'B1', customerName: 'Anna Lindberg', date: new Date().toISOString().split('T')[0], time: '17:00', guests: 2, status: 'arrived', table: '4' },
  { id: 'B2', customerName: 'Johan Ek', date: new Date().toISOString().split('T')[0], time: '17:30', guests: 4, status: 'confirmed', table: '6' },
  { id: 'B3', customerName: 'Företaget AB', date: new Date().toISOString().split('T')[0], time: '18:00', guests: 8, status: 'confirmed', table: '12' },
  { id: 'B4', customerName: 'Maria Svensson', date: new Date().toISOString().split('T')[0], time: '18:30', guests: 2, status: 'confirmed' },
  { id: 'B5', customerName: 'Erik Granqvist', date: new Date().toISOString().split('T')[0], time: '19:00', guests: 3, status: 'noshow' },
  { id: 'B6', customerName: 'Lars Larsson', date: new Date().toISOString().split('T')[0], time: '19:30', guests: 2, status: 'confirmed' },
  { id: 'B7', customerName: 'Karin Persson', date: new Date().toISOString().split('T')[0], time: '20:00', guests: 5, status: 'confirmed' },
];

export const mockStaff: Staff[] = [
  { id: 'S1', name: 'Lisa Nilsson', role: 'Hovmästare', status: 'active', avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'S2', name: 'Kalle Kock', role: 'Kökschef', status: 'active', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'S3', name: 'Sara Servis', role: 'Servis', status: 'break', avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'S4', name: 'Pelle Plock', role: 'Runner', status: 'off', avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 'S5', name: 'Maja Bar', role: 'Bartender', status: 'active', avatar: 'https://picsum.photos/100/100?random=5' },
];

export const salesData = [
  { name: 'Mån', value: 24000 },
  { name: 'Tis', value: 21000 },
  { name: 'Ons', value: 32000 },
  { name: 'Tor', value: 45000 },
  { name: 'Fre', value: 85000 },
  { name: 'Lör', value: 92000 },
  { name: 'Sön', value: 38000 },
];