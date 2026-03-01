// import React from "react";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";
// const Message = ({message})=>{
//     return(
//         <div>
//             {message.role==="user"?
//             (
//                 <div className="flex items-start justify-end my-4 gap-2">

//                     <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2x1">
//                       <p className="text-sm dark:text-primary"><Markdown>{message.content}</Markdown></p>
//                       <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">{moment(message.timestamp).fromNow()}</span>


//                     </div>
//                     <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
//                 </div>
//             ):
//             (
//                 <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2x1 bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md my-4">
//                     {message.isImage ?
//                     (
//                         <img src={message.content} className="w-full max-w-md mt-2 rounded-md"/>
//                     ):
//                     (
//                         <div className="text-sm dark:text-primary rest-tw">
//                             <Markdown>{message.content}</Markdown>

//                         </div>
//                     )
//                     }
//                     <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">{moment(message.timestamp).fromNow()}</span>
//                 </div>
//             )
//             }
//         </div>
//     );
// }
// export  default Message




// import React from "react";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";

// const Message = ({ message }) => {
//     const content = message?.content || ""; // fallback

//     return (
//         <div>
//             {message.role === "user" ? (
//                 <div className="flex items-start justify-end my-4 gap-2">
//                     <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
//                         <div className="text-sm dark:text-primary">
//                             <Markdown>{content}</Markdown>
//                         </div>

//                         <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//                             {moment(message.timestamp).fromNow()}
//                         </span>
//                     </div>

//                     <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
//                 </div>
//             ) : (
//                 <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md my-4">
//                     {message.isImage ? (
//                         <img
//                             src={content}
//                             className="w-full max-w-md mt-2 rounded-md"
//                             alt=""
//                         />
//                     ) : (
//                         <div className="text-sm dark:text-primary rest-tw">
//                             <Markdown>{content}</Markdown>
//                         </div>
//                     )}

//                     <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//                         {moment(message.timestamp).fromNow()}
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Message;





// import React from "react";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";

// const Message = ({ message }) => {
//   const content = message?.content || "";

//   const TypingDots = () => (
//     <div className="flex items-center gap-1 py-1">
//       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
//       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
//       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
//     </div>
//   );

//   return (
//     <div>
//       {message.role === "user" ? (
//         <div className="flex items-start justify-end my-4 gap-2">

//           <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
//             <div className="text-sm dark:text-primary">
//               <Markdown>{content}</Markdown>
//             </div>

//             <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//               {moment(message.timestamp).fromNow()}
//             </span>
//           </div>

//           <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
//         </div>
//       ) : (
//         <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md my-4">

//           {message.typing ? (
//             <TypingDots />
//           ) : (
//             <div className="text-sm dark:text-primary rest-tw">
//               <Markdown>{content}</Markdown>
//             </div>
//           )}

//           <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//             {moment(message.timestamp).fromNow()}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;


// import React from "react";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";

// const Message = ({ message, theme }) => {
//   const content = message?.content || "";
//   const isUser = message.role === "user";

//   const TypingDots = () => (
//     <div className="flex items-center gap-1 py-1">
//       <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
//       <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
//       <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></span>
//     </div>
//   );

//   // ================================
//   // BOT MESSAGE — نفس درجة الفورم
//   // ================================
//   const botStyle =
//     theme === "dark"
//       ? {
//           background: "rgba(12, 74, 90, 0.20)",
//           borderColor: "rgba(27, 138, 143, 0.40)",
//         }
//       : {
//           background: "rgba(26, 155, 179, 0.15)",
//           borderColor: "rgba(26, 155, 179, 0.40)",
//         };

//   // ====================================
//   // USER MESSAGE — نفس اللون ولكن أغمق درجة
//   // ====================================
//   const userStyle =
//     theme === "dark"
//       ? {
//           background: "rgba(12, 74, 90, 0.28)",     // أغمق قليلاً
//           borderColor: "rgba(27, 138, 143, 0.55)",  // أغمق سنّة
//         }
//       : {
//           background: "rgba(26, 155, 179, 0.22)",   // أغمق قليلاً
//           borderColor: "rgba(26, 155, 179, 0.55)",  // أغمق سنّة
//         };

