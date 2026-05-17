import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileUp, 
  CheckCircle2, 
  Search, 
  Brain,
  Upload,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface ParsedData {
  fullName: string;
  summary: string;
  skills: string[];
  workHistory: any[];
  education: any[];
}

export function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Cloud connection unstable: ${responseText.slice(0, 50)}`);
      }

      if (!res.ok) throw new Error(data.error || "Neural scan failed");
      
      setResults(data);
      localStorage.setItem("user_profile", JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 italic text-center">Neural Extraction Engine</h3>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2 text-center">Resume Intelligence</h1>
      </div>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-white/5 border-white/10 border-dashed border-2 rounded-2xl p-12 text-center cursor-pointer hover:bg-white/[0.07] transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <input
                type="file"
                className="hidden"
                id="resume-upload"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="cursor-pointer space-y-6 block relative z-10">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{file ? file.name : "Inject Career Data"}</h3>
                  <p className="text-slate-500 mt-2 text-[10px] uppercase font-bold tracking-widest">Supported formats: PDF, DOCX (Max 5MB)</p>
                </div>
              </label>

              {file && !analyzing && (
                <Button 
                  onClick={handleUpload}
                  className="mt-8 bg-white text-black hover:bg-slate-200 rounded-xl px-12 py-6 text-sm font-bold shadow-2xl relative z-10"
                >
                  Initiate AI Scan
                </Button>
              )}

              {analyzing && (
                <div className="mt-8 space-y-4 relative z-10">
                  <div className="flex items-center justify-center space-x-3 text-blue-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold text-sm uppercase tracking-widest italic">Gemini is processing experience graph...</span>
                  </div>
                  <div className="max-w-xs mx-auto h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 flex items-center justify-center text-red-400 text-[10px] space-x-2 uppercase font-black tracking-[0.2em] relative z-10">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <Card className="bg-white/5 border-white/5 rounded-2xl overflow-hidden border">
               <div className="bg-emerald-500/10 border-b border-white/5 p-4 flex items-center justify-between">
                 <div className="flex items-center text-emerald-400 space-x-2">
                   <CheckCircle2 className="w-4 h-4" />
                   <span className="font-bold text-[10px] uppercase tracking-widest">Neural Scan Success</span>
                 </div>
                 <Button variant="ghost" className="text-[10px] uppercase font-bold text-slate-500 hover:text-white" onClick={() => setResults(null)}>
                   Reset
                 </Button>
               </div>
               <CardContent className="p-8 space-y-6">
                 <div>
                   <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{results.fullName}</h2>
                   <p className="text-slate-400 leading-relaxed text-sm bg-black/30 p-4 rounded-xl border border-white/5 border-l-4 border-l-blue-500 italic">
                    "{results.summary}"
                   </p>
                 </div>

                 <div className="space-y-3">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                     <Brain className="w-3 h-3 mr-2 text-blue-400" />
                     Extracted Competencies
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {results.skills.map(skill => (
                       <Badge key={skill} className="bg-white/5 border-white/10 text-slate-300 py-1 px-3 rounded-lg hover:bg-white/10 transition-colors uppercase text-[9px] font-bold">
                         {skill}
                       </Badge>
                     ))}
                   </div>
                 </div>
               </CardContent>
            </Card>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Experience Graph</h3>
                <Card className="bg-white/5 border-white/5 rounded-2xl border">
                  <CardContent className="p-6 space-y-6">
                    {results.workHistory.map((job, i) => (
                      <div key={i} className="space-y-1 relative pl-5 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-white/10 group">
                        <div className="absolute left-[-4px] top-[6px] w-2 h-2 rounded-full border-2 border-white/20 bg-[#0A0A0C] group-hover:border-blue-500 transition-colors" />
                        <p className="text-white font-bold text-sm tracking-tight">{job.title}</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{job.company} • {job.dates}</p>
                        <ul className="text-[10px] text-slate-500 space-y-1 mt-2">
                          {job.achievements?.slice(0, 2).map((a: string, j: number) => (
                            <li key={j} className="line-clamp-1 opacity-70">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Institutional Baseline</h3>
                <Card className="bg-white/5 border-white/5 rounded-2xl border">
                  <CardContent className="p-6 space-y-6">
                     {results.education.map((edu, i) => (
                      <div key={i} className="space-y-1 group">
                        <p className="text-white font-bold text-sm tracking-tight group-hover:text-emerald-400 transition-colors">{edu.degree}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{edu.institution}</p>
                        <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase">{edu.year}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
