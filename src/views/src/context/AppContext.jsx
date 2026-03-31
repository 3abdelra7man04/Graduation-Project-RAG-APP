import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectChat, setSelectChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || "light");
    const backendUrl = "http://127.0.0.1:5000";

    const loadUserData = async () => {
        if (!token) return;
        try {
            const projectId = 0;
            const { data } = await axios.get(`${backendUrl}/api/v1/user/get-profile/${projectId}?user_id=${token}`, { headers: { token } });
            if (data.userData) {
                // Map the backend Pydantic model structure to the frontend React expected structure
                setUser({
                    id: data.userData.id,
                    name: data.userData.user_name,
                    email: data.userData.user_email,
                });
            }
        } catch (e) { console.log(e); }
    };

    const loadUserChats = async () => {
        if (!token) return;
        try {
            const projectId = "0";
            const { data } = await axios.get(`${backendUrl}/api/v1/chat/${projectId}/list/${token}`, { headers: { token } });

            if (data && data.all_chats) {
                // Map the backend structure to the frontend structure safely
                const mappedChats = data.all_chats.map((c, i) => ({
                    _id: c._id,
                    name: c.chat_title || "Untitled Chat",
                    messages: [],
                    updatedAt: c.updatedAt || new Date()
                }));
                setChats(mappedChats);
            }
        } catch (e) { console.log(e); }
    };

    const getChatMessages = async (chatId) => {
        try {
            const projectId = "0";
            const { data } = await axios.get(`${backendUrl}/api/v1/chat/${projectId}/get/${chatId}`, { headers: { token } });
            if (data && data.chat_conversation) {
                // Map {question, answer} pairs into flat {role, content} messages
                const mapped = data.chat_conversation.flatMap(({ question, answer }) => [
                    { role: "user", content: question },
                    { role: "assistant", content: answer },
                ]);
                setMessages(mapped);
            } else if (data && data.chat_history) {
                // Fallback: backend still returns chat_history key
                setMessages(data.chat_history);
            }
        } catch (e) {
            console.error(e);
            setMessages([]);
        }
    };

    const sendPrompt = async (prompt) => {
        if (!prompt.trim()) return null;
        try {
            const userMsg = { role: "user", content: prompt };
            setMessages(prev => [...(prev || []), userMsg]);

            const projectId = "0"; // Match the hardcoded projectId used in loadUserData
            let response;
            let isNewChat = false;

            if (!selectChat?._id) {
                // start conversation branch
                isNewChat = true;
                response = await axios.post(`${backendUrl}/api/v1/chat/${projectId}`, {
                    query: prompt,
                    user_id: token,
                    limit: 3
                }, { headers: { token } });
            } else {
                // continue conversation branch
                response = await axios.post(`${backendUrl}/api/v1/chat/${projectId}/c/${selectChat._id}`, {
                    query: prompt,
                    user_id: token,
                    limit: 3
                }, { headers: { token } });
            }

            const data = response.data;
            if (data && data.answer) {
                const botMessage = { role: "assistant", content: data.answer };
                setMessages(prev => [...(prev || []), botMessage]);
                loadUserChats();
                if (isNewChat && data.chat_id) {
                    setSelectChat({ _id: data.chat_id });
                    return data.chat_id; // return new chat_id so caller can update URL
                }
            }
        } catch (e) {
            console.error("Backend error:", e);
            const errorMessage = {
                role: "assistant",
                content: "Sorry, I couldn't reach the AI backend (Error 500). Please check your backend console!"
            };
            setMessages(prev => [...(prev || []), errorMessage]);
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(""); setUser(null); setChats([]); setMessages([]); setSelectChat(null);
    };

    useEffect(() => {
        if (token) { loadUserData(); loadUserChats(); }
    }, [token]);

    const value = {
            token, setToken, user, chats, selectChat, setSelectChat, messages, setMessages,
        theme, setTheme, backendUrl, logout, sendPrompt, getChatMessages,
        createNewChat: (navigate) => { setSelectChat(null); setMessages([]); if (navigate) navigate('/app'); }
    };
    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);