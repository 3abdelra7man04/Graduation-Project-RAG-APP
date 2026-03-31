import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from "../assets/assets/assets";
import { useParams, useNavigate } from 'react-router-dom';

const ChatBox = () => {
    const { messages, sendPrompt, theme, user, chats, setSelectChat, getChatMessages, selectChat } = useAppContext();
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    // دالة استخراج أول حرفين من اسم المستخدم
    const getInitials = (name) => {
        if (!name) return "GU";
        const names = name.split(" ");
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    // When landing directly on /c/:chatId (refresh or shared link),
    // auto-load the correct chat from the chats list
    useEffect(() => {
        if (chatId && chats && chats.length > 0) {
            // Only load if selectChat doesn't already match the URL param
            if (!selectChat || selectChat._id !== chatId) {
                const matched = chats.find(c => c._id === chatId);
                if (matched) {
                    setSelectChat(matched);
                    getChatMessages(chatId);
                } else {
                    // Chat not found — redirect to app home
                    navigate('/app');
                }
            }
        }
    }, [chatId, chats]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const text = input;
        setInput("");
        setLoading(true);
        const newChatId = await sendPrompt(text);
        setLoading(false);

        // If a new chat was created, update the URL to /app/c/{chat_id}
        if (newChatId) {
            navigate(`/app/c/${newChatId}`);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8">

            {/* منطقة الرسائل */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 custom-scrollbar">

                {(!messages || messages.length === 0) && (
                    <div className="h-full flex flex-col items-start justify-center py-20 text-left px-6 md:px-12 animate-in fade-in duration-700">
                        <div className="flex items-end gap-3 mb-1">
                            <img src={assets.logoooooo} alt="Logo" className="w-16 h-16 md:w-13 md:h-13 object-contain drop-shadow-md" />
                            <h4 className={`text-lg md:text-2xl font-medium pb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Hi {user?.name?.split(" ")[0] || "Guest"}
                            </h4>
                        </div>
                        <h4 className={`text-4xl md:text-6xl font-medium tracking-tight leading-tight -mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            How can I help you today?
                        </h4>
                        <div className="w-16 h-1 bg-[#1A9BB3] rounded-full mt-6 opacity-40"></div>
                    </div>
                )}

                {messages && messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg?.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>

                        {/* أيقونة الطرف المتحدث */}
                        <div className="flex-shrink-0 mt-1">
                            {msg?.role === 'user' ? (
                                // دائرة حروف اسم المستخدم
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1A9BB3] to-[#3D81F6] text-white text-[10px] font-bold shadow-sm">
                                    {getInitials(user?.name)}
                                </div>
                            ) : (
                                // أيقونة UniAsk للردود
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                                    <img src={assets.logoooooo} className="w-5 h-5 object-contain" alt="Uni" />
                                </div>
                            )}
                        </div>

                        {/* محتوى الرسالة */}
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg?.role === 'user'
                            ? 'bg-[#1A9BB3] text-white rounded-tr-none'
                            : (theme === 'dark' ? 'bg-[#252525] text-gray-200 rounded-tl-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none')
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg?.content || "..."}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 items-start animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#252525] flex items-center justify-center">
                            <img src={assets.logoooooo} className="w-4 h-4 opacity-40" alt="Uni" />
                        </div>
                        <div className="bg-gray-100 dark:bg-[#252525] p-3 px-4 rounded-2xl text-sm text-gray-400">
                            UniAsk is thinking...
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* منطقة الإدخال */}
            <div className="w-full flex flex-col items-center gap-3">
                <form onSubmit={handleSend} className="relative flex items-center w-full max-w-3xl mx-auto">
                    <div className="w-full flex items-center bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1A9BB3]/30 transition-all">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            placeholder="Ask UniAsk anything..."
                            className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 dark:text-white"
                        />
                        <button type="submit" disabled={loading} className="bg-[#1A9BB3] p-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center gap-2 opacity-60 translate-y-3">
                    <p className="text-[10px] font-medium text-gray-500">Powered by</p>
                    <p className="text-sm font-black tracking-tighter">
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Uni</span>
                        <span className="bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">Ask</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;