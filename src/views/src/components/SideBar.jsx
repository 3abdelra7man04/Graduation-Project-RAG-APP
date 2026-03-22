// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// const SideBar = ()=>{
//     const {chats,setSelectChat,theme,setTheme,user}=useAppContext()
//     const [search,setSearch]=useState("")
//     return(
//         <div className="flex flex-col hscreen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609f]/30 backdrop-blur-3x1 transition-all duration-500 max-md:absolute left-0 z-1">
//             <img src={theme ==="dark"? assets.logo_full : assets.logo_full_dark} className="w-full max-w-48"/>
//             <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81f6] text-sm rounded-md cursor-pointer">
//                 <span className="mr-2 text-x1">+</span>New Chat
//             </button>

//             <div className="flex item-center gap-2 p-3 mt-4 border border-gray-400 dark:border-wite/20 rounded-md">
//                 <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
//                 <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text" placeholder="Search Conversation"
//                 className="text-xs placeholder:text-gray-400 outline-none"/>
//             </div>


//             {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

//             <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
//             {chats
//                 .filter((chat) =>
//                 chat.messages[0]
//                     ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
//                     : chat.name.toLowerCase().includes(search.toLowerCase())
//                 )
//                 .map((chat) => (
//                 <div
//                     key={chat._id}
//                     className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#8069F]/15 rounded-md cursor-pointer flex justify-between group"
//                 >
//                     <div>
//                     <p className="truncate w-full">
//                         {chat.messages.length > 0
//                         ? chat.messages[0].content.slice(0, 32)
//                         : chat.name}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
//                         {moment(chat.updatedAt).fromNow()}
//                     </p>
//                     </div>
//                     <img src={assets.bin_icon} className="hidden group-hover:block w-4 cursor-pointer not-dark:invert" alt="" />
//                 </div>
//                 ))}
//             </div>


//                 <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
//                 <div className="flex items-center gap-2 text-sm">
//                     <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
//                     <p>Dark Mode</p>
//                 </div>
//                 <label className="relative inline-flex cursor-pointer">
//                     <input type="checkBox"
//                     onChange={()=>setTheme(theme==="dark"?"light":"dark")} 
//                     className="sr-only pear" checked={theme==="dark"} />
//                     <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all">


//                     </div>
//                     <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>


//                 </label>

//                 </div>

//         </div>
//     );
// }
// export  default SideBar


// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";
// import { Navigate } from "react-router-dom";

// const SideBar = ({isMenuOpen,setIsMenuOpen}) => {
//   const { chats, setSelectChat, theme, setTheme ,user } = useAppContext();
//   const [search, setSearch] = useState("");

//   return (
//     <div className={`flex flex-col h-screen min-w-72 p-5
//      dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
//      border-r border-[#80609f]/30 backdrop-blur-3xl transition-all
//       duration-500 max-md:absolute left-0 z-1
//        ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
//       {/* <img
//         src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
//         className="w-full max-w-48"
//         alt="Logo"
//       /> */}

//       <p
//   className={`
//     font-bold 
//     text-4xl 
//     ${theme === "dark" ? "text-white" : "text-purple-700"}
//   `}
// >
//   UniAsk
// </p>


//       <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81f6] text-sm rounded-md cursor-pointer">
//         <span className="mr-2 text-xl">+</span> New Chat
//       </button>

//       <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
//         <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
//         <input
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//           type="text"
//           placeholder="Search Conversation"
//           className="text-xs placeholder:text-gray-400 outline-none bg-transparent w-full"
//         />
//       </div>

//       {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

//       <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
//         {chats
//           .filter((chat) =>
//             chat.messages[0]
//               ? chat.messages[0]?.content
//                   .toLowerCase()
//                   .includes(search.toLowerCase())
//               : chat.name.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((chat) => (
//             <div

