import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";

interface PathStep {
  id: number;
  role: string;
  date: string;
  salary: string;
  status: string;
  focus: string;
}

interface Pivot {
  role: string;
  reason: string;
  fit: number;
  color: string;
}

export function CareerTrajectory() {
  const [pathSteps, setPathSteps] = useState<PathStep[]>([]);
  const [pivots, setPivots] = useState<Pivot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("user_profile");
    if (!profile) {
      setError("Please upload your resume to generate a personalized trajectory.");
      setLoading(false);
      return;
    }

    fetch("/api/analyze-career", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        profile: JSON.parse(profile),
        preferences: {} 
      })
    })
      .then(res => res.json())
      .then(data => {
        setPathSteps(data.pathSteps);
        setPivots(data.adjacentPivots);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to generate career projection.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-500 text-sm uppercase tracking-[0.2em] animate-pulse">Running Neural Simulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-8">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-slate-200 max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] italic">Predictive Roadmap</h3>
        <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic tracking-[0.1em]">Trajectory Projection</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-xs leading-relaxed">
          AI-driven predictive roadmap for your career based on market hiring velocity, current skills, and adjacent growth patterns.
        </p>
      </div>

      <div className="relative pt-12 pb-24">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block" />

        <div className="space-y-24">
          {pathSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Content Card */}
              <div className="flex-1 w-full max-w-md">
                <Card className={`bg-white/5 border-white/5 p-8 rounded-[32px] relative overflow-hidden group hover:bg-white/[0.07] transition-all border ${step.status === 'active' ? 'ring-1 ring-blue-500/30' : ''}`}>
                   {step.status === 'active' && (
                     <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                   )}
                   <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{step.date}</span>
                        <div className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                           <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                           {step.salary}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight italic">{step.role}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "{step.focus}"
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <span className="text-[9px] font-bold bg-white/5 border border-white/10 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter">Strategic Ops</span>
                        <span className="text-[9px] font-bold bg-white/5 border border-white/10 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter">Systems Thinking</span>
                      </div>
                   </div>
                </Card>
              </div>

              {/* Center Dot */}
              <div className="relative z-10 w-10 h-10 bg-[#0A0A0C] border-2 border-white/10 rounded-full flex items-center justify-center shrink-0">
                 <div className={`w-2.5 h-2.5 rounded-full ${
                   step.status === 'active' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                   step.status === 'next' ? 'bg-blue-400' : 'bg-slate-800'
                 }`} />
              </div>

              {/* Info Spreader */}
              <div className="flex-1 hidden md:block px-6">
                <div className={`bg-white/5 p-4 rounded-2xl border border-white/5 text-[10px] text-slate-500 italic ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                   Expected market velocity: <span className="text-white font-bold">High</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Adjacent Pivots */}
      <div className="pt-12 border-t border-white/5 space-y-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 italic">Adjacent Career Pivots</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pivots.map(p => (
            <div key={p.role} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all cursor-pointer group border shadow-sm">
               <div className="flex justify-between items-start mb-3">
                 <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">{p.role}</h4>
                 <span className={`text-[10px] font-black ${p.color || 'text-blue-400'}`}>{p.fit}% Fit</span>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
