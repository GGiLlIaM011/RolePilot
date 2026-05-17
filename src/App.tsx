/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, signInWithGoogle } from "./lib/firebase";
import { Layout } from "./components/layout/Layout";
import { Overview } from "./components/dashboard/Overview";
import { JobFeed } from "./components/dashboard/JobFeed";
import { ResumeAnalysis } from "./components/dashboard/ResumeAnalysis";
import { CareerTrajectory } from "./components/dashboard/CareerTrajectory";
import { Copilot } from "./components/chat/Copilot";
import { Button } from "./components/ui/button";
import { LogIn, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white"
        >
          <Rocket className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center p-6 text-slate-200 selection:bg-blue-500/30 overflow-hidden relative">
        {/* Abstract Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12 relative z-10 text-center"
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tight italic uppercase">RolePilot</h1>
              <p className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-bold">Neural Career Architect</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto italic opacity-80">
              "Your professional trajectory, decrypted by silicon intelligence."
            </p>
            
            <div className="pt-4">
              <Button 
                onClick={signInWithGoogle}
                className="w-full bg-white text-black hover:bg-slate-200 h-14 rounded-xl text-sm font-bold flex items-center justify-center gap-3 shadow-2xl transition-all group active:scale-95"
              >
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white">G</span>
                </div>
                Establish Connection
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
              </Button>
              <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest font-black leading-none">
                Secured by Enterprise Mesh
              </p>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 opacity-20 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
           <span>Extraction</span>
           <span>Mapping</span>
           <span>Projection</span>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === "overview" && <Overview />}
          {activeTab === "jobs" && <JobFeed />}
          {activeTab === "resume" && <ResumeAnalysis />}
          {activeTab === "trajectory" && <CareerTrajectory />}
        </motion.div>
      </AnimatePresence>
      <Copilot user={user} />
    </Layout>
  );
}