//               key={chat._id}
//               className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#8069F0]/15 rounded-md cursor-pointer flex justify-between group"
//               onClick={() => {setSelectChat(chat);
//                  setIsMenuOpen(false)}}
//             >
//               <div>
//                 <p className="truncate w-full">
//                   {chat.messages.length > 0
//                     ? chat.messages[0].content.slice(0, 32)
//                     : chat.name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
//                   {moment(chat.updatedAt).fromNow()}
//                 </p>
//               </div>
//               <img
//                 src={assets.bin_icon}
//                 className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
//                 alt="Delete"
//               />
//             </div>
//           ))}
//       </div>

//       {/* Theme Toggle */}
//       <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
//         <div className="flex items-center gap-2 text-sm">
//           <img src={assets.theme_icon} className="w-4 dark:invert" alt="" />
//           <p>Dark Mode</p>
//         </div>
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="sr-only peer"
//             checked={theme === "dark"}
//           />
//           <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
//           <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
//         </label>
//       </div>

//       <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded cursor-pointer group">
//   <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
//   <p className="flex-1 text-sm dark:text-primary truncate">
//     {user ? user.name : 'login your account'}
//   </p>
//   {user && (
//     <img
//       src={assets.logout_icon}
//       className="h-5 cursor-pointer hidden dark:invert group-hover:block"
//       alt="Logout"
//     />
//   )}
// </div>

//         <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon} className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"/>
//     </div>
//   );
// };

// export default SideBar;




// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";

// const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
//   const { chats, setSelectChat, theme, setTheme, user } = useAppContext();
//   const [search, setSearch] = useState("");

//   return (
//     <div
//       className={`flex flex-col h-screen min-w-72 p-5
//      dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
//      border-r border-[#80609f]/30 backdrop-blur-3xl transition-all
//       duration-500 max-md:absolute left-0 z-1
//        ${!isMenuOpen && "max-md:-translate-x-full"}`}
//     >
//        <img
//         src={theme === "dark" ? assets.new_logo : assets.new_logo}
//         alt=""
//         className="w-25 mx-auto"
//       />

//       <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] text-sm rounded-md cursor-pointer">
//         <span className="mr-2 text-xl">+</span> New Chat
//       </button>

//       <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
//         <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
//         <input
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//           type="text"
//           placeholder="Search Conversation"
//           className="text-xs placeholder:text-gray-400 outline-none bg-transparent w-full"
//         />
//       </div>

//       {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

//       <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
//         {chats
//           .filter((chat) =>
//             chat.messages[0]
//               ? chat.messages[0]?.content
//                   .toLowerCase()
//                   .includes(search.toLowerCase())
//               : chat.name.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((chat) => (
//             <div
//               key={chat._id}
//               className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#8069F0]/15 rounded-md cursor-pointer flex justify-between group"
//               onClick={() => {
//                 setSelectChat(chat);
//                 setIsMenuOpen(false);
//               }}
//             >
//               <div>
//                 <p className="truncate w-full">
//                   {chat.messages.length > 0
//                     ? chat.messages[0].content.slice(0, 32)
//                     : chat.name}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
//                   {moment(chat.updatedAt).fromNow()}
//                 </p>
//               </div>
//               <img
//                 src={assets.bin_icon}
//                 className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
//                 alt="Delete"
//               />
//             </div>
//           ))}
//       </div>

//       <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
//         <div className="flex items-center gap-2 text-sm">
//           <img src={assets.theme_icon} className="w-4 dark:invert" alt="" />
//           <p>Dark Mode</p>
//         </div>
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="sr-only peer"
//             checked={theme === "dark"}
//           />
//           <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-[#1A9BB3] transition-all"></div>
//           <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
//         </label>
//       </div>

//       <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded cursor-pointer group">
//         <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
//         <p className="flex-1 text-sm dark:text-primary truncate">
//           {user ? user.name : "login your account"}
//         </p>
//         {user && (
//           <img
//             src={assets.logout_icon}
//             className="h-5 cursor-pointer hidden dark:invert group-hover:block"
//             alt="Logout"
//           />
//         )}
//       </div>

//       <img
//         onClick={() => setIsMenuOpen(false)}
//         src={assets.close_icon}
//         className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
//       />
//     </div>
//   );
// };

// export default SideBar;


// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";

// const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
//   const { chats, setSelectChat, theme, setTheme, user } = useAppContext();
//   const [search, setSearch] = useState("");

