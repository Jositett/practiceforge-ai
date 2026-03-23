import React, { useState, useEffect } from 'react';
import { ForgeForm } from '@/components/ForgeForm';
import { GuideViewer, Hammer, Sparkles } from '@/components/GuideViewer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/AuthModal';
import { AboutModal } from '@/components/AboutModal';
import { buildPedagogicalPrompt } from '@/lib/prompt-builder';
import { generateGuide } from '@/lib/generation-service';
import { authService } from '@/lib/auth-service';
import { AlertCircle, Quote, LogOut, User, Heart, Github, Coffee } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const [topic, setTopic] = useState('');
  const [chapter, setChapter] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
    };
    checkAuth();
  }, []);
  const handleForge = async () => {
    // Fresh check for user state
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      toast.info('Please log in to forge guides');
      return;
    }
    if (!topic || !chapter) return;
    setIsGenerating(true);
    setStreamContent('');
    const prompt = buildPedagogicalPrompt(topic, chapter, level, documentText);
    try {
      await generateGuide(prompt, (chunk) => {
        setStreamContent(prev => prev + chunk);
      });
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F38020', '#764ba2', '#ffffff']
      });
      toast.success('Guide successfully forged!');
    } catch (error) {
      toast.error('The furnace went cold.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 transition-colors duration-500 overflow-x-hidden">
      <Toaster richColors position="top-center" />
      <ThemeToggle />
      <div className="fixed top-4 right-16 z-50"><AboutModal /></div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => {
        setIsAuthModalOpen(false);
        authService.getCurrentUser().then(setUser);
      }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <header className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-illustrative rotate-3 border-2 border-foreground shrink-0 transition-transform hover:rotate-6">
                <Hammer className="text-white w-10 h-10 -rotate-12" size={40} />
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl md:text-7xl font-display text-foreground tracking-tight">
                  Practice<span className="text-primary">Forge</span> AI
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                  Turning raw curiosity into structured mastery.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 sketchy-border px-4 py-2 bg-muted/20">
                  <User size={18} className="text-primary" />
                  <span className="text-sm font-bold truncate max-w-[120px]">{user.email}</span>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <LogOut size={16} />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)} className="illustrative-button bg-secondary text-white gap-2">
                  <User size={18} /> Sign In
                </Button>
              )}
            </div>
          </header>
          {/* Main Layout */}
          <div className={`flex flex-col lg:flex-row gap-10 items-start ${isGenerating ? 'max-md:items-center' : ''}`}>
            <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
              <ForgeForm
                topic={topic} setTopic={setTopic}
                chapter={chapter} setChapter={setChapter}
                level={level} setLevel={setLevel}
                onForge={handleForge}
                isGenerating={isGenerating}
                onFileParsed={(text, name) => { setDocumentText(text); setFileName(name); }}
                fileName={fileName}
              />
              {documentText && (
                <div className="sketchy-card bg-primary/5 p-4 border-dashed border-2">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Quote size={12} className="fill-current" /> Source Material Active
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 italic">
                    "{documentText.slice(0, 200)}..."
                  </p>
                </div>
              )}
              <div className="p-5 border-2 border-dashed border-muted rounded-2xl bg-muted/10 space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <AlertCircle size={16} className="text-primary" /> Forging Limits
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {user ? "You have premium forging active." : "Sign in to save guides and bypass standard limits."}
                </p>
              </div>
            </aside>
            <main className={`flex-1 w-full min-h-[600px] lg:h-[calc(100vh-200px)] flex flex-col transition-all duration-500 ${isGenerating && !streamContent ? 'opacity-90 scale-[0.99]' : 'opacity-100 scale-100'}`}>
              {isGenerating && !streamContent ? (
                <div className="sketchy-card h-full flex flex-col items-center justify-center space-y-6 py-32 bg-white/50">
                  <div className="relative forging-animation">
                    <Hammer className="w-20 h-20 text-primary animate-bounce" size={80} />
                    <Sparkles className="w-10 h-10 text-secondary absolute -top-6 -right-6 animate-pulse" size={40} />
                  </div>
                  <h3 className="font-display text-4xl">Sharpening pencils...</h3>
                </div>
              ) : (
                <GuideViewer content={streamContent} isGenerating={isGenerating} />
              )}
            </main>
          </div>
        </div>
      </div>
      <footer className="py-12 border-t border-muted bg-muted/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h4 className="font-display text-xl text-primary">PracticeForge AI</h4>
            <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wider font-bold">
              Built on the principles of structured pedagogy and the spirit of open curiosity.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-xl text-secondary">Support the Forge</h4>
            <div className="flex gap-4">
              <a href="https://github.com/sponsors" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={20} /></a>
              <a href="https://ko-fi.com" className="text-muted-foreground hover:text-foreground transition-colors"><Coffee size={20} /></a>
              <span className="text-muted-foreground"><Heart size={20} className="fill-red-500 text-red-500" /></span>
            </div>
          </div>
          <div className="flex flex-col justify-end text-xs text-muted-foreground font-bold uppercase tracking-widest gap-2">
            <p>© {new Date().getFullYear()} PracticeForge AI</p>
            <p>Powered by Cloudflare Agents</p>
            {user && <p>Active Artisan: {user.email}</p>}
          </div>
        </div>
      </footer>
    </div>
  );
}