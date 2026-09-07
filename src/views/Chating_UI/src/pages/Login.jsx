import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setShowAuthOverlay }) => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setToken, theme } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectId = 0;
      const endpoint = state === "register" ? `/api/v1/user/register/${projectId}` : `/api/v1/user/login/${projectId}`;
      const payload = state === "register" ? { name, email, password } : { email, password };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.user_id) {
        setToken(data.user_id);
        localStorage.setItem("token", data.user_id);
        toast.success(state === "register" ? "Account Created!" : "Welcome Back!");
        if (setShowAuthOverlay) setShowAuthOverlay(false);
      } else {
        toast.error(data.signal || "Authentication failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.signal || "Connection Error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 m-auto items-start p-8 py-10 w-80 sm:w-[352px] rounded-3xl shadow-2xl border transition-colors animate-in zoom-in duration-300
      ${theme === 'dark' ? 'bg-[#1e1e1e] border-white/5 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
      <p className={`text-2xl font-black m-auto ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        <span className="text-[#1A9BB3]">User</span> {state === "login" ? "Login" : "Sign Up"}
      </p>

      {state === "register" && (
        <div className="w-full">
          <p className="text-xs mb-1 font-medium">Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required 
            className={`border rounded-xl w-full p-2.5 outline-[#1A9BB3] transition-colors
              ${theme === 'dark' ? 'border-white/10 bg-[#252525] text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}`} />
        </div>
      )}

      <div className="w-full">
        <p className="text-xs mb-1 font-medium">Email</p>
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required 
          className={`border rounded-xl w-full p-2.5 outline-[#1A9BB3] transition-colors
              ${theme === 'dark' ? 'border-white/10 bg-[#252525] text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}`} />
      </div>

      <div className="w-full">
        <p className="text-xs mb-1 font-medium">Password</p>
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required 
          className={`border rounded-xl w-full p-2.5 outline-[#1A9BB3] transition-colors
              ${theme === 'dark' ? 'border-white/10 bg-[#252525] text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}`} />
      </div>

      <button type="submit" className="bg-[#1A9BB3] hover:opacity-90 text-white w-full py-3 rounded-xl font-bold mt-2 transition-all active:scale-95 shadow-lg">
        {state === "register" ? "Create Account" : "Login"}
      </button>

      <p className="text-xs m-auto mt-1">
        {state === "register" ? "Already have account?" : "New to UniAsk?"}
        <span onClick={() => setState(state === 'login' ? 'register' : 'login')} className="text-[#1A9BB3] cursor-pointer font-bold ml-1 hover:underline">Click here</span>
      </p>
    </form>
  );
}

export default Login;