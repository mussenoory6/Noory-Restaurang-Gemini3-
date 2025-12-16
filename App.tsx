import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarRange, ShoppingCart, Users, Menu as MenuIcon, 
  Settings, LogOut, Sun, Moon, Bell, CheckSquare, BarChart3, Star, Package,
  Search, ChevronRight, MapPin, Clock, MoreHorizontal, AlertTriangle, Plus,
  Edit2, Trash2, ArrowUpRight, ArrowDownRight, Filter, Download, TrendingUp, TrendingDown, DollarSign
} from 'lucide-react';
import { User, MenuItem, InventoryItem } from './types';
import { Button, Input, Card, Toast, Badge, Modal } from './components/UI';
import { mockBookings, mockMenu, mockStaff, mockKPIs, salesData, mockInventory, reportData } from './services/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, 
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis, Legend 
} from 'recharts';

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

const ReportsPage = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'menu' | 'staff'>('overview');
  const [dateRange, setDateRange] = useState('Last 7 Days');

  const COLORS = ['#000000', '#FF385C', '#008489', '#FFC107', '#484848'];

  // Prepare Menu Analysis Data
  const menuAnalysisData = mockMenu.map(item => ({
    name: item.name,
    profit: (item.price - (item.costPrice || 0)),
    volume: item.salesCount || 0,
    costPercent: ((item.costPrice || 0) / item.price) * 100,
    category: item.category
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card p-3 border border-gray-100 dark:border-gray-800 rounded-xl shadow-soft">
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
             <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}} />
                <span className="text-gray-500 capitalize">{p.name}:</span>
                <span className="font-bold">{p.value}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, subtext, trend, trendUp }: any) => (
    <Card className="flex flex-col justify-between h-36">
       <div className="flex justify-between items-start">
         <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
         <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
            {Math.abs(trend)}%
         </span>
       </div>
       <div>
         <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
         <p className="text-xs text-gray-400 mt-1">{subtext}</p>
       </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Header */}
       <div className="flex justify-between items-end">
         <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Reports & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Deep dive into your restaurant's performance.</p>
         </div>
         <div className="flex gap-3">
             <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                 {['overview', 'sales', 'menu', 'staff'].map((tab: any) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-dark-card shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                   >
                     {tab}
                   </button>
                 ))}
             </div>
             <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black"
             >
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>Last Month</option>
             </select>
             <Button variant="black" onClick={() => showToast("Exporting report...")}>
                <Download size={18} />
             </Button>
         </div>
       </div>

       {activeTab === 'overview' && (
         <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard title="Total Revenue" value="372,000 kr" subtext="vs. 310,000 kr last period" trend={20} trendUp={true} />
               <StatCard title="Food Cost (COGS)" value="28.5%" subtext="Target: 30%" trend={1.5} trendUp={true} />
               <StatCard title="Labor Cost" value="32%" subtext="Target: 30%" trend={2} trendUp={false} />
               <StatCard title="Net Profit" value="48,500 kr" subtext="13% Margin" trend={5} trendUp={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="lg:col-span-2 min-h-[400px]">
                  <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Revenue vs. Costs</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData.revenueHistory}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#000000" strokeWidth={3} fill="url(#colorRev)" name="Revenue" />
                        <Area type="monotone" dataKey="costs" stackId="2" stroke="#FF385C" strokeWidth={2} fill="none" name="Food Cost" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </Card>
               <Card>
                  <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Category Split</h3>
                  <div className="h-64 w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={reportData.categorySales} 
                            cx="50%" cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value"
                          >
                             {reportData.categorySales.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="font-bold text-lg">100k</span>
                     </div>
                  </div>
                  <div className="space-y-3 mt-4">
                     {reportData.categorySales.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                             <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                           </div>
                           <span className="font-bold">{Math.round((item.value/100000)*100)}%</span>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
         </div>
       )}

       {activeTab === 'menu' && (
         <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="min-h-[500px]">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Menu Engineering Matrix</h3>
                        <p className="text-xs text-gray-500">Popularity vs. Profitability</p>
                     </div>
                  </div>
                  <div className="h-96 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                          <XAxis type="number" dataKey="volume" name="Sales Volume" unit=" qty" tick={{fill: '#717171', fontSize: 12}} />
                          <YAxis type="number" dataKey="profit" name="Profit Margin" unit=" kr" tick={{fill: '#717171', fontSize: 12}} />
                          <ZAxis type="category" dataKey="name" name="Dish" />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                          <Scatter name="Dishes" data={menuAnalysisData} fill="#000000">
                             {menuAnalysisData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.profit > 100 && entry.volume > 100 ? '#008489' : entry.profit < 50 && entry.volume < 100 ? '#FF385C' : '#000000'} />
                             ))}
                          </Scatter>
                          {/* Quadrant Lines */}
                          <line x1={0} y1={70} x2={500} y2={70} stroke="#EBEBEB" strokeWidth={2} strokeDasharray="5 5" />
                          <line x1={120} y1={0} x2={120} y2={200} stroke="#EBEBEB" strokeWidth={2} strokeDasharray="5 5" />
                        </ScatterChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <div className="flex gap-2 items-center text-xs">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span><strong>Stars:</strong> High Profit & Popular</span>
                     </div>
                     <div className="flex gap-2 items-center text-xs">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span><strong>Dogs:</strong> Low Profit & Unpopular</span>
                     </div>
                  </div>
               </Card>
               
               <Card>
                  <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Item Breakdown</h3>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 rounded-lg">
                           <tr>
                              <th className="px-4 py-3">Dish</th>
                              <th className="px-4 py-3 text-right">Cost %</th>
                              <th className="px-4 py-3 text-right">Margin</th>
                              <th className="px-4 py-3 text-right">Sold</th>
                           </tr>
                        </thead>
                        <tbody>
                           {menuAnalysisData.sort((a,b) => b.profit - a.profit).slice(0, 8).map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                 <td className="px-4 py-3 font-medium">{item.name}</td>
                                 <td className="px-4 py-3 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.costPercent > 35 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                       {item.costPercent.toFixed(1)}%
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 text-right font-bold">{item.profit} kr</td>
                                 <td className="px-4 py-3 text-right">{item.volume}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </Card>
            </div>
         </div>
       )}

       {activeTab === 'sales' && (
         <div className="space-y-8 animate-slide-up">
            <Card>
               <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Hourly Traffic Heatmap</h3>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={reportData.hourlyTraffic}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#717171', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#F7F7F7'}} content={<CustomTooltip />} />
                        <Bar dataKey="guests" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-xs text-gray-500 mt-4 text-center">Peak operating hours are between 18:00 and 20:00.</p>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col justify-center items-center p-10 text-center">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Users size={32} className="text-gray-700 dark:text-white" />
                   </div>
                   <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">482</h3>
                   <p className="text-gray-500 font-bold mt-2">Total Guests This Week</p>
                   <p className="text-xs text-green-600 font-bold mt-1">+12% vs last week</p>
                </Card>
                <Card className="flex flex-col justify-center items-center p-10 text-center">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <DollarSign size={32} className="text-gray-700 dark:text-white" />
                   </div>
                   <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">772 kr</h3>
                   <p className="text-gray-500 font-bold mt-2">Average Order Value</p>
                   <p className="text-xs text-red-600 font-bold mt-1">-3% vs last week</p>
                </Card>
            </div>
         </div>
       )}
       
       {activeTab === 'staff' && (
         <div className="space-y-8 animate-slide-up">
            <Card>
               <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Staff Performance Leaderboard</h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-xs">
                        <tr>
                           <th className="px-6 py-4 rounded-l-lg">Staff Member</th>
                           <th className="px-6 py-4">Hours Worked</th>
                           <th className="px-6 py-4">Total Sales</th>
                           <th className="px-6 py-4">Sales / Hour</th>
                           <th className="px-6 py-4 rounded-r-lg">Tips Generated</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {reportData.staffPerformance.map((staff, idx) => (
                           <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{staff.name}</td>
                              <td className="px-6 py-4">{staff.hours} h</td>
                              <td className="px-6 py-4">{staff.sales} kr</td>
                              <td className="px-6 py-4 font-bold text-green-600">{Math.round(staff.sales / staff.hours)} kr/h</td>
                              <td className="px-6 py-4">{staff.tips} kr</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h4 className="font-bold mb-2">Labor Cost Analysis</h4>
                    <p className="text-sm text-gray-500 mb-6">Labor cost relative to revenue over the last 7 days.</p>
                    <div className="h-48 w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                       <BarChart width={300} height={150} data={reportData.revenueHistory}>
                          <Bar dataKey="labor" fill="#484848" />
                       </BarChart>
                    </div>
                </Card>
                <Card>
                   <h4 className="font-bold mb-2">Top Performer</h4>
                   <div className="flex items-center gap-4 mt-4">
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-3xl">🏆</div>
                      <div>
                         <h3 className="text-2xl font-extrabold">Maja Bar</h3>
                         <p className="text-gray-500">Highest Sales/Hour (1,485 kr)</p>
                         <Button variant="black" className="mt-2 text-xs py-1 px-3">View Profile</Button>
                      </div>
                   </div>
                </Card>
            </div>
         </div>
       )}
    </div>
  );
};

const InventoryPage = () => {
  const { showToast } = useApp();
  const [inventory, setInventory] = useState(mockInventory);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [adjustModal, setAdjustModal] = useState<{isOpen: boolean, itemId?: string, type?: 'add'|'remove'|'waste'}>({isOpen: false});
  const [adjustAmount, setAdjustAmount] = useState('0');

  const categories = ['All', ...Array.from(new Set(mockInventory.map(i => i.category)))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold);

  const handleAdjust = () => {
    if(!adjustModal.itemId) return;
    const amount = parseFloat(adjustAmount);
    if(isNaN(amount) || amount <= 0) return;

    setInventory(inventory.map(item => {
      if(item.id === adjustModal.itemId) {
        let newQuantity = item.quantity;
        if(adjustModal.type === 'add') newQuantity += amount;
        else newQuantity = Math.max(0, newQuantity - amount);
        return { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));

    showToast(`Stock updated: ${adjustModal.type} ${amount}`);
    setAdjustModal({isOpen: false});
    setAdjustAmount('0');
  };

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Low Stock Alert Section */}
       {lowStockItems.length > 0 && (
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
           <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                 <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <div className="flex-1">
                 <h3 className="font-bold text-amber-900 dark:text-amber-200 text-lg">Low Stock Alerts</h3>
                 <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">The following items are below their minimum threshold and need restocking.</p>
                 <div className="flex flex-wrap gap-3">
                   {lowStockItems.map(item => (
                     <div key={item.id} className="bg-white dark:bg-dark-card px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-sm shadow-sm">
                       <span className="font-semibold dark:text-white">{item.name}</span>
                       <span className="text-red-500 font-bold">{item.quantity} {item.unit}</span>
                       <span className="text-xs text-gray-400">(Min: {item.minThreshold})</span>
                     </div>
                   ))}
                 </div>
              </div>
              <Button variant="black" className="text-xs">Create Order</Button>
           </div>
        </Card>
       )}

       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Inventory</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Manage stock levels, waste, and orders.</p>
         </div>
         <div className="flex gap-3">
            <Button variant="secondary" className="gap-2"><ArrowDownRight size={18} /> Export</Button>
            <Button variant="black" className="gap-2"><Plus size={18} /> Add Item</Button>
         </div>
       </div>

       {/* Filters */}
       <div className="flex gap-4 items-center bg-white dark:bg-dark-card p-2 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm w-fit">
          <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 dark:text-white w-64" 
               placeholder="Search product..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${categoryFilter === cat ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
       </div>

       {/* Inventory Table */}
       <Card className="p-0 overflow-hidden border-none shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Product</th>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs w-48">Stock Level</th>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Cost</th>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Value</th>
                <th className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredInventory.map(item => {
                const stockPercent = Math.min(100, (item.quantity / (item.minThreshold * 3)) * 100);
                const statusColor = item.quantity <= item.minThreshold ? 'bg-red-500' : item.quantity <= item.minThreshold * 1.5 ? 'bg-yellow-500' : 'bg-green-500';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.supplier}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      <Badge color="gray">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between mb-1">
                         <span className={`font-bold ${item.quantity <= item.minThreshold ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{item.quantity} {item.unit}</span>
                         <span className="text-xs text-gray-400">Min: {item.minThreshold}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${statusColor} rounded-full`} style={{ width: `${stockPercent}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {item.costPrice} kr/{item.unit}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {(item.quantity * item.costPrice).toFixed(0)} kr
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setAdjustModal({isOpen: true, itemId: item.id, type: 'add'})} className="p-2 hover:bg-green-50 text-green-600 rounded-full" title="Add Stock">
                           <Plus size={16} />
                         </button>
                         <button onClick={() => setAdjustModal({isOpen: true, itemId: item.id, type: 'remove'})} className="p-2 hover:bg-gray-100 text-gray-600 rounded-full" title="Remove">
                           <ArrowDownRight size={16} />
                         </button>
                         <button onClick={() => setAdjustModal({isOpen: true, itemId: item.id, type: 'waste'})} className="p-2 hover:bg-red-50 text-red-600 rounded-full" title="Log Waste">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
       </Card>

       <Modal isOpen={adjustModal.isOpen} onClose={() => setAdjustModal({isOpen: false})} title={`Adjust Stock: ${adjustModal.type?.toUpperCase()}`}>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Update stock for {inventory.find(i => i.id === adjustModal.itemId)?.name}</p>
            <Input label="Quantity" type="number" value={adjustAmount} onChange={(e: any) => setAdjustAmount(e.target.value)} />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setAdjustModal({isOpen: false})}>Cancel</Button>
              <Button variant={adjustModal.type === 'add' ? 'black' : 'danger'} onClick={handleAdjust}>Confirm</Button>
            </div>
          </div>
       </Modal>
    </div>
  );
};

const MenuPage = () => {
  const { showToast } = useApp();
  const [menu, setMenu] = useState(mockMenu);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});

  const categories = ['All', 'Förrätt', 'Varmrätt', 'Efterrätt', 'Dryck'];

  const filteredMenu = activeCategory === 'All' ? menu : menu.filter(item => item.category === activeCategory);

  const handleSave = () => {
    if (editingItem.id) {
      setMenu(menu.map(i => i.id === editingItem.id ? { ...i, ...editingItem } as MenuItem : i));
      showToast("Dish updated successfully");
    } else {
      const newItem = { ...editingItem, id: Date.now().toString(), available: true } as MenuItem;
      setMenu([...menu, newItem]);
      showToast("New dish created");
    }
    setIsEditModalOpen(false);
  };

  const deleteItem = (id: string) => {
    if(confirm('Are you sure you want to delete this dish?')) {
      setMenu(menu.filter(i => i.id !== id));
      showToast("Dish deleted");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Menu Management</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Create, edit, and organize your digital menu.</p>
         </div>
         <Button variant="black" onClick={() => { setEditingItem({}); setIsEditModalOpen(true); }} className="gap-2">
            <Plus size={18} /> New Dish
         </Button>
       </div>

       {/* Category Tabs */}
       <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6">
          {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`pb-4 text-sm font-bold transition-all relative ${
                 activeCategory === cat 
                 ? 'text-gray-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 dark:after:bg-white' 
                 : 'text-gray-400 hover:text-gray-600'
               }`}
             >
               {cat}
             </button>
          ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredMenu.map(item => (
            <Card key={item.id} className="p-0 overflow-hidden flex flex-col group h-full">
               <div className="h-40 bg-gray-100 dark:bg-gray-800 relative group-hover:bg-gray-200 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">
                    {item.category === 'Dryck' ? '🍷' : '🍽️'}
                  </div>
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${item.available ? 'bg-white dark:bg-black text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {item.available ? 'Available' : 'Sold Out'}
                  </div>
               </div>
               
               <div className="p-5 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                    <span className="font-bold text-gray-900 dark:text-white">{item.price} kr</span>
                 </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
                 
                 {item.ingredients && item.ingredients.length > 0 && (
                   <div className="flex flex-wrap gap-1 mb-4">
                     {item.ingredients.map(ingId => {
                        const invItem = mockInventory.find(i => i.id === ingId);
                        return invItem ? (
                           <span key={ingId} className={`text-[10px] px-1.5 py-0.5 rounded border ${invItem.quantity <= invItem.minThreshold ? 'bg-red-50 border-red-100 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                             {invItem.name}
                           </span>
                        ) : null;
                     })}
                   </div>
                 )}

                 <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => { setEditingItem(item); setIsEditModalOpen(true); }}
                      className="flex-1 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleSave()} // Mock toggle availability
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      title="Toggle Availability"
                    >
                      {item.available ? '🚫' : '✅'}
                    </button>
                 </div>
               </div>
            </Card>
         ))}
         
         {/* Add New Card (Empty State) */}
         <button 
            onClick={() => { setEditingItem({}); setIsEditModalOpen(true); }}
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 dark:hover:text-white dark:hover:border-gray-500 transition-all gap-3"
         >
             <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
               <Plus size={24} />
             </div>
             <span className="font-bold">Add New Dish</span>
         </button>
       </div>

       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingItem.id ? 'Edit Dish' : 'New Dish'}>
          <div className="space-y-4">
            <Input label="Dish Name" value={editingItem.name || ''} onChange={(e: any) => setEditingItem({...editingItem, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Category</label>
                 <select 
                    className="px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-gray-900"
                    value={editingItem.category || 'Varmrätt'}
                    onChange={(e: any) => setEditingItem({...editingItem, category: e.target.value})}
                 >
                   {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <Input label="Price (kr)" type="number" value={editingItem.price || ''} onChange={(e: any) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
            </div>
            <Input label="Description" value={editingItem.description || ''} onChange={(e: any) => setEditingItem({...editingItem, description: e.target.value})} />
            
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox" 
                id="avail" 
                checked={editingItem.available !== false} 
                onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})}
                className="w-5 h-5 rounded text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="avail" className="font-medium">Available for sale</label>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              {editingItem.id && (
                <button onClick={() => { setIsEditModalOpen(false); deleteItem(editingItem.id!); }} className="text-red-500 font-bold text-sm hover:underline">Delete Dish</button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button variant="black" onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
       </Modal>
    </div>
  );
};

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
                     <span className="text-4xl opacity-50">
                        {item.category === 'Dryck' ? '🍷' : '🍽️'}
                     </span>
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
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reports" element={<ReportsPage />} />
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