import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarRange, ShoppingCart, Users, Menu as MenuIcon, 
  Settings, LogOut, Sun, Moon, Bell, CheckSquare, BarChart3, Star, Package
} from 'lucide-react';
import { User, MenuItem } from './types';
import { Button, Input, Card, Toast, Badge, Modal } from './components/UI';
import { mockBookings, mockMenu, mockStaff, mockKPIs, salesData } from './services/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

// --- Contexts ---

interface AppContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'staff') => void;
  logout: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const useApp = () => useContext(AppContext);

// --- Layout Components ---

const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { logout, restaurantName } = useApp();
  const p = location.pathname;

  return (
    <div className="w-64 h-screen bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border flex flex-col fixed left-0 top-0 z-10 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
             <span className="text-white dark:text-slate-900 font-bold text-lg">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight dark:text-white">Noory</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate pl-10">{restaurantName || 'Restaurant OS'}</p>
      </div>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Översikt</div>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={p === '/dashboard'} />
        <SidebarItem icon={CalendarRange} label="Bokning & Bord" path="/bookings" active={p === '/bookings'} />
        <SidebarItem icon={ShoppingCart} label="Kassa (POS)" path="/pos" active={p === '/pos'} />
        
        <div className="mt-6 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Drift</div>
        <SidebarItem icon={MenuIcon} label="Meny & Dryck" path="/menu" active={p === '/menu'} />
        <SidebarItem icon={Users} label="Personal & Schema" path="/staff" active={p === '/staff'} />
        <SidebarItem icon={Package} label="Lager & Inköp" path="/inventory" active={p === '/inventory'} />
        <SidebarItem icon={CheckSquare} label="Checklistor" path="/tasks" active={p === '/tasks'} />

        <div className="mt-6 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analys</div>
        <SidebarItem icon={BarChart3} label="Rapporter" path="/reports" active={p === '/reports'} />
        <SidebarItem icon={Star} label="Marknadsföring" path="/marketing" active={p === '/marketing'} />
        <SidebarItem icon={Settings} label="Inställningar" path="/settings" active={p === '/settings'} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-dark-border">
        <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium w-full px-2 py-2">
          <LogOut size={16} />
          Logga ut
        </button>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { toggleTheme, darkMode, user } = useApp();
  return (
    <div className="h-16 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Sales Demo Mode
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-dark-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold dark:text-white">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 p-8 min-h-screen transition-all">
        {children}
      </main>
    </div>
  );
};

// --- Pages ---

