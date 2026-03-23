import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Hammer, Sparkles, FileUp, X, FileText, Loader2 } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { extractTextFromFile } from '@/lib/file-parser';
import { toast } from 'sonner';
interface ForgeFormProps {
  topic: string;
  setTopic: (v: string) => void;
  chapter: string;
  setChapter: (v: string) => void;
  level: string;
  setLevel: (v: string) => void;
  onForge: () => void;
  isGenerating: boolean;
  onFileParsed: (text: string, fileName: string | null) => void;
  fileName: string | null;
}
export function ForgeForm({
  topic, setTopic,
  chapter, setChapter,
  level, setLevel,
  onForge,
  isGenerating,
  onFileParsed,
  fileName
}: ForgeFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const text = await extractTextFromFile(file);
      onFileParsed(text, file.name);
      toast.success(`Successfully parsed ${file.name}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse file");
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsParsing(false);
    }
  };
  const removeFile = () => {
    onFileParsed('', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
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
        <div className="pt-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          {fileName ? (
            <div className="flex items-center justify-between p-3 border-2 border-primary/30 bg-primary/5 rounded-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-medium truncate">{fileName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive">
                <X size={14} />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="w-full border-2 border-dashed border-foreground/20 hover:border-primary/50 hover:bg-primary/5 rounded-xl gap-2 h-10 transition-all group"
            >
              {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4 group-hover:scale-110 transition-transform" />}
              <span className="text-sm font-bold">Add Source Document</span>
            </Button>
          )}
        </div>
      </div>
      <Button
        onClick={onForge}
        disabled={isGenerating || !topic || !chapter || isParsing}
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