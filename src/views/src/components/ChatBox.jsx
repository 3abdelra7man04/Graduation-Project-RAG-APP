// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { useEffect } from "react";
// import { assets } from "../assets/assets/assets";

// const ChatBox = ()=>{
//     const {selectChat ,theme} = useAppContext();
//     const [messages,setMessages] =useState([]);
//     const [loading , setLoading] = useState(false)
//     const [prompt,setPrompt]=useState('');
//     const [isPublished, setIsPublished]=useState(false);
//     const onSubmit =async(e)=>{
//         e.preventDefault()
//     }
//     useEffect(()=>{
//         if(selectChat){
//             setMessages(selectChat.messages)
//         }
//     },[selectChat])
//     return(
//         <div className="flex-1 flex flex-col justify-between m-5 md:m-10 x1:mx-30 max-md:mt-14 2x1:pr-40">
//             <div className="flex-1 mb-5 overflow-y-scroll">
//                 {messages.length===0 && (
//                     <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
//                         <img src={theme ==='dark' ? assets.logo_full : assets.logo_full_dark} alt="" className="w-full max-w-56 sm:max-w-68"/>
//                       <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">Ask Me Anything</p>

//                     </div>
//                 )}


// {/* {messages.map((message,index)=><Messages key={index} message={message} />) } */}
//             </div>
//          <form
//   onSubmit={onSubmit}
//   className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#8069F0]/30 rounded-full w-2/3 p-3 pl-4 mx-auto flex gap-4 items-center"
// >
//   <input
//     onChange={(e) => setPrompt(e.target.value)}
//     value={prompt}
//     type="text"
//     placeholder="Type your question here..."
//     className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white"
//     required
//   />

//   <button type="submit" disabled={loading}>
//     <img
//       src={loading ? assets.stop_icon : assets.send_icon}
//       className="w-8 cursor-pointer"
//       alt="Send"
//     />
//   </button>
// </form>

//         </div>
//     );
// }
// export  default ChatBox



// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import Messages from "./Message";   // ← تأكد إنه موجود

// const ChatBox = () => {
//   const { selectChat, theme } = useAppContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (!prompt.trim()) return;

//     // 1) إضافة رسالة المستخدم
//     const userMessage = { id: Date.now(), sender: "user", text: prompt };
//     setMessages((prev) => [...prev, userMessage]);

//     setPrompt("");
//     setLoading(true);

//     // 2) رد البوت
//     setTimeout(() => {
//       const botMessage = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: "hello",
//       };

//       setMessages((prev) => [...prev, botMessage]);
//       setLoading(false);
//     }, 500);
//   };

//   useEffect(() => {
//     if (selectChat) {
//       setMessages(selectChat.messages || []);
//     }
//   }, [selectChat]);

//   return (
//     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">

//       <div className="flex-1 mb-5 overflow-y-scroll">
//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
//             <img
//               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
//               alt=""
//               className="w-full max-w-56 sm:max-w-68"
//             />
//             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
//               Ask Me Anything
//             </p>
//           </div>
//         )}

//         {/* ✔ عرض الرسائل */}
//         {messages.map((message) => (
//           <Messages key={message.id} message={message} />
//         ))}
//       </div>

//       {/* فورم الإدخال */}
//       <form
//         onSubmit={onSubmit}
//         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#8069F0]/30 rounded-full w-2/3 p-3 pl-4 mx-auto flex gap-4 items-center"
//       >
//         <input
//           onChange={(e) => setPrompt(e.target.value)}
//           value={prompt}
//           type="text"
//           placeholder="Type your question here..."
//           className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white"
//           required
//         />

//         <button type="submit" disabled={loading}>
//           <img
//             src={loading ? assets.stop_icon : assets.send_icon}
//             className="w-8 cursor-pointer"
//             alt="Send"
//           />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;




// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import Messages from "./Message";

// const ChatBox = () => {
//   const { selectChat, theme } = useAppContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//   // دالة الردود حسب الأسئلة المطلوبة
//   const getBotReply = (question) => {
//     const q = question.trim().toLowerCase();

//     if (q === "اهلا uni ask" || (q.includes("اهلا") && q.includes("uni"))) {
//       return "اهلا ابانوب";
//     }

