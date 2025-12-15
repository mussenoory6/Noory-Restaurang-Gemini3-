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

export interface MenuItem {
  id: string;
  name: string;
  category: 'Förrätt' | 'Varmrätt' | 'Efterrätt' | 'Dryck';
  price: number;
  description: string;
  available: boolean;
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