//   return (
//     <div className="my-4">
//       {isUser ? (
//         <div className="flex items-start justify-end gap-2">
//           <div
//             className="
//               flex flex-col gap-2 p-3 px-4 max-w-2xl rounded-md
//               text-white border backdrop-blur-md
//             "
//             style={userStyle}
//           >
//             <div className="text-sm">
//               <Markdown>{content}</Markdown>
//             </div>

//             <span className="text-xs text-gray-200">
//               {moment(message.timestamp).fromNow()}
//             </span>
//           </div>

//           <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
//         </div>
//       ) : (
//         <div
//           className="
//             inline-flex flex-col gap-2 p-3 px-4 max-w-2xl rounded-md 
//             text-white border backdrop-blur-md
//           "
//           style={botStyle}
//         >
//           {message.typing ? (
//             <TypingDots />
//           ) : (
//             <div className="text-sm">
//               <Markdown>{content}</Markdown>
//             </div>
//           )}

//           <span className="text-xs text-gray-200">
//             {moment(message.timestamp).fromNow()}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;


// import React from "react";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";
// import { useAppContext } from "../context/AppContext";

// const Message = ({ message }) => {
//   const { theme } = useAppContext();
//   const isUser = message.role === "user";

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-3 my-4`}>
//       {!isUser && (
//         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1A9BB3] to-[#3D81F6] flex items-center justify-center text-white text-[10px] font-bold shadow-sm flex-shrink-0">
//           Uni
//         </div>
//       )}

//       <div className={`flex flex-col gap-1 max-w-[80%] md:max-w-2xl`}>
//         <div className={`p-3 px-4 rounded-2xl border transition-all duration-300 text-sm md:text-base shadow-sm
//           ${isUser 
//             ? "bg-white dark:bg-[#252525] border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-100 rounded-tl-none" 
//             :"bg-[#1A9BB3] border-[#1A9BB3] text-white rounded-tr-none" 
//           }`}
//         >
//           <Markdown>{message.content}</Markdown>
//         </div>
//         <span className={`text-[10px] px-1 opacity-50 ${isUser ? "text-right" : "text-left"}`}>
//           {moment(message.timestamp).fromNow()}
//         </span>
//       </div>

//       {isUser && (
//         <img src={assets.user_icon} className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0" alt="" />
//       )}
//     </div>
//   );
// };
// export default Message;






import React from "react";
import { assets } from "../assets/assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import { useAppContext } from "../context/AppContext";

const Message = ({ message }) => {
  const { theme } = useAppContext();
  
  // التأكد من أن الدور هو 'user' أو 'assistant' كما هو معتاد في FastAPI
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      
      {/* أيقونة البوت (Uni) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1A9BB3] to-[#3D81F6] flex items-center justify-center text-white text-[10px] font-bold shadow-sm flex-shrink-0">
          Uni
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-2xl`}>
        <div className={`p-3 px-4 rounded-2xl border transition-all duration-300 text-sm md:text-base shadow-sm
          ${isUser 
            ? "bg-white dark:bg-[#252525] border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-100 rounded-tr-none" 
            : "bg-[#1A9BB3] border-[#1A9BB3] text-white rounded-tl-none" 
          }`}
        >
          {/* استخدام prose لضمان تنسيق الـ Markdown (أكواد، قوائم، إلخ) بشكل صحيح */}
          <div className={`prose prose-sm max-w-none ${!isUser ? "prose-invert" : theme === 'dark' ? "prose-invert" : ""}`}>
            <Markdown>{message.content || ""}</Markdown>
          </div>
        </div>

        {/* التوقيت مع معالجة حالة عدم وجود timestamp من الباك اند فوراً */}
        <span className={`text-[10px] px-1 opacity-50 ${isUser ? "text-right" : "text-left"}`}>
          {message.createdAt || message.timestamp 
            ? moment(message.createdAt || message.timestamp).fromNow() 
            : moment().fromNow()}
        </span>
      </div>

      {/* أيقونة المستخدم */}
      {isUser && (
        <img 
          src={assets.user_icon} 
          className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex-shrink-0 object-cover" 
          alt="User" 
        />
      )}
    </div>
  );
};

export default Message;