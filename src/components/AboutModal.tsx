import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Heart, Zap, Shield, BookOpen, Coffee, Github } from 'lucide-react';
export function AboutModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" title="About PracticeForge">
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background border-2 border-foreground shadow-illustrative max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-4xl text-primary text-center">About the Forge</DialogTitle>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <section className="text-center space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              PracticeForge AI is a pedagogical architect designed to turn raw curiosity into structured mastery. 
              We strike the iron of information to create actionable practice guides.
            </p>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="sketchy-card p-4 space-y-2 bg-white dark:bg-zinc-800">
              <h3 className="font-display text-xl text-secondary flex items-center gap-2">
                <Zap size={18} /> Features
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>8-Section Pedagogical Template</li>
                <li>Document Parsing (PDF/DOCX)</li>
                <li>OpenRouter BYOK Support</li>
                <li>Illustrative Export Formats</li>
              </ul>
            </div>
            <div className="sketchy-card p-4 space-y-2 bg-white dark:bg-zinc-800">
              <h3 className="font-display text-xl text-secondary flex items-center gap-2">
                <Shield size={18} /> Privacy
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Local API Key Storage</li>
                <li>No Persistent Data Tracking</li>
                <li>Open Source Engine</li>
                <li>Cloudflare Agent Security</li>
              </ul>
            </div>
          </div>
          <section className="space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <BookOpen size={20} className="text-primary" /> Quickstart Guide
            </h3>
            <div className="space-y-3 text-sm">
              <p><strong>1. Enter Specs:</strong> Input your topic and chapter on the left.</p>
              <p><strong>2. Add Context:</strong> Upload a PDF or DOCX if you have specific study material.</p>
              <p><strong>3. Forge:</strong> Click the Forge button to generate your structured guide.</p>
              <p><strong>4. Export:</strong> Download as Markdown or HTML for offline practice.</p>
            </div>
          </section>
          <section className="space-y-4 border-t-2 border-dashed border-muted pt-6">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Heart size={20} className="text-red-500" /> Support the Forge
            </h3>
            <p className="text-sm text-muted-foreground">
              If PracticeForge has helped your learning journey, consider stoking the fire with a donation to keep the anvil hot!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="gap-2 border-2 border-foreground hover:bg-pink-50">
                <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer">
                  <Coffee size={16} className="text-[#FF5E5B]" /> Buy me a Coffee
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-2 border-foreground hover:bg-zinc-50">
                <a href="https://github.com/sponsors" target="_blank" rel="noopener noreferrer">
                  <Github size={16} /> GitHub Sponsors
                </a>
              </Button>
            </div>
          </section>
        </div>
        <div className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest pt-4">
          Mastery is a practice, not a destination.
        </div>
      </DialogContent>
    </Dialog>
  );
}