//   return (
//     <div
//       className={`flex flex-col h-screen min-w-72 p-5 
//       /* خلفية فاتحة مريحة مع حدود ناعمة */
//       bg-[#F9FAFB] dark:bg-[#121212] 
//       border-r border-gray-200 dark:border-white/10 transition-all
//       duration-500 max-md:absolute left-0 z-10
//       ${!isMenuOpen && "max-md:-translate-x-full"}`}
//     >
//       {/* الشعار */}
//       <img
//         src={assets.new_logo}
//         alt="Logo"
//         className="w-28 mx-auto"
//       />

//       {/* زر المحادثة الجديدة - لون أزرق ملكي عصري */}
//       <button className="flex justify-center items-center w-full py-2.5 mt-8 text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-lg transition-all text-sm font-semibold rounded-lg cursor-pointer">
//         <span className="mr-2 text-xl">+</span> New Chat
//       </button>

//       {/* حقل البحث - خلفية رمادية فاتحة جداً */}
//       <div className="flex items-center gap-2 p-3 mt-6 bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-lg shadow-sm">
//         <img src={assets.search_icon} className="w-4 opacity-40 not-dark:invert" alt="" />
//         <input
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//           type="text"
//           placeholder="Search conversations..."
//           className="text-sm placeholder:text-gray-400 outline-none bg-transparent w-full text-gray-700 dark:text-gray-200"
//         />
//       </div>

//       {/* عنوان القائمة */}
//       {chats.length > 0 && (
//         <p className="mt-6 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
//           Recent History
//         </p>
//       )}

//       {/* قائمة المحادثات */}
//       <div className="flex-1 overflow-y-auto mt-2 space-y-2 custom-scrollbar">
//         {chats
//           .filter((chat) =>
//             chat.messages[0]
//               ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
//               : chat.name.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((chat) => (
//             <div
//               key={chat._id}
//               className="p-3 px-4 bg-white hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-100 dark:border-transparent rounded-xl cursor-pointer flex justify-between items-center group transition-all"
//               onClick={() => {
//                 setSelectChat(chat);
//                 setIsMenuOpen(false);
//               }}
//             >
//               <div className="flex-1 min-w-0">
//                 <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
//                   {chat.messages.length > 0
//                     ? chat.messages[0].content.slice(0, 35)
//                     : chat.name}
//                 </p>
//                 <p className="text-[11px] text-gray-400 mt-1">
//                   {moment(chat.updatedAt).format('LT')}
//                 </p>
//               </div>
//               <img
//                 src={assets.bin_icon}
//                 className="hidden group-hover:block w-3.5 h-3.5 opacity-50 hover:opacity-100 hover:scale-110 transition-all not-dark:invert"
//                 alt="Delete"
//               />
//             </div>
//           ))}
//       </div>

//       {/* قسم الإعدادات (Dark Mode) */}
//       <div className="mt-auto pt-4">
//         <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
//           <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
//             <img src={assets.theme_icon} className="w-4 opacity-70 not-dark:invert" alt="" />
//             <span>Dark Mode</span>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="sr-only peer"
//               checked={theme === "dark"}
//             />
//             <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
//           </label>
//         </div>

//         {/* بروفايل المستخدم */}
//         <div className="flex items-center gap-3 p-3 mt-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
//           <div className="relative">
//             <img src={assets.user_icon} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt="" />
//             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
//               {user ? user.name : "Guest User"}
//             </p>
//             <p className="text-[11px] text-gray-500 truncate">
//               {user ? "Online" : "Login to sync"}
//             </p>
//           </div>
//           {user && (
//             <img
//               src={assets.logout_icon}
//               className="h-4 w-4 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all not-dark:invert"
//               alt="Logout"
//             />
//           )}
//         </div>
//       </div>

//       {/* زر الإغلاق للموبايل */}
//       <img
//         onClick={() => setIsMenuOpen(false)}
//         src={assets.close_icon}
//         className="absolute top-5 right-5 w-5 h-5 cursor-pointer md:hidden opacity-40 hover:opacity-100 not-dark:invert"
//       />
//     </div>
//   );
// };

