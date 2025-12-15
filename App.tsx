import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarRange, ShoppingCart, Users, Menu as MenuIcon, 
  Settings, LogOut, Sun, Moon, Bell, CheckSquare, BarChart3, Star, Package,
  Search, ChevronRight, MapPin, Clock, MoreHorizontal
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
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
        active 
        ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white font-medium'
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { logout, restaurantName } = useApp();
  const p = location.pathname;

  return (
    <div className="w-72 h-screen bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border flex flex-col fixed left-0 top-0 z-20">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
             <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-primary dark:text-white">Noory</span>
        </div>
        
        {/* Restaurant Selector / Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-dark-border cursor-pointer hover:shadow-soft transition-shadow">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-900 dark:text-white">BN</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-sm truncate dark:text-white">{restaurantName || 'Restaurant OS'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Premium Plan</p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Main</div>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={p === '/dashboard'} />
        <SidebarItem icon={CalendarRange} label="Bookings" path="/bookings" active={p === '/bookings'} />
        <SidebarItem icon={ShoppingCart} label="Point of Sale" path="/pos" active={p === '/pos'} />
        
        <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-6">Manage</div>
        <SidebarItem icon={MenuIcon} label="Menu" path="/menu" active={p === '/menu'} />
        <SidebarItem icon={Users} label="Staff" path="/staff" active={p === '/staff'} />
        <SidebarItem icon={Package} label="Inventory" path="/inventory" active={p === '/inventory'} />

        <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-6">Insights</div>
        <SidebarItem icon={BarChart3} label="Reports" path="/reports" active={p === '/reports'} />
        <SidebarItem icon={Settings} label="Settings" path="/settings" active={p === '/settings'} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-dark-border">
        <button onClick={logout} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { toggleTheme, darkMode, user } = useApp();
  const location = useLocation();

  // Get current page title
  const getTitle = () => {
    const path = location.pathname.substring(1);
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
  };

  return (
    <div className="h-20 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border fixed top-0 right-0 left-72 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
         {/* Search Bar - Airbnb Style */}
         <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-transparent focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-soft transition-all w-80">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder={`Search ${getTitle()}...`} 
              className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder-gray-500 dark:text-white"
            />
         </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 rounded-full transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-dark-card"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

        <button className="flex items-center gap-3 pl-2 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold dark:text-white overflow-hidden">
             {user?.name ? user.name.charAt(0) : 'U'}
          </div>
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors font-sans text-gray-800">
      <Sidebar />
      <Topbar />
      <main className="ml-72 pt-20 p-10 min-h-screen max-w-[1600px] mx-auto">
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
      showToast(`Welcome back, ${role === 'admin' ? 'Owner' : 'Staff'}!`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-200 dark:shadow-none rotate-3">
             <span className="text-white font-extrabold text-3xl">N</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome to Noory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">The premium OS for modern restaurants.</p>
        </div>
        
        <Card className="shadow-floating border-none">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Email" 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              className="text-lg"
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e: any) => setPassword(e.target.value)} 
            />
            <Button fullWidth variant="primary" disabled={loading} className="py-4 text-base">
              {loading ? 'Logging in...' : 'Continue'}
            </Button>
            <div className="text-center mt-6 text-sm text-gray-400">
              <p>Demo Admin: admin@demo.se / demo123</p>
              <p>Demo Staff: staff@demo.se / demo123</p>
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
      showToast("Restaurant setup complete!");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-10 px-2">
           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Let's set up your space</h1>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${s <= step ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}`} />
            ))}
          </div>
        </div>

        <Card className="shadow-floating border-none p-10 min-h-[450px] flex flex-col justify-between">
            {step === 1 && (
              <div className="animate-fade-in space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's the name of your place?</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">This will be visible on your receipts and booking page.</p>
                </div>
                <div className="space-y-6 mt-8">
                  <Input label="Restaurant Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="e.g. The Nordic Table" />
                  <Input label="Address" placeholder="Street address, City" />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose your style</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">We'll adapt the menu template for you.</p>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8">
                   <div className="border-2 border-gray-100 dark:border-gray-700 p-6 rounded-2xl cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all bg-gray-50 dark:bg-gray-800/50">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-2xl">🍷</div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">Fine Dining</div>
                      <p className="text-sm text-gray-500 mt-2">Course-based, extensive wine list.</p>
                   </div>
                   <div className="border-2 border-gray-100 dark:border-gray-700 p-6 rounded-2xl cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all bg-gray-50 dark:bg-gray-800/50">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-2xl">🍔</div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">Casual Bistro</div>
                      <p className="text-sm text-gray-500 mt-2">A la carte, quick service.</p>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-6">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invite your team</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Collaborate with your managers and chefs.</p>
                 </div>
                 <div className="space-y-4 mt-8">
                   <Input placeholder="Manager email" />
                   <Input placeholder="Chef email" />
                 </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Almost done</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Connect payment processing to start selling.</p>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="flex justify-between items-center p-5 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">Stripe</span>
                    </div>
                    <Badge color="green">Connected</Badge>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`font-semibold underline text-gray-900 dark:text-white ${step === 1 ? 'invisible' : ''}`}
               >
                 Back
               </button>
              <Button onClick={nextStep} variant="black" className="px-8">
                  {step === 4 ? 'Finish Setup' : 'Next'}
              </Button>
            </div>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Overview of your restaurant's performance.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary">Export Data</Button>
           <Button variant="black">+ New Booking</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, idx) => (
          <Card key={idx} className="flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{kpi.label}</p>
               {kpi.trendUp ? (
                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">+{kpi.trend}%</span>
               ) : (
                   <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs font-bold">-{kpi.trend}%</span>
               )}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{kpi.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Revenue (Week)</h3>
            <select className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-3 py-1 text-sm font-medium outline-none cursor-pointer">
                <option>This Week</option>
                <option>Last Week</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}
                  formatter={(value: number) => [`${value} kr`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-xl text-gray-900 dark:text-white">Activity & Alerts</h3>
             <Badge color="gray">3 New</Badge>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-start pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Low Stock Warning</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Red Wine (House) is below threshold. Only 4 bottles remaining.</p>
                <button className="text-xs font-bold text-rose-600 mt-2 hover:underline">Restock</button>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
               <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Staff Shortage</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Kitchen staff down by 1 for Saturday night shift.</p>
              </div>
            </div>
             <div className="flex gap-4 items-start">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Star size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">New Review</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">5 stars from "Erik G" on Google.</p>
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
    if(status === 'arrived') showToast('Guest checked in');
    if(status === 'noshow') showToast('Guest marked as No-show');
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
      showToast(`Swapped: ${sourceBooking.customerName} <-> ${targetBooking.customerName}`);
    } else {
      showToast(`${sourceBooking.customerName} seated at Table ${tableId}`);
    }
  };
  
  const handleDropToUnseated = (e: React.DragEvent) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData("bookingId");
    if(!bookingId) return;
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, table: undefined } : b));
    showToast("Booking removed from table");
  }

  const unseatedBookings = bookings.filter(b => !b.table && b.status !== 'cancelled' && b.status !== 'completed');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Manage tonight's seating plan.</p>
        </div>
        <div className="flex gap-4 items-center">
             <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              <button 
                onClick={() => setView('list')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                List
              </button>
              <button 
                onClick={() => setView('map')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'map' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Map
              </button>
            </div>
            <Button onClick={() => setIsModalOpen(true)} variant="black">New Booking</Button>
        </div>
      </div>

      {view === 'list' ? (
        <Card className="overflow-hidden p-0 border-none shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Time</th>
                  <th className="px-8 py-5">Guest</th>
                  <th className="px-8 py-5">Size</th>
                  <th className="px-8 py-5">Table</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">{booking.time}</td>
                    <td className="px-8 py-6 dark:text-gray-300">
                      <div className="font-bold text-base text-gray-900 dark:text-white">{booking.customerName}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {booking.id}</div>
                    </td>
                    <td className="px-8 py-6 text-gray-600 dark:text-gray-400 font-medium">{booking.guests} ppl</td>
                    <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">{booking.table || '-'}</td>
                    <td className="px-8 py-6">
                      <Badge color={
                        booking.status === 'arrived' ? 'green' : 
                        booking.status === 'noshow' ? 'red' : 'blue'
                      }>
                        {booking.status === 'arrived' ? 'Seated' : 
                         booking.status === 'noshow' ? 'No-show' : 'Booked'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {booking.status === 'confirmed' && (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => updateStatus(booking.id, 'arrived')} className="text-green-600 hover:text-green-700 font-bold text-sm">Check-in</button>
                          <button onClick={() => updateStatus(booking.id, 'noshow')} className="text-gray-400 hover:text-red-500 font-medium text-sm transition-colors">No-show</button>
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
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-14rem)]">
          <Card className="flex-1 relative bg-gray-50 dark:bg-dark-card border-none shadow-inner overflow-hidden">
             <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-gray-100 flex items-center gap-2">
               <MapPin size={14} className="text-primary"/> Drag & Drop to seat guests
             </div>
             
             {/* Floor Plan Styled Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-12 h-full overflow-y-auto">
               {[1,2,3,4,5,6,7,8,9,10,11,12].map(table => {
                 const booking = bookings.find(b => b.table === table.toString() && b.status !== 'completed' && b.status !== 'cancelled');
                 return (
                   <div 
                      key={table} 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnTable(e, table.toString())}
                      draggable={!!booking}
                      onDragStart={(e) => booking && handleDragStart(e, booking.id)}
                      className={`aspect-square rounded-[32px] flex flex-col items-center justify-center transition-all relative group
                     ${booking 
                        ? 'bg-white shadow-soft ring-4 ring-gray-50 dark:bg-gray-800 dark:ring-gray-700 cursor-grab active:cursor-grabbing' 
                        : 'border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}
                   >
                      <div className="absolute top-4 left-5 text-sm font-bold text-gray-300 dark:text-gray-600">
                        {table}
                      </div>
                      
                      {booking ? (
                        <div className="text-center p-4 w-full">
                          <div className={`w-10 h-10 rounded-full mb-3 mx-auto flex items-center justify-center text-sm font-bold ${booking.status === 'arrived' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {booking.guests}
                          </div>
                          <p className="font-bold text-base truncate w-full px-2 text-gray-900 dark:text-white">{booking.customerName.split(' ')[0]}</p>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                             <Clock size={12} /> {booking.time}
                          </p>
                        </div>
                      ) : (
                         <div className="text-gray-300 dark:text-gray-600 text-xs font-bold uppercase tracking-widest">Available</div>
                      )}
                   </div>
                 )
               })}
            </div>
          </Card>
          
          <Card 
            className="w-full lg:w-96 flex flex-col gap-4 bg-white dark:bg-dark-card border border-gray-100 shadow-soft"
            onDragOver={handleDragOver}
            onDrop={handleDropToUnseated}
          >
             <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white">Waiting List</h3>
               <span className="bg-black text-white text-xs px-2.5 py-1 rounded-full font-bold">{unseatedBookings.length}</span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
               {unseatedBookings.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <CheckSquare size={32} className="mb-2 opacity-20"/>
                    <p className="text-sm">All guests seated</p>
                 </div>
               )}
               {unseatedBookings.map(b => (
                 <div 
                   key={b.id}
                   draggable
                   onDragStart={(e) => handleDragStart(e, b.id)}
                   className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-base text-gray-900 dark:text-white">{b.customerName}</span>
                     <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-gray-900 dark:text-white">{b.time}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                     <div className="flex items-center gap-1.5">
                        <Users size={14} /> {b.guests} guests
                     </div>
                     <MoreHorizontal size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
               <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                 Drag a booking here to unseat
               </p>
             </div>
          </Card>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Reservation">
        <div className="space-y-6">
          <Input label="Guest Name" placeholder="e.g. John Doe" />
          <div className="grid grid-cols-2 gap-6">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input label="Guests" type="number" placeholder="2" />
            <Input label="Phone" placeholder="+46..." />
          </div>
          <Input label="Special Requests" placeholder="Allergies, table preference..." />
          <Button fullWidth variant="black" onClick={() => { setIsModalOpen(false); showToast("Booking confirmed"); }}>Confirm Booking</Button>
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
    showToast("Order sent to kitchen");
    setCart([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-8 animate-fade-in">
      <div className="flex-1 flex flex-col gap-8">
        {/* Categories as Tabs */}
        <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-1">
          {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-3 rounded-t-lg text-sm font-bold transition-all relative top-[1px] ${
                 activeCategory === cat 
                 ? 'text-black dark:text-white border-b-2 border-black dark:border-white' 
                 : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
               }`}
             >
               {cat}
             </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar">
           {mockMenu.filter(i => i.category === activeCategory).map(item => (
             <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="group bg-white dark:bg-dark-card border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl cursor-pointer hover:shadow-soft transition-all flex flex-col justify-between h-64 overflow-hidden relative"
             >
                {/* Mock Image Placeholder */}
                <div className="h-40 bg-gray-100 dark:bg-gray-800 w-full relative">
                   <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                     <span className="text-4xl opacity-50">🍽️</span>
                   </div>
                   <div className="absolute top-3 right-3 bg-white dark:bg-black px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                     {item.price} kr
                   </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                </div>
                
                {/* Add Button Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                        +
                    </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <Card className="w-96 flex flex-col p-0 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-floating rounded-2xl h-full">
         <div className="p-6 bg-white dark:bg-dark-card border-b border-gray-100 dark:border-gray-800">
           <div className="flex justify-between items-center">
             <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">Current Order</h3>
             <Badge color="gray">Table 4</Badge>
           </div>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-dark-bg/50">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                 <ShoppingCart size={40} className="opacity-20"/>
                 <p className="text-sm font-medium">Cart is empty</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white dark:bg-dark-card p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div>
                      <span className="block font-bold text-sm text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.price} kr</span>
                  </div>
                  <button onClick={() => {
                      const newCart = [...cart];
                      newCart.splice(idx, 1);
                      setCart(newCart);
                  }} className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                </div>
              ))
            )}
         </div>
         <div className="p-6 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{total} kr</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => setCart([])}>Clear</Button>
              <Button variant="black" onClick={handleCheckout} disabled={cart.length === 0}>Charge</Button>
            </div>
         </div>
      </Card>
    </div>
  );
};

const StaffPage = () => {
  return (
    <div className="space-y-10 animate-fade-in">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Staff & Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Manage your team schedule.</p>
        </div>
        <Button variant="black">Add Shift</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {mockStaff.map(staff => (
           <Card key={staff.id} className="flex items-center gap-5 hover:border-gray-300 transition-colors">
              <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800" />
              <div className="flex-1">
                 <h4 className="font-bold text-lg text-gray-900 dark:text-white">{staff.name}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{staff.role}</p>
              </div>
              <Badge color={staff.status === 'active' ? 'green' : staff.status === 'break' ? 'yellow' : 'gray'}>
                {staff.status === 'active' ? 'On Shift' : staff.status === 'break' ? 'Break' : 'Off'}
              </Badge>
           </Card>
         ))}
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Weekly Schedule</h3>
            <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">←</button>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">→</button>
            </div>
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-50 dark:bg-gray-800/50 p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-r border-gray-200 dark:border-gray-800">
              {day}
            </div>
          ))}
          {[...Array(7)].map((_, i) => (
             <div key={i} className="bg-white dark:bg-dark-card min-h-[160px] p-2 border-r border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {i > 2 && i < 6 && (
                   <div className="bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200 text-xs p-2 rounded-lg mb-2 font-bold shadow-sm border border-blue-100 dark:border-blue-800">
                     16:00 - 23:00 <br/>
                     <span className="font-normal opacity-80">3 Staff</span>
                   </div>
                )}
                 {i === 4 && (
                   <div className="bg-purple-50 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200 text-xs p-2 rounded-lg mb-2 font-bold shadow-sm border border-purple-100 dark:border-purple-800">
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
        <Route path="*" element={<div className="flex items-center justify-center h-[50vh] text-gray-400 font-bold text-xl">Module in development</div>} />
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
    setUser({ id: '1', name: role === 'admin' ? 'Owner' : 'Staff', email, role });
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