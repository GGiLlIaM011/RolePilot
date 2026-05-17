import { useState, useRef, useEffect } from "react";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  X, 
  Send, 
  MessageSquare,
  Bot,
  User as UserIcon,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Copilot({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Based on your background at Adobe, you're in the top 2% of applicants for the Google role. Would you like me to generate a tailored cover letter?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const profile = localStorage.getItem("user_profile");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: { 
            email: user.email, 
            name: user.displayName,
            profile: profile ? JSON.parse(profile) : null
          }
        })
      });

      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 group border border-white/10"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0C] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[380px] h-[600px] flex flex-col z-50"
          >
            <Card className="bg-[#16161D] border-white/10 rounded-[28px] overflow-hidden flex-1 flex flex-col shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
              <CardHeader className="bg-white/[0.02] p-5 flex flex-row items-center justify-between border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Career Copilot</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </CardHeader>

              <CardContent className="flex-1 overflow-auto p-0 scrollbar-hide" ref={scrollRef}>
                <div className="p-6 space-y-5">
                   {messages.map((m, i) => (
                     <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] shadow-lg shadow-blue-600/20">🤖</div>
                        )}
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed tracking-tight ${
                          m.role === 'user' 
                            ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none' 
                            : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5 shadow-sm'
                        }`}>
                           {m.content}
                        </div>
                     </div>
                   ))}
                   {isTyping && (
                     <div className="flex justify-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] opacity-50">🤖</div>
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex space-x-1 items-center">
                           <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                           <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                           <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                        </div>
                     </div>
                   )}
                </div>
              </CardContent>

              <div className="p-5 bg-white/[0.02] border-t border-white/5 space-y-4">
                <div className="flex gap-2">
                   <button className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400 hover:text-white uppercase tracking-tighter">Interview Prep</button>
                   <button className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400 hover:text-white uppercase tracking-tighter">Salary Negotiation</button>
                </div>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask your copilot anything..."
                    className="bg-black/40 border-white/10 rounded-xl h-11 pl-4 pr-12 text-xs text-white focus-visible:ring-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1.5 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[8px] text-slate-600 text-center uppercase tracking-widest font-black">
                  Neural Core Engine
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
