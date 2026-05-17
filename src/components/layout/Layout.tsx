import { ReactNode } from "react";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  LogOut,
  Rocket
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

export function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Job Matches", icon: Briefcase, extra: "12" },
    { id: "resume", label: "Resume Intelligence", icon: FileText },
    { id: "trajectory", label: "Career Path", icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0C] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Navigation Sidebar */}
      <aside className="w-60 border-r border-white/5 flex flex-col p-5 bg-[#0D0D10]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45 shrink-0"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RolePilot</span>
        </div>
        
        <nav className="flex-1 space-y-1 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                activeTab === item.id 
                  ? "bg-white/5 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 opacity-70 group-hover:opacity-100",
                activeTab === item.id ? "opacity-100" : ""
              )} />
              {item.label}
              {item.extra && (
                <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 rounded-full ring-1 ring-blue-500/20">
                  {item.extra}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-white/10 mb-6">
            <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest mb-2 font-bold">Resume Strength</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white leading-none">94</span>
              <span className="text-blue-300/40 mb-1 font-mono text-xs italic">/100</span>
            </div>
            <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
              <div className="w-[94%] bg-blue-500 h-full"></div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/5 flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shrink-0 overflow-hidden">
               <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.displayName || user.email}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">VIP Architect</p>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[#0A0A0C]">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-white">Welcome back, {user.displayName?.split(" ")[0]}</h2>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/20">
              Actively Hiring
            </span>
          </div>
          <div className="flex items-center gap-6 text-xl">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-0.5 -right-0.5 border border-[#0A0A0C]"></div>
              <span className="cursor-pointer opacity-70 hover:opacity-100 italic">🔔</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-blue-500 italic">
              PRO
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#0A0A0C]">
          {children}
        </div>
      </main>
    </div>
  );
}
