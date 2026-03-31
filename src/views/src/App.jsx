
// import './App.css'
// import SideBar from"./components/SideBar"
// import { Route,Routes } from 'react-router-dom'
// import ChatBox from "./components/ChatBox"
// import Cridts from"./pages/Cridts"
// import Community from"./pages/Community"
// function App() {

//   return (
//     <>
//     <div className='dark:bg-gradient-to-b from-[#242124] to=[#000000] dark:text-white'>
//         <div className='flex h_screen w_screen'>
//             <SideBar />
//             <Routes>
//               <Route path='/' element={<ChatBox/>}/>
//               <Route path='/Cridts' element={<Cridts/>}/>
//               <Route path='/Community' element={<Community/>}/>
//             </Routes>
//       </div>
//     </div>
      
//     </>
//   )
// }

// export default App


// import './App.css'
// import SideBar from "./components/SideBar"
// import { Route, Routes, useLocation } from 'react-router-dom'
// import ChatBox from "./components/ChatBox"
// import { useState } from 'react'
// import { assets } from './assets/assets/assets'
// import Loading from './pages/Loading'
// import { useAppContext } from './context/AppContext'
// import Login from './pages/Login'
// function App() {
//   const {user} = useAppContext()
//   const [isMenuOpen,setIsMenuOpen]=useState(false)
//   const {pathname} = useLocation()
//   if (pathname ==='/loading') return <Loading />
//   return (
//     <>

//     {!isMenuOpen && <img src ={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'
//     onClick={()=>setIsMenuOpen(true)}/>}
//     {user ? (<div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
//       <div className='flex h-screen w-screen'>
//         <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
//         <Routes>
//           <Route path='/' element={<ChatBox />} />
//         </Routes>
//       </div>
//     </div>) : (
//       <div className='bg-gradient-to-b from-[#242124] to-[#000000]
//       flex items-center justify-center h-screen w-screen'>
//         <Login />

//       </div>
//     )}
    
//     </>
//   )
// }

// export default App

// import './App.css'
// import SideBar from "./components/SideBar"
// import { Route, Routes, useLocation } from 'react-router-dom'
// import ChatBox from "./components/ChatBox"
// import { useState } from 'react'
// import { assets } from './assets/assets/assets'
// import { useAppContext } from './context/AppContext'
// import Login from './pages/Login'

// function App() {
//   const { user, theme } = useAppContext() 
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <div className={`min-h-screen w-full transition-colors duration-500 
//       ${theme === 'dark' 
//         ? 'bg-[#121212] text-white' 
//         : 'bg-[#F3F4F6] text-[#1a1a1a]'}`}>
      
//       {!isMenuOpen && (
//         <img 
//           src={assets.menu_icon} 
//           className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden z-20 dark:invert-0 invert'
//           onClick={() => setIsMenuOpen(true)}
//         />
//       )}

//       {user ? (
//         <div className='flex h-screen overflow-hidden'>
//           <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
//           <div className="flex-1 h-full overflow-y-auto">
//             <Routes>
//               <Route path='/' element={<ChatBox />} />
//             </Routes>
//           </div>
//         </div>
//       ) : (
//         <div className={`flex items-center justify-center h-screen w-full 
//           ${theme === 'dark' ? 'bg-[#000000]' : 'bg-white'}`}>
//           <Login />
//         </div>
//       )}
//     </div>
//   )
// }
// export default App




// import './App.css'
// import SideBar from "./components/SideBar"
// import { Route, Routes } from 'react-router-dom'
// import ChatBox from "./components/ChatBox"
// import { useState } from 'react'
// import { assets } from './assets/assets/assets'
// import { useAppContext } from './context/AppContext'
// import Login from './pages/Login'

// function App() {
//   const { user, theme } = useAppContext() 
//   // جعلنا الحالة الافتراضية true ليفتح في البداية
//   const [isMenuOpen, setIsMenuOpen] = useState(true)

//   return (
//     <div className={`min-h-screen w-full transition-colors duration-500 
//       ${theme === 'dark' 
//         ? 'bg-[#121212] text-white' 
//         : 'bg-[#F3F4F6] text-[#1a1a1a]'}`}>
      
//       {/* زر القائمة - يظهر دائمًا في الشاشات الكبيرة والصغيرة عند غلق السايد بار */}
//       {!isMenuOpen && (
//         <button 
//           onClick={() => setIsMenuOpen(true)}
//           className="absolute top-4 left-4 z-30 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
//         >
//           <img 
//             src={assets.menu_icon} 
//             className={`w-7 h-7 cursor-pointer ${theme === 'dark' ? 'invert-0' : 'invert'}`}
//             alt="menu"
//           />
//         </button>
//       )}

//       {user ? (
//         <div className='flex h-screen overflow-hidden relative'>
//           {/* السايد بار */}
//           <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          
//           {/* منطقة المحتوى الرئيسي */}
//           <div className={`flex-1 h-full overflow-y-auto transition-all duration-500`}>
//             <Routes>
//               <Route path='/' element={<ChatBox />} />
//             </Routes>
//           </div>
//         </div>
//       ) : (
//         <div className={`flex items-center justify-center h-screen w-full 
//           ${theme === 'dark' ? 'bg-[#000000]' : 'bg-white'}`}>
//           <Login />
//         </div>
//       )}
//     </div>
//   )
// }
// export default App


