import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock,
  Sparkles,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion } from "motion/react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchScore: number;
  postedAt: string;
  description: string;
}

export function JobFeed() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = localStorage.getItem("user_profile");
    
    fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        profile: profile ? JSON.parse(profile) : null 
      })
    })
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 italic">Neural Match Feed</h3>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 underline underline-offset-8 decoration-white/10">Active Opportunities</h1>
        </div>
        <Button variant="outline" className="border-white/10 bg-white/5 text-slate-400 hover:text-white rounded-lg px-4 h-9 text-xs">
          <Filter className="w-3 h-3 mr-2" />
          Refine Search
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white/5 border-white/5 hover:border-white/10 transition-all rounded-xl overflow-hidden group border">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Main Info */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                             {job.company[0]}
                           </div>
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                               <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{job.title}</h3>
                               <span className="text-xs text-slate-500 underline decoration-slate-700 underline-offset-4">{job.company}</span>
                             </div>
                             <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                               <div className="flex items-center">
                                 <MapPin className="w-3 h-3 mr-1 opacity-50" />
                                 {job.location}
                               </div>
                               <div className="flex items-center">
                                 <DollarSign className="w-3 h-3 mr-1 opacity-50 text-emerald-500" />
                                 {job.salary}
                               </div>
                               <div className="flex items-center">
                                 <Clock className="w-3 h-3 mr-1 opacity-50" />
                                 {new Date(job.postedAt).toLocaleDateString()}
                               </div>
                             </div>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-emerald-400 leading-none">{job.matchScore}%</div>
                          <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">AI Compatibility</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                         <div className="flex gap-2">
                           <Badge className="bg-emerald-500/10 text-emerald-400 border-none rounded text-[10px] font-bold uppercase tracking-tighter">Verified Hiring</Badge>
                           <Badge className="bg-blue-500/10 text-blue-400 border-none rounded text-[10px] font-bold uppercase tracking-tighter">Fast Response</Badge>
                         </div>
                         <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold px-6 h-8">
                           Apply Now
                         </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
