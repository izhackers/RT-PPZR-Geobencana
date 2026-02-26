import React, { useState, useRef, useEffect, useMemo } from 'react';
import { geminiService } from './services/geminiService';
import { Message, DashboardData } from './types';
import { ChartRenderer } from './components/ChartRenderer';

const DEFAULT_CSV = `objectid,kategori,komponen,zon,kod_negeri,negeri,rancangan_tempatan
1,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Pasir Putih
2,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTMD Ketereh
3,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Tumpat
4,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Kuala Krai
5,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Besut
6,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Setiu
7,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD H.Terengganu
8,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Marang
9,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Bera
10,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Temerloh
11,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Maran
12,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Raub
13,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTMD Lipis
14,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Rompin
15,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Kuala Kangsar
16,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTMB Ipoh
17,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Batang Padang
18,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Mualim
19,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Hilir Perak
20,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTMP Klang
21,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
22,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
23,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Pendang
24,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Baling
25,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Padang Terap
26,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Sik
27,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Yan
28,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Kluang
29,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Muar
30,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RT MBJB
31,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RT MBIP
32,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Kota Tinggi
33,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RTMP Alor Gajah
34,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RT MPHTJ
35,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RTMP Jasin
36,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
37,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
357,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Selatan,4,MELAKA,RTMP Jasin`;

const parseCSV = (csv: string) => {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      obj[header.trim()] = values[i]?.trim();
      return obj;
    }, {});
  }).filter(r => r.objectid);
};

const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeData] = useState<DashboardData | null>({
    name: 'Geobencana_Master_Data.csv',
    content: DEFAULT_CSV,
    type: 'csv',
    uploadedAt: new Date()
  });

  const parsedRecords = useMemo(() => activeData ? parseCSV(activeData.content) : [], [activeData]);

  const fullContent = useMemo(() => {
    if (parsedRecords.length === 0) return "";
    const headers = Object.keys(parsedRecords[0]).join(',');
    const body = parsedRecords.map(r => Object.values(r).join(',')).join('\n');
    return headers + '\n' + body;
  }, [parsedRecords]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await geminiService.analyzeData(inputText, fullContent, messages);
      const chartRegex = /```json_chart\s*([\s\S]*?)\s*```/;
      const match = response.match(chartRegex);
      let cleanText = response;
      let chartData = undefined;

      if (match) {
        try {
          chartData = JSON.parse(match[1]);
          cleanText = response.replace(chartRegex, '').trim();
        } catch (e) {
          console.error("Chart Parse Error:", e);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        timestamp: new Date(),
        chartData
      }]);
    } catch (error) {
      console.error("Analysis Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "MAAF, TERDAPAT GANGGUAN PADA TALIAN ANALISIS GEOBENCANA. SILA CUBA SEBENTAR LAGI.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-screen bg-[#1A2E28] text-[#D9C5A0] font-sans overflow-hidden">
      <header className="bg-[#14241F]/90 backdrop-blur-md border-b border-[#D9C5A0]/20 p-4 z-20 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2F5D50] border border-[#D9C5A0]/30 rounded-xl flex items-center justify-center shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D9C5A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.25em] leading-none">Smart Geobencana</h1>
              <p className="text-[8px] text-[#D9C5A0]/70 font-bold uppercase tracking-widest mt-1">AI RT Analyst</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={clearChat} className="px-3 py-1.5 bg-[#14241F] border border-[#D9C5A0]/20 text-[10px] font-black uppercase text-[#D9C5A0]/80 hover:bg-[#2F5D50] hover:text-white rounded-lg transition-all">
               Reset
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#1A2E28] custom-scrollbar flex flex-col items-center">
        <div className="max-w-4xl w-full flex-1 flex flex-col gap-8 pb-32">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-12 animate-in fade-in zoom-in duration-700">
               <div className="w-24 h-24 bg-[#2F5D50] rounded-[2.5rem] flex items-center justify-center mb-8 border border-[#D9C5A0]/30 shadow-2xl">
                  <div className="text-[#D9C5A0]"><BotIcon /></div>
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-6">Smart Geobencana</h2>
               <p className="text-[#D9C5A0] text-sm font-medium max-w-2xl leading-relaxed opacity-90">
                 hi! saya sedia membantu dalam menganalisis rancangan tempatan yang merangkumi sektor pengurusan risiko geobecana. Saya boleh menganalisis mengikut zon, negeri dan rancangan tempatan atau mengikut kategori dan komponen pengurusan.
               </p>
               
               <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                  {[
                    "Analisis risiko mengikut Zon Timur",
                    "Senarai RT di Negeri Kelantan",
                    "Ringkasan komponen Risiko Banjir",
                    "Bandingkan kategori Mitigasi MB vs MTB"
                  ].map(q => (
                    <button key={q} onClick={() => setInputText(q)} className="px-5 py-3 text-left rounded-xl bg-[#14241F] border border-[#D9C5A0]/10 text-[10px] font-bold uppercase tracking-widest text-[#D9C5A0]/60 hover:border-[#D9C5A0]/40 hover:bg-[#2F5D50] hover:text-white transition-all">
                      {q}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start animate-in slide-in-from-bottom-2 duration-300`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#2F5D50] flex items-center justify-center text-[#D9C5A0] border border-[#D9C5A0]/20 flex-shrink-0 mt-1 shadow-md">
                   <BotIcon />
                </div>
              )}
              <div className={`max-w-[85%] px-6 py-5 rounded-2xl ${m.role === 'user' ? 'bg-[#D9C5A0] text-[#1A2E28] rounded-tr-none shadow-lg font-semibold' : 'bg-[#14241F] border border-[#D9C5A0]/20 text-white rounded-tl-none shadow-xl'}`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                {m.chartData && (
                  <div className="mt-8 pt-6 border-t border-[#D9C5A0]/10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D9C5A0] mb-6 flex items-center gap-2">
                       <span className="w-2 h-2 bg-[#D9C5A0] rounded-full"></span>
                       {m.chartData.title}
                    </h4>
                    <div className="h-64 w-full"><ChartRenderer chart={m.chartData} /></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 items-center bg-[#14241F]/80 px-6 py-3 rounded-full w-fit border border-[#D9C5A0]/20 ml-11">
               <div className="flex gap-1.5">
                 <div className="w-1.5 h-1.5 bg-[#D9C5A0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-[#D9C5A0] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-[#D9C5A0] rounded-full animate-bounce"></div>
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-[#D9C5A0]/60">Neural Link Active...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#14241F] via-[#1A2E28]/95 to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute inset-0 bg-[#D9C5A0]/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Tanya tentang data Rancangan Tempatan..." 
              className="w-full pl-6 pr-40 py-4 bg-[#14241F]/90 border border-[#D9C5A0]/30 rounded-2xl focus:ring-2 focus:ring-[#D9C5A0]/20 text-white text-sm outline-none backdrop-blur-md shadow-2xl placeholder-[#D9C5A0]/30" 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isLoading} 
              className="absolute right-2 top-2 bottom-2 bg-[#2F5D50] hover:bg-[#3d7a69] disabled:bg-[#1f3830] text-[#D9C5A0] px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg border border-[#D9C5A0]/20"
            >
              {isLoading ? 'Analisis' : 'Hantar'}
            </button>
          </form>
          <p className="text-center text-[8px] font-bold text-[#D9C5A0]/40 uppercase tracking-widest mt-4">
            Smart Geobencana Engine v2.0 • Data Driven Analytics
          </p>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #14241F; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2F5D50; border-radius: 10px; border: 1px solid #D9C5A033; }
      `}</style>
    </div>
  );
};

export default App;