// export default SideBar;







// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";

// const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
//   const { chats, setSelectChat, theme, setTheme, user } = useAppContext();
//   const [search, setSearch] = useState("");

//   return (
//     <div
//       className={`flex flex-col h-screen min-w-72 p-5 
//       /* خلفية فاتحة جداً (Off-white) لراحة العين */
//       bg-[#F8FAFC] dark:bg-[#121212] 
//       border-r border-gray-200 dark:border-white/10 transition-all
//       duration-500 max-md:absolute left-0 z-10
//       ${!isMenuOpen && "max-md:-translate-x-full"}`}
//     >
//       {/* الشعار - تم تصغيره ليتناسب مع الواجهة الفاتحة */}
//       {/* UniAsk Text Logo */}
// <div className="mx-auto flex flex-col items-center">
//   <p className="text-2xl font-black tracking-tighter">
//     <span className="text-gray-800 dark:text-white">Uni</span>
//     <span className="bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">
//       Ask
//     </span>
//   </p>
//   {/* خط زخرفي صغير جداً تحت الاسم ليعطي مظهر الـ Brand */}
//   <div className="w-6 h-1 bg-[#1A9BB3] rounded-full mt-[-2px] opacity-80"></div>
// </div>

//       {/* زر المحادثة الجديدة - لون أزرق جذاب */}
//       <button className="flex justify-center items-center w-full py-2.5 mt-8 text-white bg-[#1A9BB3] hover:bg-[#158296] shadow-sm hover:shadow-md transition-all text-sm font-bold rounded-xl cursor-pointer">
//         <span className="mr-2 text-xl">+</span> New Chat
//       </button>

//       {/* حقل البحث - أبيض صريح ليبرز عن الخلفية الرمادية */}
//       <div className="flex items-center gap-2 p-3 mt-6 bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl shadow-sm focus-within:border-[#1A9BB3]/50 transition-all">
//         <img src={assets.search_icon} className="w-4 opacity-30 not-dark:invert" alt="" />
//         <input
//           onChange={(e) => setSearch(e.target.value)}
//           value={search}
//           type="text"
//           placeholder="Search chats..."
//           className="text-sm placeholder:text-gray-400 outline-none bg-transparent w-full text-gray-700 dark:text-gray-200"
//         />
//       </div>

//       {/* عنوان القائمة */}
//       {chats.length > 0 && (
//         <p className="mt-8 text-[11px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500 px-1">
//           Recent Activity
//         </p>
//       )}

//       {/* قائمة المحادثات */}
//       <div className="flex-1 overflow-y-auto mt-3 space-y-2 custom-scrollbar">
//         {chats
//           .filter((chat) =>
//             chat.messages[0]
//               ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
//               : chat.name.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((chat) => (
//             <div
//               key={chat._id}
//               className="p-3 px-4 bg-transparent hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:bg-white/5 rounded-xl cursor-pointer flex justify-between items-center group transition-all"
//               onClick={() => {
//                 setSelectChat(chat);
//                 setIsMenuOpen(false);
//               }}
//             >
//               <div className="flex-1 min-w-0">
//                 <p className="truncate text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-[#1A9BB3] transition-colors">
//                   {chat.messages.length > 0
//                     ? chat.messages[0].content.slice(0, 30)
//                     : chat.name}
//                 </p>
//                 <p className="text-[10px] text-gray-400 mt-1 font-medium">
//                   {moment(chat.updatedAt).format('ll')}
//                 </p>
//               </div>
//               <img
//                 src={assets.bin_icon}
//                 className="hidden group-hover:block w-3.5 h-3.5 opacity-40 hover:opacity-100 hover:scale-110 transition-all not-dark:invert"
//                 alt="Delete"
//               />
//             </div>
//           ))}
//       </div>

//       {/* قسم الإعدادات (Dark Mode) */}
//       <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
//         <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
//           <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
//             <img src={assets.theme_icon} className="w-4 opacity-50 not-dark:invert" alt="" />
//             <span>Dark Mode</span>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="sr-only peer"
//               checked={theme === "dark"}
//             />
//             <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A9BB3]"></div>
//           </label>
//         </div>

