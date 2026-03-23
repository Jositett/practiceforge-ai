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
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        // Finalize decoding with done signal to avoid potential errors
        if (value) {
            buffer += decoder.decode(value, { stream: !done });
        }
        const lines = buffer.split('\n');
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) onChunk(content);
            } catch (e) {
              console.warn('Failed to parse stream chunk:', jsonStr);
            }
          }
        }
        if (done) break;
      }
      return;
    } catch (error) {
      console.error('OpenRouter failed, falling back to built-in agent:', error);
    }
  }
  // Fallback to built-in Cloudflare Agent
  await chatService.sendMessage(prompt, undefined, onChunk);
}