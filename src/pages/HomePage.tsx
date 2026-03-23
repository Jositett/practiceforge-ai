import React, { useState } from 'react';
import { ForgeForm } from '@/components/ForgeForm';
import { GuideViewer } from '@/components/GuideViewer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buildPedagogicalPrompt } from '@/lib/prompt-builder';
import { generateGuide } from '@/lib/generation-service';
import { Hammer, Sparkles, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import confetti from 'canvas-confetti';
export function HomePage() {
  const [topic, setTopic] = useState('');
  const [chapter, setChapter] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const handleForge = async () => {
    if (!topic || !chapter) return;
    setIsGenerating(true);
    setStreamContent('');
    const prompt = buildPedagogicalPrompt(topic, chapter, level);
    try {
      await generateGuide(prompt, (chunk) => {
        setStreamContent(prev => prev + chunk);
      });
      confetti({
        particleCount: 100,
        spread: 70,
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
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Toaster richColors />
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <header className="mb-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-illustrative rotate-3 border-2 border-foreground shrink-0">
              <Hammer className="text-white w-10 h-10 -rotate-12" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-display text-foreground tracking-tight">
                Practice<span className="text-primary">Forge</span> AI
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Turning raw curiosity into structured mastery through illustrative practice guides.
              </p>
            </div>
          </header>
          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Form */}
            <aside className="w-full lg:w-96 flex-shrink-0">
              <div className="sticky top-12">
                <ForgeForm
                  topic={topic}
                  setTopic={setTopic}
                  chapter={chapter}
                  setChapter={setChapter}
                  level={level}
                  setLevel={setLevel}
                  onForge={handleForge}
                  isGenerating={isGenerating}
                />
                <div className="mt-8 p-4 border-2 border-dashed border-muted rounded-xl bg-muted/10">
                  <h4 className="flex items-center gap-2 font-bold text-sm mb-2">
                    <AlertCircle size={14} className="text-primary" /> Note on Generation
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Although this project has AI capabilities, there is a limit on the number of requests that can be made to the AI servers across all user apps in a given time period. For best results, configure an OpenRouter API key in settings.
                  </p>
                </div>
              </div>
            </aside>
            {/* Main Content Viewer */}
            <main className="flex-1 min-h-[600px] lg:min-h-[auto]">
              {isGenerating && !streamContent ? (
                <div className="sketchy-card h-full flex flex-col items-center justify-center space-y-4 py-32">
                  <div className="relative">
                    <Hammer className="w-16 h-16 text-primary animate-bounce" />
                    <Sparkles className="w-8 h-8 text-secondary absolute -top-4 -right-4 animate-pulse" />
                  </div>
                  <h3 className="font-display text-3xl">Sharpening pencils...</h3>
                  <p className="text-muted-foreground">Gathering pedagogical insights from the ether.</p>
                </div>
              ) : (
                <GuideViewer content={streamContent} isGenerating={isGenerating} />
              )}
            </main>
          </div>
        </div>
      </div>
      <footer className="py-12 border-t border-muted bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} PracticeForge AI — Forged with Cloudflare Agents</p>
        </div>
      </footer>
    </div>
  );
}