//         {/* بروفايل المستخدم */}
//         <div className="flex items-center gap-3 p-3 mt-4 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 hover:shadow-sm transition-all cursor-pointer group">
//           <div className="relative">
//             <img src={assets.user_icon} className="w-9 h-9 rounded-full border border-gray-100 shadow-sm" alt="" />
//             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-extrabold text-gray-700 dark:text-white truncate">
//               {user ? user.name : "Guest User"}
//             </p>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
//               {user ? "Active Now" : "Sign in"}
//             </p>
//           </div>
//           {user && (
//             <img
//               src={assets.logout_icon}
//               className="h-4 w-4 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all not-dark:invert"
//               alt="Logout"
//             />
//           )}
//         </div>
//       </div>

//       {/* زر الإغلاق للموبايل */}
//       <img
//         onClick={() => setIsMenuOpen(false)}
//         src={assets.close_icon}
//         className="absolute top-6 right-6 w-4 h-4 cursor-pointer md:hidden opacity-30 hover:opacity-100 not-dark:invert"
//       />
//     </div>
//   );
// };

// export default SideBar;







// import React, { useState, useRef, useEffect } from "react"; // أضفنا useRef و useEffect
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";

// const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
//   const { chats, setSelectChat, theme, setTheme, user, logout } = useAppContext(); // تأكد من وجود logout في الـ context
//   const [search, setSearch] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false); // حالة لفتح وإغلاق قائمة البروفايل
//   const menuRef = useRef(null);

//   // إغلاق القائمة عند الضغط خارجها
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className={`flex flex-col h-screen transition-all duration-500 ease-in-out z-20 
//       ${theme === 'dark' 
//         ? 'bg-[#121212] border-white/10 text-white' 
//         : 'bg-white border-gray-200 text-gray-800'} 
//       border-r relative
//       ${isMenuOpen ? "w-72 p-5 opacity-100" : "w-0 p-0 opacity-0 pointer-events-none border-none"}
//       max-md:absolute left-0 
//       ${!isMenuOpen && "max-md:-translate-x-full"}
//     `}>
      
//       {/* زر الإغلاق */}
//       {isMenuOpen && (
//         <button 
//           onClick={() => setIsMenuOpen(false)}
//           className="absolute top-5 right-4 hover:scale-110 transition-transform"
//         >
//           <img 
//             src={assets.menu_icon} 
//             className={`w-6 h-6 opacity-60 ${theme === 'dark' ? 'invert-0' : 'invert'}`} 
//             alt="close" 
//           />
//         </button>
//       )}

//       {/* محتوى السايد بار العلوي */}
//       <div className={`${!isMenuOpen ? "hidden" : "block"} min-w-[240px]`}>
//         <div className="flex items-center gap-3">
//           <img src={assets.logoooooo} alt="Logo" className="w-16 h-16 md:w-13 md:h-13 object-contain" />
//           <div className="flex flex-col leading-tight">
//             <p className="text-2xl font-black tracking-tighter">
//               <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Minia</span>
//             </p>
//             <p className="text-sm font-bold tracking-wide uppercase -mt-1">
//               <span className="bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">University</span>
//             </p>
//           </div>
//         </div>

//         <button className={`flex justify-center items-center w-full py-2.5 mt-8 font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg active:scale-95
//           ${theme === 'dark' ? 'bg-[#1A9BB3] hover:bg-[#158296] text-white' : 'bg-[#1A9BB3] hover:bg-[#147e92] text-white'}`}>
//           <span className="mr-2 text-xl font-light">+</span> 
//           <span className="text-sm tracking-wide">New Chat</span>
//         </button>

//         <div className={`flex items-center gap-2 px-3 py-2.5 mt-6 border transition-all duration-300 rounded-xl
//           ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#F3F4F6] border-gray-200'}`}>
//           <img src={assets.search_icon} className={`w-4 ${theme === 'dark' ? 'opacity-40' : 'opacity-60 invert'}`} alt="search" />
//           <input
//             onChange={(e) => setSearch(e.target.value)}
//             value={search}
//             type="text"
//             placeholder="Search chats..."
//             className="text-sm outline-none bg-transparent w-full font-medium"
//           />
//         </div>
//       </div>

