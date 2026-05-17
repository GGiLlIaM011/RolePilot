import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from "motion/react";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export function Overview() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 italic">Performance Analytics</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Job Matches", value: "12", icon: Target, trend: "+98%", color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Applications", value: "8", icon: Zap, trend: "+2", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Resume Score", value: "94", icon: Users, trend: "+4%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Market Growth", value: "+34%", icon: TrendingUp, trend: "Peak", color: "text-blue-400", bg: "bg-blue-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/5 hover:border-white/10 transition-all rounded-xl border">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {stat.trend} <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Insights Chart */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Career Trajectory Growth</h3>
            <button className="text-xs text-blue-400 font-medium hover:underline tracking-tighter">View Detailed Analytics</button>
          </div>
          <Card className="bg-white/5 border-white/5 rounded-2xl overflow-hidden flex flex-col p-6 h-[400px]">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D0D10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Top Matches */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Priority Matches</h3>
          <div className="space-y-3">
            {[
              { name: "Google", industry: "Senior Product Designer", match: 98, color: "text-emerald-400" },
              { name: "Stripe", industry: "Staff Growth Engineer", match: 92, color: "text-blue-400" },
              { name: "Linear", industry: "Founding Designer", match: 89, color: "text-purple-400" },
            ].map((company) => (
              <div key={company.name} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all shadow-sm">
                <div className="flex items-center space-x-4 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-black shrink-0 border border-white/5 flex items-center justify-center font-bold text-slate-200">
                    {company.name[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-sm truncate">{company.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">{company.industry}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`text-lg font-bold ${company.color}`}>{company.match}%</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Match</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
