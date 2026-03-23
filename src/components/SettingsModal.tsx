import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Eye, EyeOff, Info } from 'lucide-react';
import { toast } from 'sonner';
export function SettingsModal() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('openrouter_key') || '';
    setApiKey(saved);
  }, [isOpen]);
  const handleSave = () => {
    localStorage.setItem('openrouter_key', apiKey.trim());
    toast.success('Settings saved!');
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-2 border-foreground shadow-illustrative">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Forge Settings</DialogTitle>
          <DialogDescription>
            Configure your AI connection. We prefer OpenRouter for faster results.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenRouter API Key (Optional)</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10 border-2 border-muted focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info size={12} />
              If empty, we'll use our built-in agent (subject to limits).
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="illustrative-button bg-primary text-white">
            Save Forge Config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}