//       {/* قائمة الشات */}
//       <div className={`flex-1 overflow-y-auto mt-8 space-y-1 custom-scrollbar ${!isMenuOpen && "hidden"}`}>
//         {chats
//           .filter(c => (c.messages[0]?.content || c.name).toLowerCase().includes(search.toLowerCase()))
//           .map((chat) => (
//           <div
//             key={chat._id}
//             className={`p-3 px-4 rounded-xl cursor-pointer flex justify-between items-center group transition-all
//               ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
//             onClick={() => { setSelectChat(chat); if(window.innerWidth < 768) setIsMenuOpen(false); }}
//           >
//             <div className="flex-1 min-w-0">
//               <p className={`truncate text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 30) : chat.name}
//               </p>
//               <p className="text-[10px] text-gray-400 mt-1">{moment(chat.updatedAt).format('ll')}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* المنطقة السفلية المعدلة */}
//       <div className={`mt-auto pt-4 border-t relative ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} ${!isMenuOpen && "hidden"}`} ref={menuRef}>
        
//         {/* القائمة المنبثقة (Popup Menu) */}
//         {showProfileMenu && (
//           <div className={`absolute bottom-full left-0 w-full mb-2 p-2 rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-2
//             ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
            
//             {/* خيار Mode داخل القائمة */}
//             <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
//               <div className="flex items-center gap-3 text-sm font-bold">
//                 <img src={assets.theme_icon} className={`w-4 ${theme === 'dark' ? '' : 'invert'}`} alt="theme" />
//                 <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Dark Mode</span>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" onChange={() => setTheme(theme === "dark" ? "light" : "dark")} className="sr-only peer" checked={theme === "dark"} />
//                 <div className="w-8 h-4 bg-gray-300 rounded-full peer-checked:bg-[#1A9BB3] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
//               </label>
//             </div>

//             {/* زر Logout */}
//             {/* زر Logout */}
// <div 
//   onClick={() => logout && logout()} 
//   className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent
//     ${theme === 'dark' 
//       ? 'hover:bg-red-500/10 text-red-400' 
//       : 'hover:bg-red-50 text-red-500'}`}
// >
//   {/* أيقونة الخروج - تأكد من وجود logout_icon في assets أو استخدم أيقونة مناسبة */}
//   <img 
//     src={assets.logout_icon || assets.menu_icon} 
//     className={`w-4 h-4 ${theme === 'dark' ? '' : 'invert'} opacity-80`} 
//     alt="logout" 
//   />
  
//   <span className="text-sm font-bold tracking-wide">
//     Logout
//   </span>
// </div>
//           </div>
//         )}

//         {/* زر البروفايل الذي يفتح القائمة */}
//         <div 
//           onClick={() => setShowProfileMenu(!showProfileMenu)}
//           className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border
//           ${theme === 'dark' 
//             ? 'hover:bg-white/5 border-transparent active:bg-white/10' 
//             : 'hover:bg-gray-50 border-transparent active:bg-gray-100'}
//           ${showProfileMenu && (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}`}
//         >
//           <img src={assets.user_icon} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" alt="user" />
//           <div className="flex-1 min-w-0">
//             <p className={`text-xs font-extrabold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
//               {user?.name || "Guest User"}
//             </p>
//           </div>
//           <span className={`text-[10px] transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}>▼</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;



// import React, { useState, useRef, useEffect } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets/assets";
// import moment from "moment";

// const SideBar = ({ isMenuOpen, setIsMenuOpen, setShowAuthOverlay }) => {
//   const { chats, setSelectChat, theme, setTheme, user, logout, createNewChat } = useAppContext();
//   const [search, setSearch] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className={`flex flex-col h-screen transition-all duration-500 ease-in-out z-40 
//       ${isMenuOpen 
//         ? (theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-200') 
//         : 'bg-transparent border-transparent'} 
      
