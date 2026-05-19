import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Fuel,
  Clock,
  MapPin,
  AlertTriangle,
  MessageSquare,
  Send,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';
import { vehicles, shipments, drivers, performanceData } from './mockData';
import { askLogisticsAssistant } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'dashboard' | 'fleet' | 'shipments' | 'drivers';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askLogisticsAssistant(userMsg);
    setChatMessages(prev => [...prev, { role: 'assistant', content: response || '' }]);
    setIsTyping(false);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Truck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">TransPort</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <NavItem 
            icon={<Truck size={20} />} 
            label="Fleet" 
            active={activeView === 'fleet'} 
            onClick={() => setActiveView('fleet')} 
          />
          <NavItem 
            icon={<Package size={20} />} 
            label="Shipments" 
            active={activeView === 'shipments'} 
            onClick={() => setActiveView('shipments')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Drivers" 
            active={activeView === 'drivers'} 
            onClick={() => setActiveView('drivers')} 
          />
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="mt-4 p-4 bg-black rounded-2xl text-white">
            <p className="text-xs opacity-60 uppercase tracking-wider font-semibold mb-2">Pro Plan</p>
            <p className="text-sm font-medium mb-3">Upgrade for advanced route optimization</p>
            <button className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-[#F3F4F6] px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search vehicles, shipments, or drivers..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F3F4F6] rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#E5E7EB]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Alex Logistics</p>
                <p className="text-xs text-[#6B7280]">Fleet Manager</p>
              </div>
              <img 
                src="https://i.pravatar.cc/150?u=admin" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-[#E5E7EB]"
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && <DashboardView key="dashboard" />}
            {activeView === 'fleet' && <FleetView key="fleet" />}
            {activeView === 'shipments' && <ShipmentsView key="shipments" />}
            {activeView === 'drivers' && <DriversView key="drivers" />}
          </AnimatePresence>
        </div>
      </main>

      {/* AI Assistant Toggle */}
      <button 
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageSquare size={24} />
      </button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
          >
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-black text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="font-bold">Logistics Assistant</h3>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsAssistantOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9FAFB]">
              {chatMessages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <Truck size={32} className="text-black" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">How can I help?</h4>
                  <p className="text-sm text-[#6B7280] px-8">Ask me about fleet status, shipment delays, or route optimization.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-white border border-[#E5E7EB] rounded-tl-none shadow-sm"
                  )}>
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] mt-1 uppercase tracking-tighter">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E7EB] bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything..." 
                  className="w-full bg-[#F3F4F6] border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-black outline-none"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-black text-white shadow-lg shadow-black/10" 
          : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-black"
      )}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
    </button>
  );
}

