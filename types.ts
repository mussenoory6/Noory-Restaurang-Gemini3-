export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  openHours: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'kg' | 'liter' | 'st' | 'pkt';
  minThreshold: number;
  costPrice: number;
  supplier: string;
  lastUpdated: string;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Förrätt' | 'Varmrätt' | 'Efterrätt' | 'Dryck';
  price: number;
  costPrice?: number; // Added for margin calculation
  salesCount?: number; // Added for popularity analysis
  description: string;
  available: boolean;
  image?: string;
  ingredients?: string[]; // IDs from inventory
  modifiers?: Modifier[];
}

export interface Booking {
  id: string;
  customerName: string;
  time: string; // HH:mm
  date: string; // YYYY-MM-DD
  guests: number;
  status: 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'noshow';
  table?: string;
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'off';
  avatar: string;
}

export interface Order {
  id: string;
  items: MenuItem[];
  total: number;
  status: 'open' | 'paid';
  table: string;
  timestamp: Date;
}

export interface KPI {
  label: string;
  value: string;
  trend: number; // percentage
  trendUp: boolean;
}