//       border-r relative
//       ${isMenuOpen ? "w-72 p-5 opacity-100" : "w-0 p-0 opacity-0 pointer-events-none"}
//       max-md:absolute left-0 
//       ${!isMenuOpen && "max-md:-translate-x-full"}
//     `}
//     >
//       <div className={`${!isMenuOpen ? "hidden" : "block"} min-w-[240px] h-full flex flex-col`}>
//         {/* Logo & Header */}
//         <div className="flex items-center gap-3">
//           <img src={assets.logoooooo} alt="Logo" className="w-13 h-13 object-contain" />
//           <div className="flex flex-col leading-tight">
//             <p className="text-2xl font-black tracking-tighter">
//               <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Minia</span>
//             </p>
//             <p className="text-sm font-bold tracking-wide uppercase -mt-1 bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">
//               University
//             </p>
//           </div>
//         </div>

//         {/* New Chat Button */}
//         <button 
//           onClick={() => user ? createNewChat() : setShowAuthOverlay(true)}
//           className="flex justify-center items-center w-full py-2.5 mt-8 font-bold rounded-xl bg-[#1A9BB3] hover:opacity-90 text-white shadow-lg active:scale-95 transition-all"
//         >
//           <span className="mr-2 text-xl font-light">+</span> New Chat
//         </button>

//         {/* Search Input */}
//         <div className={`flex items-center gap-2 px-3 py-2.5 mt-6 border rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#F3F4F6] border-gray-200'}`}>
//           <img src={assets.search_icon} className="w-4 opacity-40" alt="search" />
//           <input
//             onChange={(e) => setSearch(e.target.value)}
//             value={search}
//             type="text"
//             placeholder="Search chats..."
//             className="text-sm outline-none bg-transparent w-full font-medium"
//           />
//         </div>

//         {/* Chats List */}
//         <div className="flex-1 overflow-y-auto mt-8 space-y-1 custom-scrollbar">
//           {chats && chats
//             .filter(c => (c.messages?.[0]?.content || c.name || "").toLowerCase().includes(search.toLowerCase()))
//             .map((chat) => (
//               <div
//                 key={chat._id}
//                 className={`p-3 px-4 rounded-xl cursor-pointer flex justify-between items-center transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
//                 onClick={() => { setSelectChat(chat); if (window.innerWidth < 768) setIsMenuOpen(false); }}
//               >
//                 <p className={`truncate text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                    {chat.messages?.length > 0 ? chat.messages[0].content.slice(0, 30) : chat.name || "New Chat"}
//                 </p>
//               </div>
//             ))}
//         </div>

//         {/* User Footer */}
//         <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`} ref={menuRef}>
//           <div 
//             onClick={() => user ? setShowProfileMenu(!showProfileMenu) : setShowAuthOverlay(true)}
//             className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
//           >
//             <img src={user?.image || assets.user_icon} className="w-8 h-8 rounded-full border border-gray-200" alt="user" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-extrabold truncate">{user ? user.name : "Login account"}</p>
//             </div>
//             {user && <img src={assets.logout_icon} onClick={logout} className="w-4 h-4 opacity-40" alt="logout" />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;




import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";
import moment from "moment";