function DashboardView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Overview</h1>
          <p className="text-[#6B7280] mt-1">Real-time performance and logistics metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium hover:bg-[#F9FAFB]">
            Download Report
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-opacity-90">
            Create Shipment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Vehicles" 
          value="12/15" 
          trend="+2 today" 
          trendType="up" 
          icon={<Truck size={24} className="text-blue-600" />} 
          color="blue"
        />
        <StatCard 
          title="Pending Shipments" 
          value="24" 
          trend="-5% vs last week" 
          trendType="down" 
          icon={<Package size={24} className="text-orange-600" />} 
          color="orange"
        />
        <StatCard 
          title="Fuel Efficiency" 
          value="8.4 mpg" 
          trend="+1.2% improvement" 
          trendType="up" 
          icon={<Fuel size={24} className="text-emerald-600" />} 
          color="emerald"
        />
        <StatCard 
          title="Avg. Delivery Time" 
          value="1.4 days" 
          trend="On target" 
          trendType="neutral" 
          icon={<Clock size={24} className="text-purple-600" />} 
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Delivery Performance</h3>
            <select className="bg-[#F3F4F6] border-none rounded-lg text-xs font-semibold px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="deliveries" 
                  stroke="#000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDeliveries)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
          <h3 className="font-bold text-lg mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            <AlertItem 
              type="warning" 
              title="Low Fuel Level" 
              desc="Vehicle V3 (Mercedes Sprinter) is at 10% fuel." 
              time="12 mins ago"
            />
            <AlertItem 
              type="error" 
              title="Delayed Shipment" 
              desc="Shipment S103 is delayed due to weather in Atlanta." 
              time="45 mins ago"
            />
            <AlertItem 
              type="info" 
              title="Maintenance Due" 
              desc="Vehicle V1 is scheduled for service in 3 days." 
              time="2 hours ago"
            />
            <AlertItem 
              type="success" 
              title="Delivery Confirmed" 
              desc="Shipment S104 delivered to Denver, CO." 
              time="4 hours ago"
            />
          </div>
          <button className="w-full mt-6 py-3 text-sm font-semibold text-[#6B7280] hover:text-black transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FleetView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
        <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">
          Add New Vehicle
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Fuel</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Mileage</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Last Service</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-[#F9FAFB] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                      <Truck size={20} className="text-[#4B5563]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{v.make} {v.model}</p>
                      <p className="text-xs text-[#6B7280]">{v.licensePlate} • {v.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    v.status === 'active' ? "bg-emerald-100 text-emerald-700" :
                    v.status === 'maintenance' ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 w-24 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          v.fuelLevel > 50 ? "bg-emerald-500" : v.fuelLevel > 20 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${v.fuelLevel}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{v.fuelLevel}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {v.mileage.toLocaleString()} mi
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7280]">
                  {v.lastService}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-[#E5E7EB] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ShipmentsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium">
            Filter
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">
            New Shipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {shipments.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F3F4F6] rounded-2xl flex items-center justify-center">
                  <Package size={24} className="text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">#{s.id}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      s.priority === 'high' ? "bg-red-100 text-red-700" :
                      s.priority === 'medium' ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {s.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280]">{s.cargo} • {s.weight.toLocaleString()} lbs</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Origin</p>
                    <p className="text-sm font-semibold">{s.origin}</p>
                  </div>
                  <div className="w-8 h-px bg-[#E5E7EB]"></div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Destination</p>
                    <p className="text-sm font-semibold">{s.destination}</p>
                  </div>
                </div>

                <div className="h-10 w-px bg-[#E5E7EB]"></div>

                <div>
                  <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Status</p>
                  <span className={cn(
                    "text-sm font-bold",
                    s.status === 'in-transit' ? "text-blue-600" :
                    s.status === 'delivered' ? "text-emerald-600" :
                    s.status === 'delayed' ? "text-red-600" :
                    "text-amber-600"
                  )}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </div>

                <button className="p-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors">
                  <MapPin size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DriversView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">
          Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img src={d.avatar} alt={d.name} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md" />
              <div className={cn(
                "absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-white",
                d.status === 'on-duty' ? "bg-emerald-500" :
                d.status === 'break' ? "bg-amber-500" :
                "bg-gray-400"
              )}></div>
            </div>
            <h3 className="font-bold text-lg">{d.name}</h3>
            <p className="text-xs text-[#6B7280] mb-4">{d.licenseNumber}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-[#F9FAFB] p-2 rounded-xl">
                <p className="text-[10px] text-[#9CA3AF] uppercase font-bold">Rating</p>
                <p className="text-sm font-bold">⭐ {d.rating}</p>
              </div>
              <div className="bg-[#F9FAFB] p-2 rounded-xl">
                <p className="text-[10px] text-[#9CA3AF] uppercase font-bold">Trips</p>
                <p className="text-sm font-bold">{d.totalTrips}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#F3F4F6] text-black rounded-lg text-xs font-bold hover:bg-[#E5E7EB]">
                Profile
              </button>
              <button className="flex-1 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-opacity-90">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, trend, trendType, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", colorMap[color])}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600" :
          trendType === 'down' ? "bg-red-50 text-red-600" :
          "bg-gray-50 text-gray-600"
        )}>
          {trendType === 'up' ? <ArrowUpRight size={14} /> : trendType === 'down' ? <ArrowDownRight size={14} /> : null}
          {trend}
        </div>
      </div>
      <p className="text-sm text-[#6B7280] font-medium">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function AlertItem({ type, title, desc, time }: any) {
  const icons: any = {
    warning: <AlertTriangle size={18} className="text-amber-600" />,
    error: <AlertTriangle size={18} className="text-red-600" />,
    info: <Clock size={18} className="text-blue-600" />,
    success: <ChevronRight size={18} className="text-emerald-600" />,
  };

  const colors: any = {
    warning: "bg-amber-50",
    error: "bg-red-50",
    info: "bg-blue-50",
    success: "bg-emerald-50",
  };

  return (
    <div className="flex gap-4 group cursor-pointer">
      <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", colors[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 border-b border-[#F3F4F6] pb-4 group-last:border-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold">{title}</h4>
          <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">{time}</span>
        </div>
        <p className="text-xs text-[#6B7280] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