//     if (q.includes("امتحانات") && q.includes("الترم الاول")) {
//       return "امتحانات الترم الاول بكليه هندسه جامعه المنيا هتبداء في شهر يناير من عام 2026";
//     }

//     if (q.includes("ستبداء") && q.includes("الاقسام")) {
//       return "لا ستبداء الفرقه الاعداديه قبل باقي الفرق الاخري في حين سيبداء الفرق الاخري في الثامن من يناير";
//     }

//     if (q.includes("متطلبات") && q.includes("التخرج")) {
//   return (
//     "متطلبات التخرج من هندسه هي:\n" +
//     "1/ النجاح في السنين الدراسيه داخل الكليه\n" +
//     "2/ اجتياز التدريبات الصيفيه بالسنوات الاولي و الثانيه و الثالثه\n" +
//     "3/ اجتياز التربيه العسكريه بنجاح"
//   );
// }

//     if (q.includes("اين") && q.includes("جامعه اسيوط")) {
//       return "هذا السؤال خارج عن المعلومات المتاحه لدي للاسف لا يمكنني الاجابه عنه";
//     }

//     return "عذراً، لا توجد إجابة مسجلة لهذا السؤال.";
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (!prompt.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       role: "user",
//       content: prompt,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setPrompt("");
//     setLoading(true);

//     const typingMessage = {
//       id: "typing",
//       role: "assistant",
//       content: "Typing...",
//       timestamp: new Date(),
//       typing: true
//     };

//     setMessages((prev) => [...prev, typingMessage]);

//     setTimeout(() => {
//       const botMessage = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content: getBotReply(userMessage.content),
//         timestamp: new Date()
//       };

//       setMessages((prev) =>
//         prev
//           .filter((msg) => msg.id !== "typing")
//           .concat(botMessage)
//       );

//       setLoading(false);
//     }, 2000); // ← مدة الـ typing: 2 ثانية
//   };

//   useEffect(() => {
//     if (selectChat) {
//       setMessages(selectChat.messages || []);
//     }
//   }, [selectChat]);

//   return (
//     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">

//       <div className="flex-1 mb-5 overflow-y-scroll">
//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
//             {/* <img
//               src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
//               alt=""
//               className="w-full max-w-56 sm:max-w-68"
//             /> */}
//             <p
//   className={`text-4xl font-bold ${
//     theme === "dark" ? "text-white" : "text-purple-700"}`}
//       >
//         UniAsk
//       </p>


//             <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
//               Ask Me Anything
//             </p>
//           </div>
//         )}

//         {messages.map((message) => (
//           <Messages key={message.id} message={message} />
//         ))}
//       </div>

//       <form
//         onSubmit={onSubmit}
//         className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#8069F0]/30 rounded-full w-2/3 p-3 pl-4 mx-auto flex gap-4 items-center"
//       >
//         <input
//           onChange={(e) => setPrompt(e.target.value)}
//           value={prompt}
//           type="text"
//           placeholder="Type your question here..."
//           className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white"
//           required
//         />

//         <button type="submit" disabled={loading}>
//           <img
//             src={loading ? assets.stop_icon : assets.send_icon}
//             className="w-8 cursor-pointer"
//             alt="Send"
//           />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;



// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import Messages from "./Message";
// import { assets } from "../assets/assets/assets";

// const ChatBox = () => {
//   const { selectChat, theme } = useAppContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//   const getBotReply = (question) => {
//     const q = question.trim().toLowerCase();

//     if (q === "اهلا uni ask" || (q.includes("اهلا") && q.includes("uni"))) {
//       return "اهلا ماجد, كيف يمكنني مساعدتك";
//     }

//     if (q.includes("امتحانات") && q.includes("الترم الاول")) {
//       return "امتحانات الترم الاول بكليه هندسه جامعه المنيا ستبدأ في شهر يناير من عام 2026";
//     }

//     if (q.includes("ستبدأ") && q.includes("الاقسام")) {
//       return "لا ستبدأ الفرقه الاعداديه قبل باقي الفرق الاخري في حين ستبدأ الفرق الاخري في الثامن من يناير";
//     }

//     if (q.includes("متطلبات") && q.includes("التخرج")) {
//       return (
//         "متطلبات التخرج من هندسه هي:\n" +
//         "1/ النجاح في السنين الدراسيه داخل الكليه\n" +
//         "2/ اجتياز التدريبات الصيفيه بالسنوات الاولي و الثانيه و الثالثه\n" +
//         "3/ اجتياز التربيه العسكريه بنجاح"
//       );
//     }

//     if (q.includes("اين") && q.includes("جامعه اسيوط")) {
//       return "هذا السؤال خارج عن المعلومات المتاحه لدي للاسف لا يمكنني الاجابه عنه";
//     }

//     return "عذراً، لا توجد إجابة مسجلة لهذا السؤال.";
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (!prompt.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       role: "user",
//       content: prompt,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setPrompt("");
//     setLoading(true);

//     const typingMessage = {
//       id: "typing",
//       role: "assistant",
//       content: "Typing...",
//       timestamp: new Date(),
//       typing: true,
//     };

//     setMessages((prev) => [...prev, typingMessage]);

//     setTimeout(() => {
//       const botMessage = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content: getBotReply(userMessage.content),
//         timestamp: new Date(),
//       };

//       setMessages((prev) =>
//         prev.filter((msg) => msg.id !== "typing").concat(botMessage)
//       );

//       setLoading(false);
//     }, 2000);
//   };

//   useEffect(() => {
//     if (selectChat) {
//       setMessages(selectChat.messages || []);
//     }
//   }, [selectChat]);

//   return (
//     <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
//       <div className="flex-1 mb-5 overflow-y-scroll">
//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
//            <div className="flex flex-col items-center justify-center mt-10 mb-10">

//   {/* رسالة ترحيبية */}
//   <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 dark:text-white transition-colors">
//     Welcome back!
//   </h1>

//   {/* نص السؤال بتنسيق جذاب */}
//   <p className="mt-3 text-lg sm:text-2xl text-center font-medium bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">
//     How can I help you today?
//   </p>

//   {/* خط زخرفي بسيط (اختياري) */}
//   <div className="w-12 h-1 bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] rounded-full mt-6 opacity-50"></div>
// </div>
//           </div>
//         )}

//         {messages.map((message) => (
//           <Messages key={message.id} message={message} />
//         ))}
//       </div>

//       <form
//         onSubmit={onSubmit}
//         className="bg-[#1A9BB3]/15 dark:bg-[#0C4A5A]/20 
//         border border-[#1A9BB3]/40 dark:border-[#1B8A8F]/40
//         rounded-full w-2/3 p-3 pl-4 mx-auto flex gap-4 items-center"
//       >
//         <input
//           onChange={(e) => setPrompt(e.target.value)}
//           value={prompt}
//           type="text"
//           placeholder="Type your question here..."
//           className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white"
//           required
//         />

//         <button type="submit" disabled={loading}>
//           <div
//             className="
//               w-10 h-10 rounded-full flex justify-center items-center
//               bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6]
//               hover:opacity-90 transition-all
//             "
//           >
//             <img
//               src={loading ? assets.stop_icon : assets.send_icon}
//               className="w-6 invert"
//               alt="Send"
//             />
//           </div>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;


// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import Message from "./Message";
// import { assets } from "../assets/assets/assets";

// const ChatBox = () => {
//   const { selectChat, theme } = useAppContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//    const getBotReply = (question) => {
//     const q = question.trim().toLowerCase();

//     if (q === "اهلا uni ask" || (q.includes("اهلا") && q.includes("uni"))) {
//       return "اهلا ماجد, كيف يمكنني مساعدتك";
//     }

//     if (q.includes("امتحانات") && q.includes("الترم الاول")) {
//       return "امتحانات الترم الاول بكليه هندسه جامعه المنيا ستبدأ في شهر يناير من عام 2026";
//     }

//     if (q.includes("ستبدأ") && q.includes("الاقسام")) {
//       return "لا ستبدأ الفرقه الاعداديه قبل باقي الفرق الاخري في حين ستبدأ الفرق الاخري في الثامن من يناير";
//     }

//     if (q.includes("متطلبات") && q.includes("التخرج")) {
//       return (
//         "متطلبات التخرج من هندسه هي:\n" +
//         "1/ النجاح في السنين الدراسيه داخل الكليه\n" +
//         "2/ اجتياز التدريبات الصيفيه بالسنوات الاولي و الثانيه و الثالثه\n" +
//         "3/ اجتياز التربيه العسكريه بنجاح"
//       );
//     }

//     if (q.includes("اين") && q.includes("جامعه اسيوط")) {
//       return "هذا السؤال خارج عن المعلومات المتاحه لدي للاسف لا يمكنني الاجابه عنه";
//     }

//     return "عذراً، لا توجد إجابة مسجلة لهذا السؤال.";
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     const userMsg = { id: Date.now(), role: "user", content: prompt, timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);
//     setPrompt("");
//     setLoading(true);

//     setTimeout(() => {
//       const botMsg = { id: Date.now()+1, role: "assistant", content: "هذا رد تجريبي مناسب للوضع الحالي.", timestamp: new Date() };
//       setMessages(prev => [...prev, botMsg]);
//       setLoading(false);
//     }, 1000);
//   };

//   useEffect(() => {
//     if (selectChat) setMessages(selectChat.messages || []);
//   }, [selectChat]);

//   return (
//     <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
//   {messages.length === 0 && (
//     <div className="h-full flex flex-col items-center justify-center py-20 text-center">

//       {/* الحاوية العلوية: الصورة والعنوان بجانب بعض */}
//       <div className="flex items-center gap-3 mb-2">
//         <img 
//     src={assets.logoooooo} 
//     alt="Logo" 
//     className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-md" 
//     /* تم تكبيرها لـ 20 وفي الشاشات الكبيرة لـ 24 */
//   />
//        <p className={`text-xl md:text-2xl font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//     Welcome to UniAsk
//   </p>
// </div>

// {/* العنوان الرئيسي الكبير بالأسفل */}
// <h1 className={`text-2xl md:text-3xl font-bold transition-colors leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
//   How can I help you today?
// </h1>

//       {/* خط جمالي بسيط تحت الكلام */}
//       <div className="w-16 h-1 bg-[#1A9BB3] rounded-full mt-6 opacity-20"></div>
//     </div>
//   )}

//   {messages.map((m) => (
//     <Message key={m.id} message={m} />
//   ))}
// </div>

//       <form onSubmit={onSubmit} className="relative flex items-center w-full max-w-3xl mx-auto">
//         <div className="w-full flex items-center bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1A9BB3]/30 transition-all">
//           <input
//             onChange={(e) => setPrompt(e.target.value)}
//             value={prompt}
//             placeholder="Ask anything..."
//             className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 dark:text-white"
//           />
//           <button type="submit" className="bg-[#1A9BB3] p-2.5 rounded-xl hover:opacity-90 transition-all">
//             <img src={assets.send_icon} className="w-5 h-5 invert" alt="" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default ChatBox;



// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import Message from "./Message";
// import { assets } from "../assets/assets/assets";

// const ChatBox = () => {
//   const { selectChat, theme } = useAppContext();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [prompt, setPrompt] = useState("");

//   const getBotReply = (question) => {
//     const q = question.trim().toLowerCase();

//     if (q === "اهلا uni ask" || (q.includes("اهلا") && q.includes("uni"))) {
//       return "اهلا ماجد, كيف يمكنني مساعدتك";
//     }

//     if (q.includes("امتحانات") && q.includes("الترم الاول")) {
//       return "امتحانات الترم الاول بكليه هندسه جامعه المنيا ستبدأ في شهر يناير من عام 2026";
//     }

//     if (q.includes("ستبدأ") && q.includes("الاقسام")) {
//       return "لا ستبدأ الفرقه الاعداديه قبل باقي الفرق الاخري في حين ستبدأ الفرق الاخري في الثامن من يناير";
//     }

//     if (q.includes("متطلبات") && q.includes("التخرج")) {
//       return (
//         "متطلبات التخرج من هندسه هي:\n" +
//         "1/ النجاح في السنين الدراسيه داخل الكليه\n" +
//         "2/ اجتياز التدريبات الصيفيه بالسنوات الاولي و الثانيه و الثالثه\n" +
//         "3/ اجتياز التربيه العسكريه بنجاح"
//       );
//     }

//     if (q.includes("اين") && q.includes("جامعه اسيوط")) {
//       return "هذا السؤال خارج عن المعلومات المتاحه لدي للاسف لا يمكنني الاجابه عنه";
//     }

//     return "عذراً، لا توجد إجابة مسجلة لهذا السؤال.";
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!prompt.trim() || loading) return;

//     const userMsg = { id: Date.now(), role: "user", content: prompt, timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);

//     const currentPrompt = prompt;
//     setPrompt("");
//     setLoading(true);

//     setTimeout(() => {
//       const replyContent = getBotReply(currentPrompt);
//       const botMsg = { 
//         id: Date.now() + 1, 
//         role: "assistant", 
//         content: replyContent, 
//         timestamp: new Date() 
//       };
//       setMessages(prev => [...prev, botMsg]);
//       setLoading(false);
//     }, 800);
//   };

//   useEffect(() => {
//     if (selectChat) setMessages(selectChat.messages || []);
//   }, [selectChat]);

//   return (
//     <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8">
//       {/* منطقة الرسائل */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
//         {messages.length === 0 && (
//           <div className="h-full flex flex-col items-start justify-center py-20 text-left px-6 md:px-12">
//             <div className="flex items-end gap-3 mb-1">
//               <img 
//                 src={assets.logoooooo} 
//                 alt="Logo" 
//                 className="w-16 h-16 md:w-13 md:h-13 object-contain drop-shadow-md" 
//               />
//               <h4 className={`text-lg md:text-2xl font-medium transition-colors pb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                 Hi Maged
//               </h4>
//             </div>

//             <h4 className={`text-4xl md:text-6xl font-medium tracking-tight transition-colors leading-tight -mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                 How can I help you today?
//             </h4>

//             <div className="w-16 h-1 bg-[#1A9BB3] rounded-full mt-6 opacity-40"></div>
//           </div>
//         )}

//         {messages.map((m) => (
//           <Message key={m.id} message={m} />
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//              <div className="bg-gray-100 dark:bg-[#252525] p-3 px-4 rounded-2xl animate-pulse text-sm text-gray-400">
//                UniAsk is thinking...
//              </div>
//           </div>
//         )}
//       </div>

//       {/* منطقة الإدخال والـ Footer */}
//       <div className="w-full flex flex-col items-center gap-3">
//         <form onSubmit={onSubmit} className="relative flex items-center w-full max-w-3xl mx-auto">
//            <div className="w-full flex items-center bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#1A9BB3]/30 transition-all">
//              <input
//                onChange={(e) => setPrompt(e.target.value)}
//                value={prompt}
//                placeholder="Ask anything..."
//                className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 dark:text-white"
//              />
//              <button type="submit" className="bg-cyan-500 p-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center">
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     className="w-5 h-5 text-white" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <line x1="22" y1="2" x2="11" y2="13"></line>
//     <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//   </svg>
// </button>
//            </div>
//         </form> 

//         {/* الـ Footer المصغر */}
//         <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
//           <div className="h-[1px] w-6 bg-gray-300 dark:bg-white/20"></div>

//           <div className="flex items-center gap-1.5">
//             <p className="text-[10px] font-medium tracking-wide text-gray-500 dark:text-[#B1A6C0]">
//               Powered by
//             </p>
//             <div className="flex flex-col items-center">
//               <p className="text-sm font-black tracking-tighter leading-none">
//                 <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Uni</span>
//                 <span className="bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">Ask</span>
//               </p>
//               <div className="w-4 h-[1.5px] bg-[#1A9BB3] rounded-full mt-0.5 opacity-80"></div>
//             </div>
//           </div>

//           <div className="h-[1px] w-6 bg-gray-300 dark:bg-white/20"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;


import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from "../assets/assets/assets";

const ChatBox = () => {
    const { messages, sendPrompt, theme, user } = useAppContext();
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

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const text = input;
        setInput("");
        setLoading(true);
        await sendPrompt(text);
        setLoading(false);
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