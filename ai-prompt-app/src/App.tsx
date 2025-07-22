import { useState } from 'react';
import { Textarea } from "./components/ui/textarea";
import brainIcon from './assets/brain.png';
import { SendIcon } from 'lucide-react';
import './index.css';

type ChatItem = {
  prompt: string;
  response: string;
  timestamp: string;
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch response.');

      const data = await res.json();
      const answer = data.choices[0].message.content;

      setChatHistory(prev => [
        ...prev,
        { prompt, response: answer, timestamp: new Date().toISOString() },
      ]);
      setPrompt('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
  <div className="min-h-screen bg-[#0d1314] text-[#ccd4d1] px-4 py-10">
    {/* Header */}
    <header className="text-center mb-10">
      <img src={brainIcon} alt="Brain Icon" className="w-24 h-24 mx-auto mb-2" />
      <h1 className="text-4xl font-bold text-[#ccd4d1]">
        BR<span className="text-[#00a98e]">Ai</span>N
      </h1>
    </header>
    {/* Prompt Input */}
    <section className="max-w-3xl mx-auto relative mb-11 focus-outline-none focus:ring-none focus:border-none focus:bg-[#0d1314] " tabIndex={-1}>
      <Textarea
          className="w-full resize-none rounded-xl bg-[#0d1314] border border-[#00a98e] text-[#ccd4d1]
  p-4 pr-14 text-base shadow-md focus:outline-none focus:ring-0 focus:border-[#00a98e] focus:bg-[#0d1314]"
        placeholder="Ask me anything..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />
      <button
        className="absolute bottom-5 right-4 text-[#00a98e] hover:opacity-80 transition disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!prompt.trim()}
        onClick={handleSubmit}
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </section>

    {/* Chat History */}
    <section className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-[#00a98e] mb-4">Chat History</h2>
      {chatHistory.map((item, index) => (
        <div
          key={index}
          className="bg-[#0d1314] border border-[#00a98e] rounded-xl p-4 shadow-md hover:shadow-lg transition"
        >
          <p className="text-[#00a98e] mb-2"><strong>Prompt:</strong> {item.prompt}</p>
          <p className="text-[#ccd4d1] mb-2"><strong>Response:</strong> {item.response}</p>
          <p className="text-[#6c757d] text-xs">{new Date(item.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </section>
  </div>
);


}

export default App;
