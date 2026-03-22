// import { useContext, useEffect, useState } from "react";
// import { createContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {dummyChats, dummyUserData} from "../assets/assets/assets"


// const AppContext =createContext();

// export const AppContextProvider =({children})=>{

//     const navigate =useNavigate();
//     const [user,setUser]=useState(null);
//     const [chats,setChats]=useState([]);
//     const [selectChat,setSelectChat] = useState(null);
//     const [theme,setTheme]=useState(localStorage.getItem('theme')||'light');


//     const fetchUserChats =async()=>{
//         setChats(dummyChats)
//         setSelectChat(dummyChats[0])
//     }


//     const fetchUser =async()=>{
//         setUser(dummyUserData)
//     }


//     useEffect (()=>{
//         if(user)
//         {
//             fetchUser()
//         }
//         else{
//             setChats([])
//             setSelectChat(null)
//         }

//     },[user])

//     useEffect(()=>{
//         if(theme==="dark")
//         {
//             document.documentElement.classList.add("dark");
//         }
//         else{
//             document.documentElement.classList.remove("dark")
//         }
//         localStorage.setItem("theme",theme)
//     })
//     const  value ={navigate,user,setUser,fetchUser,chats,setChats,selectChat,setSelectChat,theme,setTheme}
//     return(
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     )
// }
// export const useAppContext=()=>useContext(AppContext)


// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { dummyChats, dummyUserData } from "../assets/assets/assets";

// const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [selectChat, setSelectChat] = useState(null);
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

//   const fetchUserChats = async () => {
//     setChats(dummyChats);
//     setSelectChat(dummyChats[0]);
//   };

//   const fetchUser = async () => {
//      setUser(dummyUserData);//dummyUserData
//   };

//   useEffect(() => {
//     if (user) {
//       fetchUserChats();
//     } else {
//       setChats([]);
//       setSelectChat(null);
//     }
//   }, [user]);
//   useEffect(() => {
//   fetchUser();
//   fetchUserChats();
// }, []);

//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const value = {
//     navigate,
//     user,
//     setUser,
//     fetchUser,
//     chats,
//     setChats,
//     selectChat,
//     setSelectChat,
//     theme,
//     setTheme,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);



// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // تأكد من تثبيته: npm install axios

// const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const navigate = useNavigate();

//   // عنوان السيرفر (FastAPI) - غيره حسب الـ IP أو Port الخاص بك
//   const backendUrl = "http://127.0.0.1:8000"; 

//   const [user, setUser] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [selectChat, setSelectChat] = useState(null);
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
//   const [token, setToken] = useState(localStorage.getItem('token') || "");

//   // 1. دالة جلب بيانات المستخدم
//   const fetchUserData = async () => {
//     try {
//       if (!token) return;
//       const { data } = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token } });
//       if (data.success) {
//         setUser(data.userData);
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       // لو التوكن منتهي أو فيه مشكلة
//       logout();
//     }
//   };

//   // 2. دالة جلب المحادثات من السيرفر
//   const fetchUserChats = async () => {
//     try {
//       if (!token) return;
//       const { data } = await axios.get(`${backendUrl}/api/chat/list`, { headers: { token } });
//       if (data.success) {
//         setChats(data.chats.reverse()); // ترتيب من الأحدث للأقدم
//       }
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//     }
//   };

//   // 3. دالة إنشاء شات جديد (POST)
//   const createNewChat = async () => {
//     try {
//       const { data } = await axios.post(`${backendUrl}/api/chat/create`, {}, { headers: { token } });
//       if (data.success) {
//         await fetchUserChats(); // تحديث القائمة
//         setSelectChat(data.chat); // اختيار الشات الجديد فوراً
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//     }
//   };

//   // 4. دالة إرسال رسالة واستقبال رد الـ AI
//   const sendPrompt = async (prompt) => {
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/chat/send`,
//         { chatId: selectChat?._id, prompt },
//         { headers: { token } }
//       );
//       if (data.success) {
//         // تحديث الشات الحالي بالرسائل الجديدة (رسالة المستخدم + رد البوت)
//         await fetchUserChats(); 
//         return data.botMessage; // نرجعه للـ ChatBox ليعرضه فوراً
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   // 5. دالة تسجيل الخروج
//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken("");
//     setUser(null);
//     setChats([]);
//     setSelectChat(null);
//     navigate('/login');
//   };

//   // مراقبة التغير في التوكن لجلب البيانات
//   useEffect(() => {
//     if (token) {
//       fetchUserData();
//       fetchUserChats();
//     }
//   }, [token]);

//   // التحكم في الثيم (Dark/Light)
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const value = {
//     navigate,
//     backendUrl,
//     token,
//     setToken,
//     user,
//     setUser,
//     chats,
//     setChats,
//     selectChat,
//     setSelectChat,
//     theme,
//     setTheme,
//     fetchUserChats,
//     createNewChat,
//     sendPrompt,
//     logout
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);



// src/context/AppContext.jsx

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
            const { data } = await axios.get(`${backendUrl}/api/chat/list`, { headers: { token } });
            if (data.success) setChats(data.chats || []);
        } catch (e) { console.log(e); }
    };

    const getChatMessages = async (chatId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/chat/get/${chatId}`, { headers: { token } });
            if (data.success) setMessages(data.messages || []);
        } catch (e) { console.log(e); }
    };

    const sendPrompt = async (prompt) => {
        if (!prompt.trim()) return;
        try {
            const userMsg = { role: "user", content: prompt };
            setMessages(prev => [...(prev || []), userMsg]);
            const { data } = await axios.post(`${backendUrl}/api/chat/send`, { prompt, chatId: selectChat?._id }, { headers: { token } });
            if (data.success) {
                setMessages(prev => [...(prev || []), data.botMessage]);
                loadUserChats();
                if (!selectChat) setSelectChat({ _id: data.chatId });
            }
        } catch (e) { console.log(e); }
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
        createNewChat: () => { setSelectChat(null); setMessages([]); }
    };
    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);