const AuthPage = () => {
  const { login, showToast } = useApp();
  const [email, setEmail] = useState('admin@demo.se');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const role = email.includes('admin') ? 'admin' : 'staff';
      login(email, role);
      showToast(`Välkommen tillbaka, ${role === 'admin' ? 'Ägare' : 'Personal'}!`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
             <span className="text-white dark:text-slate-900 font-bold text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">Noory Restaurant OS</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Logga in på din arbetsyta</p>
        </div>
        
        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="E-post" 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
            />
            <Input 
              label="Lösenord" 
              type="password" 
              value={password} 
              onChange={(e: any) => setPassword(e.target.value)} 
            />
            <Button fullWidth disabled={loading}>
              {loading ? 'Loggar in...' : 'Logga in'}
            </Button>
            <div className="text-center mt-4 text-xs text-slate-400">
              <p>Demo Admin: admin@demo.se / demo123</p>
              <p>Demo Personal: staff@demo.se / demo123</p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

const OnboardingWizard = () => {
  const { completeOnboarding, setRestaurantName, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Bistro Noory');

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else {
      setRestaurantName(name);
      completeOnboarding();
      showToast("Din restaurang är nu konfigurerad!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center px-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-2 w-16 rounded-full ${s <= step ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Steg {step} av 4</span>
        </div>

        <Card>
          <div className="min-h-[300px] flex flex-col">
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-bold dark:text-white">Berätta om din restaurang</h2>
                <p className="text-slate-500 dark:text-slate-400">Vi sätter upp grunden för ditt system.</p>
                <div className="space-y-4 mt-6">
                  <Input label="Restaurangnamn" value={name} onChange={(e: any) => setName(e.target.value)} />
                  <Input label="Adress" placeholder="Storgatan 1, Stockholm" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Öppettider (Vardag)" placeholder="11:00 - 22:00" />
                    <Input label="Telefon" placeholder="08-123 45 67" />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-bold dark:text-white">Meny & Prissättning</h2>
                <p className="text-slate-500 dark:text-slate-400">Importera din meny eller börja från en mall.</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="border border-slate-200 dark:border-dark-border p-4 rounded-lg cursor-pointer hover:border-slate-900 dark:hover:border-white transition-colors bg-slate-50 dark:bg-slate-800">
                      <div className="font-bold mb-1 dark:text-white">Fine Dining Mall</div>
                      <p className="text-xs text-slate-500">Förrätter, Varmrätter, Avsmakning</p>
                   </div>
                   <div className="border border-slate-200 dark:border-dark-border p-4 rounded-lg cursor-pointer hover:border-slate-900 dark:hover:border-white transition-colors bg-white dark:bg-dark-card">
                      <div className="font-bold mb-1 dark:text-white">Bistro / Casual</div>
                      <p className="text-xs text-slate-500">Burgare, Sallader, Snacks</p>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-4">
                 <h2 className="text-2xl font-bold dark:text-white">Lägg till nyckelpersoner</h2>
                 <p className="text-slate-500 dark:text-slate-400">Bjud in chefer och personalansvariga.</p>
                 <div className="space-y-3 mt-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex gap-3">
                       <Input placeholder="E-post" className="flex-1" />
                       <select className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg px-3 text-sm dark:text-white">
                         <option>Admin</option>
                         <option>Personal</option>
                       </select>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-bold dark:text-white">Koppla Integrationer</h2>
                <p className="text-slate-500 dark:text-slate-400">Aktivera betalningar och bokningssystem (Demo).</p>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg dark:border-dark-border">
                    <span className="font-medium dark:text-white">Stripe / Kortbetalning</span>
                    <button className="text-green-600 text-sm font-bold">Ansluten</button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg dark:border-dark-border">
                    <span className="font-medium dark:text-white">Fortnox (Bokföring)</span>
                    <button className="text-slate-900 dark:text-white text-sm underline">Anslut</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-8 flex justify-end gap-3">
              {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Tillbaka</Button>}
              <Button onClick={nextStep}>{step === 4 ? 'Slutför Setup' : 'Nästa steg'}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Översikt</h1>
          <p className="text-slate-500 dark:text-slate-400">Här är läget för restaurangen idag.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary">Exportera</Button>
           <Button>Ny Bokning</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, idx) => (
          <Card key={idx} className="p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{kpi.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold dark:text-white tracking-tight">{kpi.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {kpi.trendUp ? '+' : '-'}{kpi.trend}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg dark:text-white">Försäljning (Vecka)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} kr`, 'Försäljning']}
                />
                <Area type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 dark:text-white">Att göra (Alerts)</h3>
          <div className="space-y-4">
            <div className="flex gap-3 items-start p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
              <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">Lågt lager: Rödvin</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Endast 4 flaskor kvar. Beställ innan 14:00.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
               <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Personalbrist Lördag</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Sjukfrånvaro i köket. Behöver täckas.</p>
              </div>
            </div>
             <div className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
               <div className="mt-1 w-2 h-2 rounded-full bg-slate-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">Ny recension</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">5 stjärnor från "Erik G" på Google.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const BookingsPage = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [bookings, setBookings] = useState(mockBookings);
  const { showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateStatus = (id: string, status: any) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if(status === 'arrived') showToast('Gäst incheckad');
    if(status === 'noshow') showToast('Gäst markerad som No-show');
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    e.dataTransfer.setData("bookingId", bookingId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData("bookingId");
    if (!bookingId) return;

    const sourceBooking = bookings.find(b => b.id === bookingId);
    if (!sourceBooking) return;

    if (sourceBooking.table === tableId) return; // Dropped on same table

    const targetBooking = bookings.find(b => b.table === tableId && b.status !== 'completed' && b.status !== 'cancelled');

    const newBookings = bookings.map(b => {
      // If we are moving the source booking
      if (b.id === bookingId) {
        return { ...b, table: tableId };
      }
      // If there was a booking at the target, swap it to the source's old table (or null if it was unseated)
      if (targetBooking && b.id === targetBooking.id) {
         return { ...b, table: sourceBooking.table };
      }
      return b;
    });

    setBookings(newBookings);
    
    if (targetBooking) {
      showToast(`Växlade plats: ${sourceBooking.customerName} <-> ${targetBooking.customerName}`);
    } else {
      showToast(`${sourceBooking.customerName} placerad på bord ${tableId}`);
    }
  };
  
  // Logic to drop back to unseated list
  const handleDropToUnseated = (e: React.DragEvent) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData("bookingId");
    if(!bookingId) return;
    
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, table: undefined } : b));
    showToast("Bokning borttagen från bord");
  }

  const unseatedBookings = bookings.filter(b => !b.table && b.status !== 'cancelled' && b.status !== 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Bokningar</h1>
          <p className="text-slate-500 dark:text-slate-400">Hantera kvällens sittningar.</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-dark-card p-1 rounded-lg border border-slate-200 dark:border-dark-border">
          <button 
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${view === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
          >
            Lista
          </button>
          <button 
            onClick={() => setView('map')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${view === 'map' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
          >
            Bordskarta
          </button>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Ny Bokning</Button>
      </div>

      {view === 'list' ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Tid</th>
                  <th className="px-6 py-4">Gäst</th>
                  <th className="px-6 py-4">Antal</th>
                  <th className="px-6 py-4">Bord</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">{booking.time}</td>
                    <td className="px-6 py-4 dark:text-slate-300">
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-xs text-slate-400">ID: {booking.id}</div>
                    </td>
                    <td className="px-6 py-4 dark:text-slate-300">{booking.guests} pers</td>
                    <td className="px-6 py-4 dark:text-slate-300">{booking.table || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge color={
                        booking.status === 'arrived' ? 'green' : 
                        booking.status === 'noshow' ? 'red' : 'blue'
                      }>
                        {booking.status === 'arrived' ? 'På plats' : 
                         booking.status === 'noshow' ? 'No-show' : 'Bokad'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'confirmed' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(booking.id, 'arrived')} className="text-emerald-600 hover:underline text-xs font-medium">Checka in</button>
                          <button onClick={() => updateStatus(booking.id, 'noshow')} className="text-red-600 hover:underline text-xs font-medium">No-show</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
          <Card className="flex-1 relative bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-dark-card/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-dark-border">
               Dra och släpp för att flytta
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 h-full overflow-y-auto">
               {[1,2,3,4,5,6,7,8,9,10,11,12].map(table => {
                 const booking = bookings.find(b => b.table === table.toString() && b.status !== 'completed' && b.status !== 'cancelled');
                 return (
                   <div 
                      key={table} 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnTable(e, table.toString())}
                      draggable={!!booking}
                      onDragStart={(e) => booking && handleDragStart(e, booking.id)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-sm relative group
                     ${booking 
                        ? 'bg-white border-blue-500 shadow-blue-100 dark:bg-dark-card dark:border-blue-500 cursor-grab active:cursor-grabbing' 
                        : 'bg-white/50 border-dashed border-slate-300 dark:bg-dark-card/30 dark:border-slate-700 hover:border-slate-400 hover:bg-white dark:hover:bg-dark-card'}`}
                   >
                      <div className="absolute top-2 left-3 text-xs font-bold text-slate-300 dark:text-slate-600">
                        {table}
                      </div>
                      
                      {booking ? (
                        <div className="text-center p-2 w-full">
                          <div className={`w-8 h-8 rounded-full mb-2 mx-auto flex items-center justify-center text-xs font-bold ${booking.status === 'arrived' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {booking.guests}p
                          </div>
                          <p className="font-semibold text-sm truncate w-full px-2 dark:text-white">{booking.customerName.split(' ')[0]}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{booking.time}</p>
                        </div>
                      ) : (
                         <div className="text-slate-300 dark:text-slate-600 text-xs font-medium uppercase tracking-wider">Ledigt</div>
                      )}
                   </div>
                 )
               })}
            </div>
          </Card>
          
          <Card 
            className="w-full lg:w-80 flex flex-col gap-4 bg-slate-100 dark:bg-dark-card/50 border-dashed"
            onDragOver={handleDragOver}
            onDrop={handleDropToUnseated}
          >
             <div className="flex justify-between items-center">
               <h3 className="font-bold dark:text-white">Ej placerade</h3>
               <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded-full font-bold">{unseatedBookings.length}</span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-3 pr-1">
               {unseatedBookings.length === 0 && (
                 <p className="text-center text-slate-400 text-xs mt-10">Inga väntande bokningar</p>
               )}
               {unseatedBookings.map(b => (
                 <div 
                   key={b.id}
                   draggable
                   onDragStart={(e) => handleDragStart(e, b.id)}
                   className="bg-white dark:bg-dark-card p-3 rounded-lg border border-slate-200 dark:border-dark-border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                 >
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-semibold text-sm dark:text-white">{b.customerName}</span>
                     <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">{b.time}</span>
                   </div>
                   <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                     <span>{b.guests} personer</span>
                     <span>•</span>
                     <span className="capitalize">{b.status}</span>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-auto p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
               <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                 Tips: Dra en bokning hit för att ta bort den från ett bord.
               </p>
             </div>
          </Card>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ny Bokning">
        <div className="space-y-4">
          <Input label="Gästens namn" placeholder="Namn Namnsson" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Datum" type="date" />
            <Input label="Tid" type="time" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Antal gäster" type="number" />
            <Input label="Telefon" placeholder="070..." />
          </div>
          <Input label="Noteringar (Allergier etc.)" />
          <Button fullWidth onClick={() => { setIsModalOpen(false); showToast("Bokning skapad!"); }}>Skapa Bokning</Button>
        </div>
      </Modal>
    </div>
  );
};

const POSPage = () => {
  const { showToast } = useApp();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Varmrätt');

  const addToCart = (item: MenuItem) => setCart([...cart, item]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const categories = ['Förrätt', 'Varmrätt', 'Efterrätt', 'Dryck'];

  const handleCheckout = () => {
    if(cart.length === 0) return;
    showToast("Beställning skickad till köket!");
    setCart([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white text-slate-600 border border-slate-200 dark:bg-dark-card dark:text-slate-400 dark:border-dark-border'}`}
             >
               {cat}
             </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
           {mockMenu.filter(i => i.category === activeCategory).map(item => (
             <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-xl cursor-pointer hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between h-32"
             >
               <h4 className="font-semibold text-sm dark:text-white line-clamp-2">{item.name}</h4>
               <div className="flex justify-between items-end">
                 <span className="font-bold text-slate-900 dark:text-slate-200">{item.price} kr</span>
                 <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">+</div>
               </div>
             </div>
           ))}
        </div>
      </div>

      <Card className="w-80 flex flex-col p-0 overflow-hidden border-slate-300 shadow-xl dark:border-dark-border">
         <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
           <h3 className="font-bold dark:text-white">Nuvarande Nota</h3>
           <p className="text-xs text-slate-500">Bord 4</p>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-10">Inga varor valda</div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="dark:text-slate-300">{item.name}</span>
                  <span className="font-medium dark:text-white">{item.price} kr</span>
                </div>
              ))
            )}
         </div>
         <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between font-bold text-lg dark:text-white">
              <span>Totalt</span>
              <span>{total} kr</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setCart([])}>Rensa</Button>
              <Button onClick={handleCheckout} disabled={cart.length === 0}>Betala</Button>
            </div>
         </div>
      </Card>
    </div>
  );
};

const StaffPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Personal & Schema</h1>
          <p className="text-slate-500 dark:text-slate-400">Hantera ditt team.</p>
        </div>
        <Button>+ Lägg till skift</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {mockStaff.map(staff => (
           <Card key={staff.id} className="flex items-center gap-4">
              <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
              <div className="flex-1">
                 <h4 className="font-bold dark:text-white">{staff.name}</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400">{staff.role}</p>
              </div>
              <Badge color={staff.status === 'active' ? 'green' : staff.status === 'break' ? 'yellow' : 'gray'}>
                {staff.status === 'active' ? 'Jobbar' : staff.status === 'break' ? 'Rast' : 'Ledig'}
              </Badge>
           </Card>
         ))}
      </div>
      
      <Card>
        <h3 className="font-bold mb-4 dark:text-white">Veckans Schema</h3>
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(day => (
            <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
          {[...Array(7)].map((_, i) => (
             <div key={i} className="bg-white dark:bg-dark-card h-32 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {i > 2 && i < 6 && (
                   <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs p-1 rounded mb-1">
                     16:00 - 23:00 (3)
                   </div>
                )}
                 {i === 4 && (
                   <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs p-1 rounded mb-1">
                     Extra: Kalle
                   </div>
                )}
             </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// --- App Root Logic ---

const AppContent = () => {
  const { user, isOnboarded } = useApp();
  
  if (!user) {
    return <AuthPage />;
  }

  if (!isOnboarded) {
    return <OnboardingWizard />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="*" element={<div className="text-center mt-20 text-slate-500">Modul under utveckling (Demo)</div>} />
      </Routes>
    </Layout>
  );
};

const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const login = (email: string, role: 'admin' | 'staff') => {
    setUser({ id: '1', name: role === 'admin' ? 'Ägare' : 'Personal', email, role });
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    setRestaurantName('');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider value={{ 
      user, login, logout, darkMode, toggleTheme, showToast, 
      restaurantName, setRestaurantName, isOnboarded, completeOnboarding: () => setIsOnboarded(true) 
    }}>
      {children}
      {toastMsg && <Toast message={toastMsg} />}
    </AppContext.Provider>
  );
};

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}