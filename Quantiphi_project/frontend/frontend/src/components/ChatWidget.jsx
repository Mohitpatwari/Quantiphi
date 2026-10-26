import { useState } from 'react';

export default function ChatbotWidget() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { text: 'Hi! I can create tasks from natural text or check for stalled task blockers.', sender: 'bot' }
    ]);

    const sendMessage = async () => {
        if (!input) return;
        setMessages([...messages, { text: input, sender: 'user' }]);
        
        try {
            const res = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
            setInput('');
        } catch (error) {
            console.error("Chat API error", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white shadow-2xl rounded-lg border border-gray-300 z-50">
            <div className="bg-gray-800 text-white p-3 rounded-t-lg font-bold">Kanban AI Assistant</div>
            <div className="h-64 p-3 overflow-y-auto flex flex-col gap-2 bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded text-sm max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="p-2 border-t flex gap-2 bg-white">
                <input 
                    type="text" 
                    className="flex-1 p-2 border rounded text-sm" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type 'Assign a task'..." 
                />
                <button onClick={sendMessage} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Send</button>
            </div>
        </div>
    );
}