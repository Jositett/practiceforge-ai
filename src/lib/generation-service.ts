import { chatService } from './chat';
export async function generateGuide(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const openRouterKey = localStorage.getItem('openrouter_key');
  if (openRouterKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PracticeForge AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        }),
      });
      if (!response.ok) throw new Error(`OpenRouter error: ${response.statusText}`);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('ReadableStream not available');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') break;
          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) onChunk(content);
          } catch (e) {
            // Partial JSON or heartbeat
          }
        }
      }
      return;
    } catch (error) {
      console.error('OpenRouter failed, falling back to built-in agent:', error);
    }
  }
  // Fallback to built-in Cloudflare Agent
  await chatService.sendMessage(prompt, undefined, onChunk);
}