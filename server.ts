import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini client with latest environment key
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  return {
    ai: new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
    hasApiKey: Boolean(apiKey),
  };
}

const DEFAULT_SYSTEM_INSTRUCTION = `أنت 'شاهين AI' (Chahine AI)، مساعد ذكاء اصطناعي عربي فائق الذكاء والتطور، مستوحى من الصقر شاهين رمز السرعة والبصيرة والقوة والأصالة.
مهمتك:
- تقديم إجابات ذكية، دقيقة، عميقة، ومكتوبة بلغة عربية فصحى معاصرة وأنيقة وواضحة.
- تنظيم الأفكار بشكل جميل باستخدام Markdown (عناوين رئيسية وفرعية، نقاط، قوائم، جداول، واقتباسات ملهمة).
- كتابة الأكواد البرمجية بطريقة احترافية مع تعليقات وتوضيحات موجزة باللغة العربية.
- إذا وجه لك المستخدم سؤالاً بلغة أخرى (مثل الإنجليزية أو الفرنسية)، أجب بنفس اللغة بطلاقة واحترافية.
- كن ودوداً، ومساعداً، ومحفزاً، ومستعداً للإجابة عن كل مجالات المعرفة (التكنولوجيا، العلوم، الكتابة الإبداعية، ريادة الأعمال، التاريخ، والحياة اليومية).
- إذا سُئلت عن هويتك، أجب بفخر أنك شاهين AI (Chahine AI).`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { hasApiKey } = getAiClient();
  res.json({
    status: 'ok',
    app: 'Chahine AI',
    hasApiKey,
    model: 'gemini-3.8-flash',
  });
});

// Non-streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, temperature, systemInstruction } = req.body;
    const { ai, hasApiKey } = getAiClient();

    if (!hasApiKey) {
      return res.status(500).json({
        error: 'لم يتم العثور على مفتاح GEMINI_API_KEY في إعدادات الخادم. يرجى ضبط المفتاح في لوحة التحكم (Settings > Secrets).',
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'قائمة الرسائل غير صالحة أو فارغة.' });
    }

    // Format messages for Gemini API
    const geminiContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: geminiContents,
      config: {
        systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      },
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Gemini generateContent error:', error);
    return res.status(500).json({
      error: error?.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب في نموذج شاهين AI.',
    });
  }
});

// Streaming chat endpoint using Server-Sent Events (SSE)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages, temperature, systemInstruction } = req.body;

    const { ai, hasApiKey } = getAiClient();

    if (!hasApiKey) {
      res.status(500).json({
        error: 'لم يتم العثور على مفتاح GEMINI_API_KEY في إعدادات الخادم. يرجى ضبط المفتاح في لوحة التحكم (Settings > Secrets).',
      });
      return;
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'قائمة الرسائل غير صالحة أو فارغة.' });
      return;
    }

    // Format messages for Gemini API
    const geminiContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: geminiContents,
      config: {
        systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini stream error:', error);
    // If headers not yet sent, send JSON error; otherwise send SSE error event
    if (!res.headersSent) {
      res.status(500).json({
        error: error?.message || 'حدث خطأ في الاتصال بنموذج شاهين AI.',
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error?.message || 'انقطع الاتصال بنموذج الذكاء الاصطناعي.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// Setup Vite middlewares in development or static dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🦅 شاهين AI (Chahine AI) server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
