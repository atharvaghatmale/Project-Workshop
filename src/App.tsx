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
  ArrowDownRight,
  Sparkles,
  MessageSquare,
  Upload,
  Moon,
  Sun,
  BrainCircuit,
  Loader2
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
import { cn, parseCSV } from './lib/utils';
import { MOCK_DATA, KPI_METRICS, SYSTEM_LOGS } from './constants';
import { ChartType, DashboardData } from './types';
import { aiService } from './services/aiService';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChart, setActiveChart] = useState<ChartType>('Area');
  const [showGrid, setShowGrid] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [yAxisKey, setYAxisKey] = useState<keyof DashboardData>('revenue');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // New states for AI and Data features
  const [currentData, setCurrentData] = useState<DashboardData[]>(MOCK_DATA);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [askResponse, setAskResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [recommendation, setRecommendation] = useState<{ type: string, reason: string } | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  // UI State for dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * AI MANDATORY UPGRADE: Auto-initialize Insights
   */
  React.useEffect(() => {
    handleGenerateInsights();
  }, []);

  /**
   * WOW FEATURE: Auto-trigger recommendation on metric change
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleRecommendChart();
    }, 1000);
    return () => clearTimeout(timer);
  }, [yAxisKey, currentData]);

  const chartColors = {
    revenue: '#4f46e5',
    users: '#10b981',
    conversion: '#f59e0b',
    anomalies: '#ef4444',
  };

  /**
   * AI MANDATORY UPGRADE: Generate Insights
   */
  const handleGenerateInsights = async () => {
    setIsAiLoading(true);
    const insights = await aiService.generateInsights(currentData);
    setAiInsights(insights);
    setIsAiLoading(false);
  };

  /**
   * AI MANDATORY UPGRADE: Ask Your Data
   */
  const handleAskData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    setIsAsking(true);
    const result = await aiService.askData(askQuery, currentData);
    setAskResponse(result.answer);
    if (result.suggestedChart) {
      setActiveChart(result.suggestedChart as ChartType);
    }
    setIsAsking(false);
  };

  /**
   * MANDATORY UPGRADE: CSV Upload
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text) as DashboardData[];
        if (parsed.length > 0) {
          setCurrentData(parsed);
          // Auto-trigger chart recommendation and insights on new data
          handleRecommendChart();
          handleGenerateInsights();
        }
      };
      reader.readAsText(file);
    }
  };

  /**
   * WOW FEATURE: Auto chart recommendation
   */
  const handleRecommendChart = async () => {
    setIsRecommending(true);
    const rec = await aiService.recommendChart(yAxisKey, currentData);
    setRecommendation(rec);
    setIsRecommending(false);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "nexus_analytics_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData;
    const lowerQuery = searchQuery.toLowerCase();
    return currentData.filter(d => 
      String(d.month).toLowerCase().includes(lowerQuery) ||
      String(d.revenue).includes(lowerQuery) ||
      String(d.users).includes(lowerQuery)
    );
  }, [currentData, searchQuery]);

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans transition-colors duration-300",
      theme === 'dark' ? "bg-[#020617] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    )}>
      {/* Dropdown Backdrop */}
      <AnimatePresence>
        {(showNotifications || showUserMenu) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className={cn(
              "fixed inset-0 z-40 transition-all",
              theme === 'dark' ? "bg-black/20" : "bg-black/5"
            )}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        className="relative z-30 flex flex-col border-r border-slate-200 bg-[#0f172a] text-slate-300 shadow-xl transition-all duration-500"
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
                        <option value="revenue">REVENUE STREAM</option>
                        <option value="users">ACTIVE NODES</option>
                        <option value="conversion">FLUX STABILITY</option>
                        <option value="anomalies">RISK VECTORS</option>
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
              {isSidebarOpen && <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Data Pipeline</h3>}
              <div className="px-4 space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 bg-white/5 py-3 text-[10px] font-bold uppercase text-slate-400 hover:border-indigo-500 hover:bg-white/10 transition-all group">
                  <Upload size={14} className="group-hover:text-indigo-400" />
                  <span>{isSidebarOpen ? "Upload CSV" : "CSV"}</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </label>
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
      <main className={cn(
        "relative flex flex-1 flex-col overflow-y-auto transition-all duration-500",
        (showNotifications || showUserMenu) && "pointer-events-none"
      )}>
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-8 backdrop-blur-sm transition-colors",
          theme === 'dark' ? "border-slate-800 bg-[#020617]/80 shadow-slate-900" : "border-slate-200 bg-white/80 shadow-slate-200/50"
        )}>
          <div className="flex items-center gap-8">
             <div className="flex flex-col">
              <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Environment Dashboard</h1>
              <span className={cn(
                "text-[13px] font-semibold",
                theme === 'dark' ? "text-slate-100" : "text-slate-900"
              )}>Cluster Analytics <span className="text-slate-300 font-light mx-2">/</span> <span className="text-indigo-600">Production</span></span>
             </div>
             <div className={cn("hidden h-8 w-px lg:block", theme === 'dark' ? "bg-slate-800" : "bg-slate-200")} />
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global Search..." 
                className={cn(
                  "h-9 w-56 rounded-lg border pl-9 pr-3 text-[11px] font-medium transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                  theme === 'dark' ? "border-slate-700 bg-slate-900 text-slate-200 focus:border-indigo-500" : "border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-400 focus:bg-white"
                )}
              />
            </div>
            <div className="flex items-center gap-4">
              <IconButton 
                icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />} 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              />
              <div className="relative">
                <IconButton icon={<Bell size={18} />} notification onClick={() => setShowNotifications(!showNotifications)} />
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={cn(
                        "absolute right-0 mt-2 w-80 rounded-xl border p-4 shadow-2xl z-50",
                        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      )}
                    >
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { title: "Anomaly Detected", time: "2m ago", type: "critical" },
                          { title: "Node Upgrade Ready", time: "15m ago", type: "info" },
                          { title: "Daily Sync Completed", time: "1h ago", type: "success" }
                        ].map((notif, i) => (
                          <div key={i} className="flex flex-col gap-1 pb-2 border-b border-white/5 last:border-0 lowercase">
                            <div className="flex items-center justify-between">
                              <span className={cn("text-[11px] font-bold", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{notif.title}</span>
                              <span className="text-[9px] text-slate-500 italic">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm ring-1 ring-slate-200 hover:ring-indigo-500 transition-all focus:outline-none"
                >
                  <img src="https://picsum.photos/seed/user/100/100" referrerPolicy="no-referrer" alt="Avatar" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={cn(
                        "absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-2xl z-50",
                        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                      )}
                    >
                      <div className="p-3 border-b border-white/5 mb-1">
                        <p className={cn("text-xs font-bold", theme === 'dark' ? "text-slate-100" : "text-slate-900")}>Admin User</p>
                        <p className="text-[10px] text-slate-500">Root Access</p>
                      </div>
                      <button className="w-full text-left p-2 text-[11px] font-bold text-slate-500 hover:bg-white/5 hover:text-indigo-400 rounded-lg transition-colors">Profile Settings</button>
                      <button className="w-full text-left p-2 text-[11px] font-bold text-slate-500 hover:bg-white/5 hover:text-indigo-400 rounded-lg transition-colors">Security Audit</button>
                      <button className="w-full text-left p-2 text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">System Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <MetricCard key={metric.id} metric={metric} delay={i * 0.05} theme={theme} />
              ))}
            </div>
          </section>

          {/* AI MANDATORY UPGRADE: Insights Panel */}
          <section className={cn(
             "rounded-2xl border p-6 transition-all",
             theme === 'dark' ? "border-slate-800 bg-slate-900/50" : "bg-indigo-50 border-indigo-100"
          )}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h3 className={cn("text-sm font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Nexus AI Intelligence</h3>
                  <p className="text-[11px] font-medium text-slate-400">Automated dataset analysis and situational insights</p>
                </div>
              </div>
              <button 
                onClick={handleGenerateInsights}
                disabled={isAiLoading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {aiInsights.length > 0 ? "RE-GENERATE" : "GENERATE INSIGHTS"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 relative min-h-[120px]">
              {isAiLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3">
                  <div className="relative">
                    <BrainCircuit size={48} className="text-indigo-500 animate-spin [animation-duration:3s]" />
                    <Sparkles size={16} className="absolute -top-1 -right-1 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">AI Synthesizing Insights</p>
                    <p className="text-[9px] text-slate-500 animate-pulse">Scanning clusters for anomalies...</p>
                  </div>
                </div>
              ) : aiInsights.length > 0 ? (
                aiInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 transition-all",
                      theme === 'dark' ? "border-slate-700 bg-slate-800/50" : "border-indigo-100 bg-white"
                    )}
                  >
                    <div className="mb-2 flex h-5 w-5 items-center justify-center rounded bg-indigo-100 text-indigo-600 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <p className={cn("text-[11px] font-medium leading-relaxed", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                      {insight}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-400 italic">No insights generated. Click the button to analyze data.</p>
                </div>
              )}
            </div>
          </section>

          {/* AI MANDATORY UPGRADE: Ask Your Data */}
          <section className={cn(
             "rounded-2xl border p-6 overflow-hidden relative",
             theme === 'dark' ? "border-slate-800 bg-slate-900" : "bg-white border-slate-200"
          )}>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <MessageSquare size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className={cn("text-sm font-bold tracking-tight mb-1", theme === 'dark' ? "text-white" : "text-slate-900")}>Visual Query Interface</h3>
                <p className="text-[11px] font-medium text-slate-400 mb-6">Ask natural language questions about your environment clusters</p>
                
                <form onSubmit={handleAskData} className="relative mb-6">
                  <input 
                    type="text" 
                    value={askQuery}
                    onChange={(e) => setAskQuery(e.target.value)}
                    placeholder="Example: Which month had the highest signal stability?" 
                    className={cn(
                      "w-full rounded-xl border py-4 pl-5 pr-32 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    )}
                  />
                  <button 
                    disabled={isAsking}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 rounded-lg bg-indigo-600 text-[10px] font-bold text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    {isAsking ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                    RUN QUERY
                  </button>
                </form>

                <AnimatePresence mode="wait">
                  {isAsking ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "rounded-xl border p-8 flex flex-col items-center justify-center gap-3",
                        theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"
                      )}
                    >
                      <Loader2 size={24} className="text-indigo-500 animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Consulting Data Model...</p>
                    </motion.div>
                  ) : askResponse ? (
                    <motion.div 
                      key={askResponse}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "rounded-xl border p-4 flex gap-4",
                        theme === 'dark' ? "bg-indigo-900/20 border-indigo-800/30 text-indigo-200" : "bg-indigo-50 border-indigo-100 text-indigo-900"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        <Sparkles size={16} className="text-indigo-500" />
                      </div>
                      <p className="text-xs font-medium leading-relaxed">{askResponse}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              
              <div className="w-full md:w-64 shrink-0">
                <div className={cn("p-4 rounded-xl border border-dashed", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Model Capabilities</p>
                  <ul className="space-y-2">
                    {['Natural Queries', 'Trend Identification', 'Cluster Health Insights', 'Anomaly Summarization'].map(cap => (
                      <li key={cap} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Main Visualization Area */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <section className={cn(
               "lg:col-span-3 rounded-2xl border p-6 transition-all",
               theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className={cn("text-sm font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>Performance Vector Analysis</h3>
                    <p className="text-[11px] font-medium text-slate-400">Real-time telemetry from production clusters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* WOW FEATURE: AI Recommendation Badge */}
                  {recommendation && (
                    <motion.button 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveChart(recommendation.type as ChartType)}
                      className={cn(
                        "hidden 2xl:flex items-center gap-2 rounded-full border px-3 py-1 transition-all",
                        activeChart === recommendation.type 
                          ? "bg-indigo-600 border-indigo-500 text-white" 
                          : "border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      )}
                    >
                      <BrainCircuit size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-tight">
                        {activeChart === recommendation.type ? "OPTIMIZED VIEW" : `SWITCH TO ${recommendation.type}`}
                      </span>
                    </motion.button>
                  )}
                  
                  <div className={cn(
                    "hidden h-8 items-center gap-2 rounded-full border px-3 md:flex",
                    theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"
                  )}>
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[yAxisKey] }} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-tight", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>{yAxisKey}</span>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

            <div className={cn(
              "h-[400px] w-full relative",
              isRecommending && "opacity-40 grayscale transition-all duration-500"
            )}>
              {isRecommending && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <BrainCircuit size={40} className="text-indigo-500 animate-pulse" />
                    <div className="absolute inset-0 text-indigo-500 animate-ping opacity-20">
                      <BrainCircuit size={40} />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">AI Recalibrating View...</p>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'Area' ? (
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[yAxisKey]} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={chartColors[yAxisKey]} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />}
                    <XAxis 
                      dataKey="month" 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b' }} 
                      minTickGap={20}
                      preserveStartEnd="preserveStartEnd"
                    />
                    <YAxis 
                      fontSize={10} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b' }}
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                    />
                    {showTooltip && <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ fill: 'transparent' }} />}
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
                  <LineChart data={currentData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />}
                    <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} minTickGap={20}/>
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    {showTooltip && <Tooltip content={<CustomTooltip theme={theme} />} />}
                    <Line type="monotone" dataKey={yAxisKey} stroke={chartColors[yAxisKey]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: theme === 'dark' ? '#020617' : '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : activeChart === 'Bar' ? (
                  <BarChart data={currentData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />}
                    <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    {showTooltip && <Tooltip content={<CustomTooltip theme={theme} />} />}
                    <Bar dataKey={yAxisKey} fill={chartColors[yAxisKey]} radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={currentData}
                      dataKey={yAxisKey === 'anomalies' ? 'revenue' : yAxisKey} // Pie needs positive values
                      nameKey="month"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                    >
                      {currentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={[ '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'][index % 6]} />
                      ))}
                    </Pie>
                    {showTooltip && <Tooltip itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />}
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {/* WOW FEATURE: AI Justification for chart */}
            {recommendation && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <Info size={14} className="mt-0.5 text-indigo-500 shrink-0" />
                <p className="text-[10px] font-medium text-slate-500 leading-normal">
                  <span className="font-bold text-indigo-500">AI Note:</span> {recommendation.reason}
                </p>
              </div>
            )}
          </section>

            {/* Sidebar Context Panel */}
            <aside className="space-y-6">
               <div className={cn(
                 "rounded-2xl border p-5 transition-all",
                 theme === 'dark' ? "bg-slate-900 border-slate-800 shadow-slate-900" : "bg-white border-slate-200 shadow-slate-200/50"
               )}>
                  <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Node Allocation</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentData}
                          dataKey={yAxisKey === 'anomalies' ? 'revenue' : yAxisKey}
                          nameKey="month"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {currentData.map((_, index) => (
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
                        <Tooltip content={<CustomTooltip theme={theme} />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className={cn("rounded-lg p-2 text-center", theme === 'dark' ? "bg-slate-800" : "bg-slate-50")}>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Avg Health</p>
                      <p className="text-sm font-bold text-emerald-600">98.2%</p>
                    </div>
                    <div className={cn("rounded-lg p-2 text-center", theme === 'dark' ? "bg-slate-800" : "bg-slate-50")}>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Uptime</p>
                      <p className={cn("text-sm font-bold", theme === 'dark' ? "text-slate-100" : "text-slate-900")}>99.9h</p>
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
            <section className={cn(
              "lg:col-span-12 xl:col-span-7 rounded-2xl border transition-all overflow-hidden",
              theme === 'dark' ? "bg-slate-900 border-slate-800 shadow-slate-900" : "bg-white border-slate-200 shadow-slate-200/50"
            )}>
              <div className={cn("border-b px-6 py-4 flex items-center justify-between", theme === 'dark' ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white")}>
                 <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Execution Audit</h2>
                 <button className={cn(
                   "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors uppercase",
                   theme === 'dark' ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-50 text-indigo-600 hover:bg-indigo-50"
                 )}>
                  <Download size={12} />
                  Download CSV
                 </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className={cn("border-b", theme === 'dark' ? "border-slate-800 bg-slate-800/20" : "border-slate-100 bg-slate-50/50")}>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Node_ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Throughput</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Load</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Stability</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y text-[11px] font-mono", theme === 'dark' ? "divide-slate-800" : "divide-slate-50")}>
                    {filteredData.map((row, i) => (
                      <tr key={String(row.month) + i} className={cn("group transition-colors", theme === 'dark' ? "hover:bg-slate-800/30" : "hover:bg-slate-50/80")}>
                        <td className="px-6 py-4">
                          <code className={cn("text-[10px] rounded px-1 py-0.5 font-bold transition-colors", theme === 'dark' ? "bg-slate-800 text-slate-500 group-hover:text-indigo-400" : "bg-slate-100 text-slate-500 group-hover:text-indigo-600")}>NODE-{100 + i}</code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("font-bold", theme === 'dark' ? "text-slate-400" : "text-slate-900")}>{String(row.month).toUpperCase()} 24</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn("font-bold", theme === 'dark' ? "text-indigo-400" : "text-slate-800")}>${(Number(row.revenue)/1000).toFixed(1)}k</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-slate-500">{(Number(row.users)/10).toFixed(0)}%</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={cn(
                              "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[9px] font-bold uppercase",
                              Number(row.anomalies) > 2 ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                          )}>
                            {Number(row.anomalies) > 2 ? 'De-Stabilized' : 'Encrypted'}
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

function MetricCard({ metric, delay, theme }: { metric: any, delay: number, theme: string, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "relative overflow-hidden group p-6 border rounded-2xl shadow-sm transition-all cursor-help",
        theme === 'dark' 
          ? "bg-slate-900 border-slate-800 hover:border-indigo-500 shadow-slate-900" 
          : "bg-white border-slate-200 hover:border-indigo-200 shadow-slate-200/50"
      )}
    >
      {/* Tooltip Overlay */}
      <div className={cn(
        "absolute inset-x-4 top-14 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-95 group-hover:scale-100 origin-top",
        "rounded-xl border p-3 shadow-2xl backdrop-blur-xl",
        theme === 'dark' ? "bg-slate-900/90 border-slate-700 text-slate-300" : "bg-white/95 border-slate-200 text-slate-600"
      )}>
        <p className="text-[10px] font-medium leading-relaxed">
          {metric.description}
        </p>
      </div>

      <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Activity size={64} />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{metric.label}</span>
          <div className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
              metric.status === 'positive' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
          )}>
              {metric.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {Math.abs(metric.change)}%
          </div>
        </div>
        <div className={cn("text-3xl font-bold tracking-tighter font-mono", theme === 'dark' ? "text-white" : "text-slate-900")}>
          {metric.prefix}{metric.value.toLocaleString()}{metric.suffix}
        </div>
        <div className={cn("mt-6 flex items-center justify-between border-t pt-4", theme === 'dark' ? "border-slate-800" : "border-slate-50")}>
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

function IconButton({ icon, notification, onClick }: { icon: ReactNode, notification?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {icon}
      {notification && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900"></span>}
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

function CustomTooltip({ active, payload, label, theme }: any) {
  if (active && payload && payload.length) {
    return (
      <div className={cn(
        "rounded-xl border p-4 shadow-2xl backdrop-blur-md",
        theme === 'dark' ? "bg-slate-900/90 border-slate-700 shadow-black" : "bg-white/95 border-slate-200 shadow-slate-200/50"
      )}>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label} Analysis</p>
        <div className="space-y-2">
          {payload.map((entry: any, i: number) => (
            <div key={i} className={cn("flex items-center justify-between gap-8 py-1 border-b last:border-0", theme === 'dark' ? "border-slate-800" : "border-slate-50")}>
               <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">
                {entry.name}
               </span>
               <span className={cn("text-xs font-mono font-bold", theme === 'dark' ? "text-slate-100" : "text-slate-900")}>
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
