"use client"
import React from 'react'

import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { removeUser } from '@/lib/redux/userSlice';
import { persistor } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Headers = () => {
    const dispatch = useAppDispatch();
    const router= useRouter();
     const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.data.success) {
        dispatch(removeUser());
        await persistor.purge();
        router.push('/login');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const user = useAppSelector((user)=>user.user.user)
  return (
    <div>
      <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DevSpace
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Signed in as</p>
              <Link href={'/profile'} className="text-sm font-semibold text-slate-700">{user?.Name || "Guest User"}</Link>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Headers
