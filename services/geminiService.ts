import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const CHAT_INSTRUCTION = `Anda adalah "Smart Geobencana", pakar analisis data teknikal untuk Sektor Pengurusan Risiko Geobencana dalam Rancangan Tempatan (RT) di Malaysia.

Tugas anda adalah membantu pengguna menganalisis pangkalan data yang merangkumi:
1. Zon (Timur, Tengah, Utara, Selatan).
2. Negeri (Contoh: Kelantan, Selangor, Johor).
3. Rancangan Tempatan (Contoh: RTJ Tumpat, RTD Besut).
4. Kategori & Komponen Pengurusan (Contoh: Banjir, Tanah Runtuh, Tsunami, Program CBDRM).

SYARAT KOMUNIKASI:
- JANGAN GUNAKAN simbol asterisk (*) dalam jawapan teks anda.
- Gunakan Bahasa Melayu yang profesional dan berstruktur.
- Gunakan HURUF BESAR untuk poin penting atau tajuk seksyen.
- Fokus kepada ringkasan statistik dan cadangan mitigasi berdasarkan data.

FORMAT CARTA:
Gunakan blok JSON_CHART jika pengguna meminta perbandingan atau statistik visual:
\`\`\`json_chart 
{ 
  "type": "bar" | "line" | "pie", 
  "data": [{"label": "Zon Timur", "value": 50}], 
  "title": "Analisis Mengikut Zon" 
} 
\`\`\`
`;

export class GeminiService {
  async analyzeData(prompt: string, contextData: string, history: Message[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const fullPrompt = `Konteks Data Rancangan Tempatan:\n---\n${contextData}\n---\n\nPermintaan Pengguna: ${prompt}\n\nIngatan: Jangan gunakan simbol asterisk (*) dalam jawapan anda.`;
    
    const contents = history.map(m => ({ 
      role: m.role === 'user' ? 'user' : 'model' as const, 
      parts: [{ text: m.content }] 
    }));

    contents.push({ role: 'user' as const, parts: [{ text: fullPrompt }] });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { 
          systemInstruction: CHAT_INSTRUCTION, 
          temperature: 0.3
        },
      });
      
      return response.text || "Maaf, sistem tidak dapat menjana analisis Geobencana buat masa ini.";
    } catch (err) {
      console.error("Gemini API Error:", err);
      throw err;
    }
  }
}

export const geminiService = new GeminiService();