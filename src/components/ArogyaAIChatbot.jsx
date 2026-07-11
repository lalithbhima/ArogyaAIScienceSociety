import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Bot, X } from 'lucide-react';
import { sendChatMessage, isApiKeyConfigured } from '../chatbot/openrouterClient';

const WELCOME_MESSAGE =
  "Hello! I'm the ArogyaAI Assistant. Ask me about our mission, team, projects, ethical AI, or how to get involved!";

const AIChatbotButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none z-50"
    aria-label="Open ArogyaAI Assistant"
  >
    <Bot size={28} />
  </button>
);

const AIChatbotModal = ({ isOpen, onClose }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setChatMessages([{ sender: 'bot', text: WELCOME_MESSAGE }]);
      setChatInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleChatSend = async (messageOverride) => {
    const userText = (messageOverride ?? chatInput).trim();
    if (!userText || isLoading) return;

    const historyForApi = chatMessages.filter((m) => m.sender !== 'system');
    const updatedMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsLoading(true);

    if (!isApiKeyConfigured()) {
      setChatMessages([
        ...updatedMessages,
        {
          sender: 'bot',
          text: 'The assistant is not configured yet. Please add your OpenRouter API key in src/config/openrouter.key.js (copy from openrouter.key.example.js if needed), then refresh the page.',
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const reply = await sendChatMessage(userText, historyForApi);
      setChatMessages([...updatedMessages, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages([
        ...updatedMessages,
        {
          sender: 'bot',
          text: "Sorry, I couldn't reach the AI service right now. Please try again in a moment, or email us at arogyaaisciencesociety@gmail.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-[100] sm:items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bot size={28} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">ArogyaAI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close chat">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow p-4 space-y-3 overflow-y-auto min-h-[200px]">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-600 p-3 rounded-xl text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 text-center">Suggested questions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleChatSend('What projects are you working on?')}
              disabled={isLoading}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full disabled:opacity-50"
            >
              Projects?
            </button>
            <button
              onClick={() => handleChatSend('How can I support your mission?')}
              disabled={isLoading}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full disabled:opacity-50"
            >
              Support?
            </button>
            <button
              onClick={() => handleChatSend('What are your ethical AI principles?')}
              disabled={isLoading}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full disabled:opacity-50"
            >
              Ethics?
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your question..."
              aria-label="Type your question for the chatbot"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              disabled={isLoading}
            />
            <button
              onClick={() => handleChatSend()}
              disabled={isLoading || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send chat message"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArogyaAIChatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <AIChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <AIChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
};

export default ArogyaAIChatbot;
