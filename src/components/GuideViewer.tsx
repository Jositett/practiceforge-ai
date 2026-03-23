import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Copy, FileText, Code, ChevronDown } from 'lucide-react';
import { downloadMarkdown, downloadHTML, copyToClipboard } from '@/lib/export-utils';
import { toast } from 'sonner';
interface GuideViewerProps {
  content: string;
  isGenerating: boolean;
}
export function GuideViewer({ content, isGenerating }: GuideViewerProps) {
  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) toast.success('Markdown copied to clipboard!');
  };
  if (!content && !isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
        <div className="w-24 h-24 mb-6 border-4 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
          <Hammer className="w-12 h-12" />
        </div>
        <h3 className="font-display text-3xl mb-2">The Anvil is Cold</h3>
        <p className="max-w-xs">Fill in the forge specs on the left to start striking the iron.</p>
      </div>
    );
  }
  return (
    <div className="sketchy-card h-full bg-white flex flex-col overflow-hidden p-0">
      <div className="p-4 border-b-2 border-foreground flex items-center justify-between bg-muted/30">
        <TabsList className="grid w-[200px] grid-cols-2 bg-muted/50 p-1 border border-foreground/20 rounded-lg">
          <TabsTrigger value="rendered" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">View</TabsTrigger>
          <TabsTrigger value="raw" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Raw</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-2 border-foreground">
                <Download size={16} /> Export <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-2 border-foreground">
              <DropdownMenuItem onClick={() => downloadMarkdown(content)} className="gap-2">
                <FileText size={16} /> Download .md
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadHTML(content)} className="gap-2">
                <Code size={16} /> Download .html
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy} className="gap-2">
                <Copy size={16} /> Copy Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <Tabs defaultValue="rendered" className="h-full">
          <TabsContent value="rendered" className="prose prose-slate prose-lg max-w-none focus-visible:outline-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
            {isGenerating && (
              <div className="mt-8 flex items-center gap-3 animate-pulse text-primary font-display">
                <Sparkles size={18} className="animate-spin" />
                Striking the iron...
              </div>
            )}
          </TabsContent>
          <TabsContent value="raw" className="h-full m-0">
            <textarea
              readOnly
              value={content}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-muted/20 border-2 border-dashed border-muted rounded-lg focus:outline-none resize-none"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
// Minimal Hammer component for empty state
function Hammer({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m15 12-8.37 8.37a1 1 0 1 1-1.41-1.41L13.59 10.59" />
      <path d="M18 15v3a1 1 0 0 1-1 1h-1" />
      <path d="M18 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
      <path d="M10 9H8" />
      <path d="m21 6-3 3-3-3" />
    </svg>
  );
}
function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
  );
}