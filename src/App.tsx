/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, type ReactNode } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Search,
  Activity,
  AlertTriangle,
  Info,
  Maximize2,
  Menu,
  PieChart as PieChartIcon,
  LayoutDashboard,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_DATA, KPI_METRICS, SYSTEM_LOGS } from './constants';
import { ChartType, DashboardData } from './types';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChart, setActiveChart] = useState<ChartType>('Area');
  const [showGrid, setShowGrid] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [yAxisKey, setYAxisKey] = useState<keyof DashboardData>('revenue');

  const chartColors = {
    revenue: '#4f46e5',
    users: '#10b981',
    conversion: '#f59e0b',
    anomalies: '#ef4444',
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MOCK_DATA, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "nexus_analytics_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        className="relative z-30 flex flex-col border-r border-slate-200 bg-[#0f172a] text-slate-300 shadow-xl"
      >
        <div className="flex h-14 items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Activity size={16} />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] font-bold tracking-tighter text-white uppercase"
              >
                Nexus <span className="font-light text-slate-400 italic">Core</span>
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          <div className="space-y-8">
            <div className="px-3">
              {isSidebarOpen && <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Analytics Engine</h3>}
              <div className="space-y-1">
                <ControlItem 
                  icon={<Filter size={18} />} 
                  label="Metrics" 
                  isOpen={isSidebarOpen} 
                >
                  <div className="mt-3 space-y-3">
                    <div className="relative">
                      <select 
                        value={yAxisKey}
                        onChange={(e) => setYAxisKey(e.target.value as any)}
                        className="w-full appearance-none rounded border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-300 focus:border-indigo-500 focus:outline-none transition-colors"
                      >
                        <option value="revenue">REVENUE_STREAM</option>
                        <option value="users">ACTIVE_NODES</option>
                        <option value="conversion">FLUX_STABILITY</option>
                        <option value="anomalies">RISK_VECTORS</option>
                      </select>
                      <ChevronRight size={10} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 opacity-40" />
                    </div>
                  </div>
                </ControlItem>
                <ControlItem 
                  icon={<PieChartIcon size={18} />} 
                  label="Projection" 
                  isOpen={isSidebarOpen} 
                >
                  <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-lg bg-black/20 p-1.5">
                    {(['Area', 'Line', 'Bar', 'Pie'] as ChartType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveChart(type)}
                        className={cn(
                          "rounded py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                          activeChart === type 
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                            : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </ControlItem>
              </div>
            </div>

            <div className="px-3">
              {isSidebarOpen && <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">System Preferences</h3>}
              <div className="space-y-4 px-4">
                <Toggle label="Grid Overlays" checked={showGrid} onChange={setShowGrid} isOpen={isSidebarOpen} />
                <Toggle label="Data Labels" checked={showTooltip} onChange={setShowTooltip} isOpen={isSidebarOpen} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/5 bg-black/10">
          {isSidebarOpen && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 rounded bg-white/5 py-2 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                <Download size={12} />
                JSON
              </button>
              <button className="flex items-center justify-center gap-2 rounded bg-indigo-500 py-2 text-[10px] font-bold uppercase text-white hover:bg-indigo-600 transition-colors">
                REFRESH
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex w-full items-center justify-center rounded py-2 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="relative flex flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-sm">
          <div className="flex items-center gap-8">
             <div className="flex flex-col">
              <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Environment Dashboard</h1>
              <span className="text-[13px] font-semibold text-slate-900">Cluster Analytics <span className="text-slate-300 font-light mx-2">/</span> <span className="text-indigo-600">Production</span></span>
             </div>
             <div className="hidden h-8 w-px bg-slate-200 lg:block" />
             <div className="hidden items-center gap-3 lg:flex">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nodes Active: 14/14</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-medium transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>
            <div className="flex items-center gap-4">
              <IconButton icon={<Bell size={18} />} notification />
              <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm ring-1 ring-slate-200">
                <img src="https://picsum.photos/seed/user/100/100" referrerPolicy="no-referrer" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="mx-auto w-full max-w-[1600px] space-y-8 p-8">
          {/* KPI Grid */}
          <section>
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Vital Indicators</h2>
              <span className="text-[10px] font-medium text-slate-400 italic">Last snapshot: 2m ago</span>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {KPI_METRICS.map((metric, i) => (
                <MetricCard key={metric.id} metric={metric} delay={i * 0.05} />
              ))}
            </div>
          </section>

          {/* Main Visualization Area */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <section className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Performance Vector Analysis</h3>
                    <p className="text-[11px] font-medium text-slate-400">Real-time telemetry from production clusters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden h-8 items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 md:flex">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[yAxisKey] }} />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{yAxisKey}</span>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'Area' ? (
                  <AreaChart data={MOCK_DATA}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[yAxisKey]} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={chartColors[yAxisKey]} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />}
                    <XAxis 
                      dataKey="month" 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8' }} 
                      minTickGap={20}
                      preserveStartEnd="preserveStartEnd"
                    />
                    <YAxis 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                    />
                    {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />}
                    <Area 
                      type="monotone" 
                      dataKey={yAxisKey} 
                      stroke={chartColors[yAxisKey]} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorMetric)" 
                    />
                  </AreaChart>
                ) : activeChart === 'Line' ? (
                  <LineChart data={MOCK_DATA}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />}
                    <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} minTickGap={20}/>
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    <Line type="monotone" dataKey={yAxisKey} stroke={chartColors[yAxisKey]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : activeChart === 'Bar' ? (
                  <BarChart data={MOCK_DATA}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />}
                    <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    <Bar dataKey={yAxisKey} fill={chartColors[yAxisKey]} radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={MOCK_DATA}
                      dataKey="revenue"
                      nameKey="month"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                    >
                      {MOCK_DATA.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={[ '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'][index % 6]} />
                      ))}
                    </Pie>
                    {showTooltip && <Tooltip />}
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </section>

            {/* Sidebar Context Panel */}
            <aside className="space-y-6">
               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                  <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Node Allocation</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOCK_DATA}
                          dataKey="revenue"
                          nameKey="month"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {MOCK_DATA.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={[
                                '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff',
                                '#4338ca', '#3730a3', '#312e81', '#1e1b4b', '#171717', '#262626'
                              ][index % 12]} 
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Avg Health</p>
                      <p className="text-sm font-bold text-emerald-600">98.2%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Uptime</p>
                      <p className="text-sm font-bold text-slate-900">99.9h</p>
                    </div>
                  </div>
               </div>

               <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-600/20">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">System Tip</h4>
                  <p className="mt-2 text-xs leading-relaxed font-medium opacity-90">Anomaly detection is currently set to strict. Expected minor divergence in cluster-7 nodes.</p>
                  <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-[10px] font-bold uppercase hover:bg-white/30 transition-colors">
                    Review Alert Logic
                  </button>
               </div>
            </aside>
          </div>

          {/* Lower Grid: Logs & Audit */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Operational Logs */}
            <div className="lg:col-span-12 xl:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Event Stream</h3>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  </div>
              </div>
              <div className="flex-1">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">Trace_ID</th>
                      <th className="px-6 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">Telemetry_Log</th>
                      <th className="px-6 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-mono divide-y divide-slate-50">
                    {SYSTEM_LOGS.map((log) => (
                      <tr key={log.id} className={cn("group hover:bg-slate-50/50 transition-colors", log.type === 'critical' && "bg-rose-50/30")}>
                        <td className="px-6 py-3 text-indigo-500 font-bold group-hover:text-indigo-600 truncate max-w-[80px]">{log.id}</td>
                        <td className="px-6 py-3 text-slate-600 max-w-[240px] truncate">{log.message}</td>
                        <td className="px-6 py-3">
                            <span className={cn(
                                "inline-flex h-2 w-2 rounded-full",
                                log.type === 'critical' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : 
                                log.type === 'warning' ? "bg-amber-500" : "bg-emerald-500"
                            )}></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Data Table */}
            <section className="lg:col-span-12 xl:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 overflow-hidden">
              <div className="border-b border-slate-100 bg-white px-6 py-4 flex items-center justify-between">
                 <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Execution Audit</h2>
                 <button className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 transition-colors uppercase">
                  <Download size={12} />
                  Download CSV
                 </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Node_ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Throughput</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Load</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Stability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px] font-mono">
                    {MOCK_DATA.map((row, i) => (
                      <tr key={row.month} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <code className="text-[10px] bg-slate-100 rounded px-1 py-0.5 text-slate-500 group-hover:text-indigo-600 font-bold">NODE-{100 + i}</code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-900 font-bold">{row.month.toUpperCase()} 24</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-slate-800">${(row.revenue/1000).toFixed(1)}k</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-slate-500">{(row.users/10).toFixed(0)}%</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={cn(
                              "inline-flex items-center gap-1.5 rounded bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase",
                              row.anomalies > 2 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"
                          )}>
                            {row.anomalies > 2 ? 'De-Stabilized' : 'Encrypted'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ metric, delay }: { metric: any, delay: number, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden group bg-white p-6 border border-slate-200 rounded-2xl shadow-sm shadow-slate-200/50 hover:border-indigo-200 hover:shadow-indigo-500/5 transition-all"
    >
      <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Activity size={64} />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{metric.label}</span>
          <div className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
              metric.status === 'positive' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
              {metric.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {Math.abs(metric.change)}%
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tighter font-mono">
          {metric.prefix}{metric.value.toLocaleString()}{metric.suffix}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
           <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", metric.status === 'positive' ? "bg-emerald-500" : "bg-rose-500")} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Signal: Active</span>
           </div>
           <IconButton icon={<Maximize2 size={14} />} />
        </div>
      </div>
    </motion.div>
  );
}

function IconButton({ icon, notification }: { icon: ReactNode, notification?: boolean }) {
  return (
    <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
      {icon}
      {notification && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>}
    </button>
  );
}

function ControlItem({ icon, label, isOpen, children }: { icon: ReactNode, label: string, isOpen: boolean, children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) {
    return (
      <div className="flex h-12 w-full items-center justify-center text-slate-500 transition-colors hover:text-white">
        {icon}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</span>
          <span className="text-[12px] font-semibold tracking-wide">{label}</span>
        </div>
        <ChevronRight size={14} className={cn("transition-transform opacity-30", isExpanded && "rotate-90")} />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-2 pt-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({ label, checked, onChange, isOpen }: { label: string, checked: boolean, onChange: (v: boolean) => void, isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="flex items-center justify-between group">
      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-4 w-7 rounded-full transition-colors focus:outline-none ring-1 ring-white/10",
          checked ? "bg-indigo-500" : "bg-white/5"
        )}
      >
        <motion.span 
          initial={false}
          animate={{ x: checked ? 14 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label} Analysis</p>
        <div className="space-y-2">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-8 py-1 border-b border-slate-50 last:border-0">
               <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">
                {entry.name}
               </span>
               <span className="text-xs font-mono font-bold text-slate-900">
                {entry.name === 'revenue' ? '$' : ''}{entry.value.toLocaleString()}
               </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
