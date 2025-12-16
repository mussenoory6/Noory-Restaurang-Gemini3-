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

// Added costPrice and salesCount for Reports
export const mockMenu: MenuItem[] = [
  { 
    id: '1', name: 'Löjromstoast', category: 'Förrätt', price: 195, costPrice: 65, salesCount: 142, description: 'Kalix löjrom, smetana, rödlök, brioche', available: true,
    modifiers: [{id: 'm1', name: 'Extra löjrom', price: 95}],
    ingredients: ['I2', 'I5']
  },
  { 
    id: '2', name: 'Råbiff', category: 'Förrätt', price: 165, costPrice: 55, salesCount: 98, description: 'Svensk oxrulle, dijonnaise, kapris, äggula', available: true,
    ingredients: ['I1']
  },
  { 
    id: '3', name: 'Grillad Röding', category: 'Varmrätt', price: 295, costPrice: 85, salesCount: 76, description: 'Sandefjordsås, forellrom, dillpotatis, fänkål', available: true,
    ingredients: ['I4', 'I5']
  },
  { 
    id: '4', name: 'Oxfilé Provencale', category: 'Varmrätt', price: 345, costPrice: 120, salesCount: 180, description: 'Råstekt potatis, vitlökssmör, haricots verts', available: true,
    ingredients: ['I1', 'I4']
  },
  { 
    id: '5', name: 'Wallenbergare', category: 'Varmrätt', price: 225, costPrice: 60, salesCount: 210, description: 'Potatispuré, gröna ärtor, rårörda lingon, skirat smör', available: true,
    ingredients: ['I4', 'I5']
  },
  { 
    id: '6', name: 'Tryffelpasta', category: 'Varmrätt', price: 245, costPrice: 50, salesCount: 155, description: 'Färsk tryffel, parmesan, grädde, linguine', available: true,
    ingredients: ['I5', 'I6']
  },
  { 
    id: '7', name: 'Crème Brûlée', category: 'Efterrätt', price: 115, costPrice: 20, salesCount: 120, description: 'Klassisk vanilj', available: true,
    ingredients: ['I5']
  },
  { 
    id: '8', name: 'Chokladfondant', category: 'Efterrätt', price: 125, costPrice: 25, salesCount: 85, description: 'Vaniljglass, hallon', available: true,
    ingredients: []
  },
  { id: '9', name: 'Husets Rödvin', category: 'Dryck', price: 110, costPrice: 25, salesCount: 450, description: 'Glas', available: false, ingredients: ['I3'] },
  { id: '10', name: 'IPA Fat', category: 'Dryck', price: 89, costPrice: 22, salesCount: 320, description: '40cl', available: true, ingredients: ['I7'] },
  { id: '11', name: 'Cola Zero', category: 'Dryck', price: 39, costPrice: 8, salesCount: 150, description: '33cl', available: true },
  { id: '12', name: 'Kaffe', category: 'Dryck', price: 35, costPrice: 2, salesCount: 200, description: 'Brygg', available: true },
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

// Simple sales for sparklines
export const salesData = [
  { name: 'Mån', value: 24000 },
  { name: 'Tis', value: 21000 },
  { name: 'Ons', value: 32000 },
  { name: 'Tor', value: 45000 },
  { name: 'Fre', value: 85000 },
  { name: 'Lör', value: 92000 },
  { name: 'Sön', value: 38000 },
];

// Comprehensive Reporting Data
export const reportData = {
  revenueHistory: [
    { date: '1 Nov', revenue: 32000, costs: 9600, labor: 8000 },
    { date: '2 Nov', revenue: 28000, costs: 8400, labor: 7500 },
    { date: '3 Nov', revenue: 45000, costs: 13500, labor: 11000 },
    { date: '4 Nov', revenue: 52000, costs: 15600, labor: 12000 },
    { date: '5 Nov', revenue: 85000, costs: 25500, labor: 18000 },
    { date: '6 Nov', revenue: 92000, costs: 27600, labor: 19500 },
    { date: '7 Nov', revenue: 38000, costs: 11400, labor: 9500 },
  ],
  categorySales: [
    { name: 'Varmrätt', value: 45000 },
    { name: 'Dryck', value: 32000 },
    { name: 'Förrätt', value: 15000 },
    { name: 'Efterrätt', value: 8000 },
  ],
  hourlyTraffic: [
    { hour: '16:00', guests: 12 },
    { hour: '17:00', guests: 35 },
    { hour: '18:00', guests: 68 },
    { hour: '19:00', guests: 85 },
    { hour: '20:00', guests: 72 },
    { hour: '21:00', guests: 45 },
    { hour: '22:00', guests: 20 },
  ],
  staffPerformance: [
    { name: 'Sara Servis', sales: 45000, hours: 32, tips: 4200 },
    { name: 'Pelle Plock', sales: 28000, hours: 28, tips: 1800 },
    { name: 'Maja Bar', sales: 52000, hours: 35, tips: 5100 },
  ]
};