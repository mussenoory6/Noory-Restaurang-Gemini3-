import { Booking, MenuItem, Staff, KPI } from '../types';

export const mockKPIs: KPI[] = [
  { label: 'Dagens Försäljning', value: '42 500 kr', trend: 12, trendUp: true },
  { label: 'Aktiva Bokningar', value: '24', trend: 5, trendUp: true },
  { label: 'Snittnota', value: '840 kr', trend: 2, trendUp: false },
  { label: 'Personalkostnad %', value: '28%', trend: 0, trendUp: true },
];

export const mockMenu: MenuItem[] = [
  { id: '1', name: 'Löjromstoast', category: 'Förrätt', price: 195, description: 'Kalix löjrom, smetana, rödlök', available: true },
  { id: '2', name: 'Råbiff', category: 'Förrätt', price: 165, description: 'Svensk oxrulle, dijonnaise, kapris', available: true },
  { id: '3', name: 'Grillad Röding', category: 'Varmrätt', price: 295, description: 'Sandefjordsås, forellrom, dillpotatis', available: true },
  { id: '4', name: 'Oxfilé Provencale', category: 'Varmrätt', price: 345, description: 'Råstekt potatis, vitlökssmör, haricots verts', available: true },
  { id: '5', name: 'Wallenbergare', category: 'Varmrätt', price: 225, description: 'Potatispuré, gröna ärtor, lingon', available: true },
  { id: '6', name: 'Tryffelpasta', category: 'Varmrätt', price: 245, description: 'Färsk tryffel, parmesan, grädde', available: true },
  { id: '7', name: 'Crème Brûlée', category: 'Efterrätt', price: 115, description: 'Klassisk vanilj', available: true },
  { id: '8', name: 'Chokladfondant', category: 'Efterrätt', price: 125, description: 'Vaniljglass, hallon', available: true },
  { id: '9', name: 'Husets Rödvin', category: 'Dryck', price: 110, description: 'Glas', available: true },
  { id: '10', name: 'IPA Fat', category: 'Dryck', price: 89, description: '40cl', available: true },
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
