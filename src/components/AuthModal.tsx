import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/lib/auth-service';
import { toast } from 'sonner';
import { Lock, Mail, UserPlus, LogIn, Loader2 } from 'lucide-react';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleAuth = async (type: 'login' | 'signup') => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = type === 'login' 
        ? await authService.login(email, password)
        : await authService.signup(email, password);
      if (res.success) {
        toast.success(type === 'login' ? 'Welcome back!' : 'Account created!');
        onClose();
      } else {
        toast.error(res.error || 'Authentication failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-2 border-foreground shadow-illustrative p-0 overflow-hidden">
        <Tabs defaultValue="login" className="w-full">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl text-secondary">Join the Forge</DialogTitle>
              <DialogDescription className="font-medium">
                Unlock higher forging limits and persistent guides.
              </DialogDescription>
            </DialogHeader>
            <TabsList className="grid w-full grid-cols-2 mt-6 bg-muted/50 border-2 border-foreground p-1 rounded-xl">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg gap-2">
                <LogIn size={16} /> Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg gap-2">
                <UserPlus size={16} /> Sign Up
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-6 pt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="blacksmith@forge.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-muted focus:border-primary rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass" className="font-bold flex items-center gap-2">
                  <Lock size={14} /> Password
                </Label>
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-muted focus:border-primary rounded-xl"
                />
              </div>
            </div>
            <TabsContent value="login" className="mt-4">
              <Button 
                onClick={() => handleAuth('login')} 
                disabled={loading}
                className="w-full illustrative-button bg-primary text-white h-12 text-lg"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Stoke the Fire'}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <Button 
                onClick={() => handleAuth('signup')} 
                disabled={loading}
                className="w-full illustrative-button bg-secondary text-white h-12 text-lg"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Forge New Account'}
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}