import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dog, 
  Cat, 
  Bird, 
  Bug, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Heart,
  Zap,
  Moon,
  Shield,
  Palette,
  Leaf,
  History,
  Star,
  MessageSquare,
  Wand2,
  Send,
  User,
  Bot,
  PawPrint
} from 'lucide-react';
import { suggestPetNames, createPetNamingChat } from './services/gemini';
import { PetNameSuggestion, NamingRequest, ChatMessage } from './types';
import Markdown from 'react-markdown';

const PET_TYPES = [
  { id: 'dog', label: 'Dog', icon: Dog, color: 'bg-orange-100 text-orange-600' },
  { id: 'cat', label: 'Cat', icon: Cat, color: 'bg-blue-100 text-blue-600' },
  { id: 'bird', label: 'Bird', icon: Bird, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'reptile', label: 'Reptile', icon: Bug, color: 'bg-green-100 text-green-600' },
  { id: 'other', label: 'Other', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
];

const THEMES = [
  { id: 'mythological', label: 'Mythological', icon: Shield },
  { id: 'food', label: 'Food-based', icon: Heart },
  { id: 'classic', label: 'Classic', icon: History },
  { id: 'nature', label: 'Nature', icon: Leaf },
  { id: 'space', label: 'Space', icon: Moon },
  { id: 'artistic', label: 'Artistic', icon: Palette },
];

export default function App() {
  const [mode, setMode] = useState<'wizard' | 'chat'>('wizard');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NamingRequest>({
    petType: '',
    temperament: '',
    theme: '',
  });
  const [results, setResults] = useState<PetNameSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSuggest = async () => {
    if (!formData.petType || !formData.temperament || !formData.theme) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await suggestPetNames(formData);
      setResults(response.names);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!userInput.trim() || loading) return;

    const message = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setLoading(true);

    try {
      if (!chatInstance.current) {
        chatInstance.current = createPetNamingChat();
      }

      const response = await chatInstance.current.sendMessage({ message });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "I couldn't generate a response." }]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setFormData({ petType: '', temperament: '', theme: '' });
    setResults([]);
    setError(null);
    setChatMessages([]);
    chatInstance.current = null;
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center p-4 md:p-8">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <header className="mb-8 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4"
        >
          <PawPrint className="w-8 h-8 text-orange-500" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-2">
          The Naming Nook
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto italic">
          Every pet is a story waiting for its perfect title. Step into our cozy corner and discover the name they were always meant to have.
        </p>
      </header>

      {/* Mode Toggle */}
      <div className="flex bg-zinc-200/50 p-1 rounded-2xl mb-8 relative z-10">
        <button
          onClick={() => { setMode('wizard'); reset(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
            mode === 'wizard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          Wizard
        </button>
        <button
          onClick={() => { setMode('chat'); reset(); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
            mode === 'chat' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
      </div>

      <main className="w-full max-w-2xl relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'wizard' ? (
            <motion.div key="wizard-container" className="w-full">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-sm">1</span>
                    What kind of pet?
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {PET_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFormData({ ...formData, petType: type.id });
                          setStep(2);
                        }}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200 group ${
                          formData.petType === type.id 
                            ? 'bg-zinc-900 text-white shadow-xl scale-105' 
                            : 'bg-white hover:bg-zinc-50 border border-zinc-200'
                        }`}
                      >
                        <type.icon className={`w-8 h-8 mb-3 ${formData.petType === type.id ? 'text-white' : type.color.split(' ')[1]}`} />
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-sm">2</span>
                    Describe their personality
                  </h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        autoFocus
                        value={formData.temperament}
                        onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                        placeholder="e.g. Energetic, lazy, affectionate, stubborn, clumsy..."
                        className="w-full h-32 p-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-zinc-400">
                        Be as descriptive as you like
                      </div>
                    </div>
                    <button
                      disabled={!formData.temperament.trim()}
                      onClick={() => setStep(3)}
                      className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="glass-card rounded-3xl p-8"
                >
                  <button 
                    onClick={() => setStep(2)}
                    className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-sm">3</span>
                    Choose a naming theme
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setFormData({ ...formData, theme: theme.label })}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          formData.theme === theme.label
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg'
                            : 'bg-white border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <theme.icon className={`w-5 h-5 ${formData.theme === theme.label ? 'text-white' : 'text-zinc-400'}`} />
                        <span className="font-medium text-sm">{theme.label}</span>
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading || !formData.theme}
                    onClick={handleSuggest}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating Names...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current" />
                        Get Suggestions
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="results"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-zinc-900">Top Suggestions</h2>
                    <button 
                      onClick={reset}
                      className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" /> Start Over
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {results.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </h3>
                              <Star className="w-4 h-4 text-yellow-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-zinc-600 leading-relaxed">
                              {item.reason}
                            </p>
                          </div>
                          <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                            <Heart className="w-5 h-5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-6 bg-zinc-900 rounded-3xl text-white flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm mb-1 uppercase tracking-widest font-semibold">Pet Profile</p>
                      <p className="font-medium capitalize">{formData.petType} • {formData.theme}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                          <Heart className="w-3 h-3 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="chat-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col glass-card rounded-3xl overflow-hidden h-[600px]"
            >
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Step Into the Nook</h3>
                    <p className="text-zinc-500 text-sm max-w-xs italic">
                      Every companion has a story waiting to be told. Share a few chapters about your friend, and let's discover the name that completes their tale.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-sm">
                      {[
                        "I want to name my parrot, who is very talkative and playful, and I want Hindu mythological names.",
                        "I have a lazy orange cat and want food-based names.",
                        "Suggest some classic names for a loyal German Shepherd."
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setUserInput(suggestion)}
                          className="text-left p-3 text-xs bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-colors text-zinc-600"
                        >
                          "{suggestion}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-zinc-900' : 'bg-orange-100'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-zinc-900 text-white rounded-tr-none' 
                          : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                      }`}>
                        <div className="markdown-body text-sm leading-relaxed">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white border-t border-zinc-100">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleChatSend(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your request..."
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!userInput.trim() || loading}
                    className="bg-zinc-900 text-white p-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-zinc-400 text-sm relative z-10">
        Powered by Gemini AI • Crafted with love in The Naming Nook
      </footer>
    </div>
  );
}

