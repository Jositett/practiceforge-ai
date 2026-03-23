import React, { useState } from 'react';
import { ForgeForm } from '@/components/ForgeForm';
import { GuideViewer, Hammer, Sparkles } from '@/components/GuideViewer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buildPedagogicalPrompt } from '@/lib/prompt-builder';
import { generateGuide } from '@/lib/generation-service';
import { AlertCircle, Quote } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import confetti from 'canvas-confetti';
export function HomePage() {
  const [topic, setTopic] = useState('');
  const [chapter, setChapter] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const handleForge = async () => {
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
      console.error(error);
      toast.error('The furnace went cold. Failed to forge guide.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleFileParsed = (text: string, name: string | null) => {
    setDocumentText(text);
    setFileName(name);
  };
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 transition-colors duration-500">
      <Toaster richColors position="top-center" />
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <header className="mb-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-illustrative rotate-3 border-2 border-foreground shrink-0 transition-transform hover:rotate-6">
              <Hammer className="text-white w-10 h-10 -rotate-12" size={40} />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl md:text-7xl font-display text-foreground tracking-tight">
                Practice<span className="text-primary">Forge</span> AI
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                Turning raw curiosity into structured mastery through illustrative practice guides.
              </p>
            </div>
          </header>
          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Sidebar Form */}
            <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
              <ForgeForm
                topic={topic}
                setTopic={setTopic}
                chapter={chapter}
                setChapter={setChapter}
                level={level}
                setLevel={setLevel}
                onForge={handleForge}
                isGenerating={isGenerating}
                onFileParsed={handleFileParsed}
                fileName={fileName}
              />
              {documentText && (
                <div className="sketchy-card bg-primary/5 p-4 border-dashed border-2 animate-in slide-in-from-left duration-500">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Quote size={12} className="fill-current" /> Source Material Active
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 italic leading-relaxed">
                    "{documentText.slice(0, 300)}..."
                  </p>
                </div>
              )}
              <div className="p-5 border-2 border-dashed border-muted rounded-2xl bg-muted/10 space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <AlertCircle size={16} className="text-primary" /> Note on Generation
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  PracticeForge leverages advanced LLMs to generate pedagogical content. 
                  Across all user apps, shared limits apply. For guaranteed high-speed forging, 
                  please configure an <strong>OpenRouter API key</strong> in settings.
                </p>
              </div>
            </aside>
            {/* Main Content Viewer */}
            <main className="flex-1 w-full min-h-[600px] lg:h-[calc(100vh-200px)] flex flex-col">
              {isGenerating && !streamContent ? (
                <div className="sketchy-card h-full flex flex-col items-center justify-center space-y-6 py-32 bg-white/50">
                  <div className="relative">
                    <Hammer className="w-20 h-20 text-primary animate-bounce" size={80} />
                    <Sparkles className="w-10 h-10 text-secondary absolute -top-6 -right-6 animate-pulse" size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-display text-4xl text-foreground">Sharpening pencils...</h3>
                    <p className="text-muted-foreground font-medium">Gathering pedagogical insights from the ether.</p>
                  </div>
                </div>
              ) : (
                <GuideViewer content={streamContent} isGenerating={isGenerating} />
              )}
            </main>
          </div>
        </div>
      </div>
      <footer className="py-12 border-t border-muted bg-background/80 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} PracticeForge AI — Forged with Cloudflare Agents</p>
          <div className="flex gap-6">
            <span className="hover:text-primary transition-colors cursor-help">Pedagogical Framework v1.2</span>
            <span className="hover:text-primary transition-colors cursor-help">Open Source Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}