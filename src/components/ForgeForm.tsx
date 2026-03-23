import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Hammer, Sparkles } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
interface ForgeFormProps {
  topic: string;
  setTopic: (v: string) => void;
  chapter: string;
  setChapter: (v: string) => void;
  level: string;
  setLevel: (v: string) => void;
  onForge: () => void;
  isGenerating: boolean;
}
export function ForgeForm({
  topic, setTopic,
  chapter, setChapter,
  level, setLevel,
  onForge,
  isGenerating
}: ForgeFormProps) {
  return (
    <div className="sketchy-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-secondary flex items-center gap-2">
          <Hammer className="h-6 w-6" /> Forge Specs
        </h2>
        <SettingsModal />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic" className="font-bold">Subject / Topic</Label>
          <Input
            id="topic"
            placeholder="e.g. Quantum Physics, Cooking"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border-2 border-muted focus:border-primary rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chapter" className="font-bold">Specific Chapter / Skill</Label>
          <Input
            id="chapter"
            placeholder="e.g. Entanglement, Sautéing"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="border-2 border-muted focus:border-primary rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level" className="font-bold">Skill Level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="border-2 border-muted rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner (Foundations)</SelectItem>
              <SelectItem value="Intermediate">Intermediate (Application)</SelectItem>
              <SelectItem value="Advanced">Advanced (Mastery)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={onForge}
        disabled={isGenerating || !topic || !chapter}
        className="w-full illustrative-button bg-primary text-white h-12 text-lg gap-2"
      >
        {isGenerating ? (
          <Sparkles className="animate-spin" />
        ) : (
          <Hammer />
        )}
        {isGenerating ? 'Forging...' : 'Forge Guide'}
      </Button>
      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
        Caution: AI generated metal. Handle with care.
      </p>
    </div>
  );
}