// import './App.css'
// import SideBar from "./components/SideBar"
// import { Route, Routes, Navigate } from 'react-router-dom'
// import ChatBox from "./components/ChatBox"
// import { useState } from 'react'
// import { assets } from './assets/assets/assets'
// import { useAppContext } from './context/AppContext'
// import Login from './pages/Login'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const { user, theme, token } = useAppContext() 
//   const [isMenuOpen, setIsMenuOpen] = useState(true)
//   const [showAuthOverlay, setShowAuthOverlay] = useState(false)

//   return (
//     <div className={`min-h-screen w-full transition-colors duration-500 
//       ${theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-[#F3F4F6] text-[#1a1a1a]'}`}>
      
//       <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />

//       {/* زرار "الشرط" العائم - يتحرك مع السايد بار ويختفي لونه الأسود عند القفل */}
//       <button 
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//         className={`fixed top-6 z-[60] p-2 transition-all duration-500 ease-in-out
//           ${isMenuOpen ? "left-[235px]" : "left-6"} 
//           hover:scale-110 active:scale-90`}
//       >
//         <img 
//           src={assets.menu_icon} 
//           className={`w-7 h-7 ${theme === 'dark' ? 'invert-0' : 'invert'} opacity-60 hover:opacity-100`} 
//           alt="menu" 
//         />
//       </button>

//       <div className='flex h-screen overflow-hidden relative'>
        
//         {/* السايد بار */}
//         <SideBar 
//           isMenuOpen={isMenuOpen} 
//           setIsMenuOpen={setIsMenuOpen} 
//           setShowAuthOverlay={setShowAuthOverlay} 
//         />
        
//         <div className="flex-1 h-full relative">
          
//           {/* منطقة الشات - تُضبب فقط عند ظهور نافذة اللوجن */}
//           <div className={`h-full transition-all duration-500 ${(showAuthOverlay && !token) ? 'blur-2xl pointer-events-none scale-95' : 'scale-100'}`}>
//             <Routes>
//               <Route path='/' element={<ChatBox />} />
//               <Route path='*' element={<Navigate to="/" />} />
//             </Routes>
//           </div>

//           {/* طبقة الـ Auth Overlay (اللوجن والضباب) */}
//           {showAuthOverlay && !token && (
//             <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-300">
//               <div className="relative animate-in slide-in-from-bottom-5 duration-500">
//                 <button 
//                   onClick={() => setShowAuthOverlay(false)}
//                   className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
//                 >
//                   ✕
//                 </button>
//                 <Login />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App




import './App.css'
import SideBar from "./components/SideBar"
import { Route, Routes, Navigate } from 'react-router-dom'
import ChatBox from "./components/ChatBox"
import { useState } from 'react'
import { assets } from './assets/assets/assets'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, theme, token } = useAppContext() 
  
  // حالة التحكم في فتح وقفل السايد بار
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  
  // حالة التحكم في ظهور نافذة التسجيل وطبقة الضباب
  const [showAuthOverlay, setShowAuthOverlay] = useState(false)

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 
      ${theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-[#F3F4F6] text-[#1a1a1a]'}`}>
      
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />

      {/* زرار "الشرط" (Menu Icon) - يتحرك مع السايد بار ويظهر بدون خلفية عند القفل */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-6 z-[60] p-2 transition-all duration-500 ease-in-out
          ${isMenuOpen ? "left-[235px]" : "left-6"} 
          hover:scale-110 active:scale-90`}
      >
        <img 
          src={assets.menu_icon} 
          className={`w-7 h-7 ${theme === 'dark' ? 'invert-0' : 'invert'} opacity-60 hover:opacity-100`} 
          alt="menu" 
        />
      </button>

      <div className='flex h-screen overflow-hidden relative'>
        
        {/* مكون السايد بار - نمرر له الحالات ودوال التحكم */}
        <SideBar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          setShowAuthOverlay={setShowAuthOverlay} 
        />
        
        <div className="flex-1 h-full relative">
          
          {/* منطقة عرض الشات - تُضبب فقط عند تفعيل الـ Overlay للمستخدم غير المسجل */}
          <div className={`h-full transition-all duration-500 
            ${(showAuthOverlay && !token) ? 'blur-2xl pointer-events-none scale-95' : 'scale-100'}`}>
            <Routes>
              <Route path='/app' element={<ChatBox />} />
              <Route path='/app/c/:chatId' element={<ChatBox />} />
              {/* إعادة توجيه أي مسار غير معروف لصفحة التطبيق */}
              <Route path='*' element={<Navigate to="/app" />} />
            </Routes>
          </div>

          {/* طبقة الـ Auth Overlay (تظهر فوق الشات المضبب) */}
          {showAuthOverlay && !token && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-300">
              <div className="relative animate-in slide-in-from-bottom-5 duration-500">
                
                {/* زر إغلاق نافذة اللوجن والعودة لوضع الـ Guest */}
                <button 
                  onClick={() => setShowAuthOverlay(false)}
                  className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
                >
                  ✕
                </button>

                {/* استدعاء مكون تسجيل الدخول مع تمرير دالة الإغلاق لتنفيذها عند النجاح */}
                <Login setShowAuthOverlay={setShowAuthOverlay} />
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App