const SideBar = ({ isMenuOpen, setIsMenuOpen, setShowAuthOverlay }) => {
  const { 
    chats, 
    selectChat, 
    setSelectChat, 
    theme, 
    setTheme, 
    user, 
    token, 
    logout, 
    createNewChat, 
    getChatMessages 
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // دالة استخراج أول حرفين من الاسم
  const getInitials = (name) => {
    if (!name) return "GU";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-500 ease-in-out z-20 
      ${theme === 'dark' 
        ? 'bg-[#121212] border-white/10 text-white' 
        : 'bg-white border-gray-200 text-gray-800'} 
      border-r relative
      ${isMenuOpen ? "w-72 p-5 opacity-100" : "w-0 p-0 opacity-0 pointer-events-none border-none"}
      max-md:absolute left-0 
      ${!isMenuOpen && "max-md:-translate-x-full"}
    `}
    >
      <div className={`${!isMenuOpen ? "hidden" : "block"} min-w-[240px] flex flex-col h-full`}>
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img src={assets.logoooooo} alt="Logo" className="w-16 h-16 md:w-13 md:h-13 object-contain" />
          <div className="flex flex-col leading-tight">
            <p className="text-2xl font-black tracking-tighter">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Minia</span>
            </p>
            <p className="text-sm font-bold tracking-wide uppercase -mt-1">
              <span className="bg-gradient-to-r from-[#1A9BB3] to-[#3D81F6] bg-clip-text text-transparent">University</span>
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={() => (token || user) ? createNewChat() : setShowAuthOverlay(true)}
          className={`flex justify-center items-center w-full py-2.5 mt-8 font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg active:scale-95
          ${theme === 'dark' ? 'bg-[#1A9BB3] hover:bg-[#158296] text-white' : 'bg-[#1A9BB3] hover:bg-[#147e92] text-white'}`}
        >
          <span className="mr-2 text-xl font-light">+</span> 
          <span className="text-sm tracking-wide">New Chat</span>
        </button>

        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2.5 mt-6 border transition-all duration-300 rounded-xl
          ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#F3F4F6] border-gray-200'}`}>
          <img src={assets.search_icon} className={`w-4 ${theme === 'dark' ? 'opacity-40' : 'opacity-60 invert'}`} alt="search" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            placeholder="Search chats..."
            className="text-sm outline-none bg-transparent w-full font-medium"
          />
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto mt-8 space-y-1 custom-scrollbar">
          {(token || user) && chats && chats
            .filter(c => (c.name || "").toLowerCase().includes(search.toLowerCase()))
            .map((chat) => (
              <div
                key={chat._id}
                className={`p-3 px-4 rounded-xl cursor-pointer flex justify-between items-center transition-all
                  ${selectChat?._id === chat._id 
                    ? (theme === 'dark' ? 'bg-white/10' : 'bg-gray-100') 
                    : (theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}
                onClick={() => { 
                  setSelectChat(chat); 
                  getChatMessages(chat._id); 
                  if (window.innerWidth < 768) setIsMenuOpen(false); 
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className={`truncate text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {chat.name || "New Chat"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{moment(chat.updatedAt).format('ll')}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Footer Profile Section */}
        <div className="mt-auto pt-4 border-t relative" ref={menuRef}>
          {showProfileMenu && (token || user) && (
            <div className={`absolute bottom-full left-0 w-full mb-2 p-2 rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-2
              ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
              
              {/* خيار Dark Mode - تمت إعادته هنا */}
              <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <img src={assets.theme_icon} className={`w-4 ${theme === 'dark' ? '' : 'invert'}`} alt="theme" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" onChange={() => setTheme(theme === "dark" ? "light" : "dark")} className="sr-only peer" checked={theme === "dark"} />
                  <div className="w-8 h-4 bg-gray-300 rounded-full peer-checked:bg-[#1A9BB3] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>

              {/* زر Logout */}
              <div onClick={() => { if(typeof logout === 'function') logout(); setShowProfileMenu(false); }} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent
                  ${theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
                <img src={assets.logout_icon || assets.menu_icon} className={`w-4 h-4 ${theme === 'dark' ? '' : 'invert'} opacity-80`} alt="logout" />
                <span className="text-sm font-bold tracking-wide">Logout</span>
              </div>
            </div>
          )}

          <div 
            onClick={() => (token || user) ? setShowProfileMenu(!showProfileMenu) : setShowAuthOverlay(true)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border
            ${theme === 'dark' 
              ? 'hover:bg-white/5 border-transparent active:bg-white/10' 
              : 'hover:bg-gray-50 border-transparent active:bg-gray-100'}
            ${showProfileMenu && (theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}`}
          >
            {/* الدائرة الملونة بالحروف الأولى */}
            <div className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#1A9BB3] to-[#3D81F6] text-white text-xs font-bold shadow-sm border border-white/20">
              {getInitials(user?.name)}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-xs font-extrabold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                {(token || user) ? (user?.name || "Loading...") : "Login account"}
              </p>
            </div>
            {(token || user) && <span className={`text-[10px] transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}>▼</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;