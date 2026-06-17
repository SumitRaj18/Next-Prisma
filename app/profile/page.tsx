'use client'
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { persistor } from "@/lib/redux/store";
import { removeUser } from "@/lib/redux/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector((state) => state.user.user);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      
      {/* Top Header Navigation bar */}
      <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors group"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">&larr;</span> Back to Feed
          </Link>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Verified Profile
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          
          {/* Decorative Profile Banner Header */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 w-full" />

          {/* Profile Card Contents */}
          <div className="px-6 pb-8 sm:px-12 sm:pb-12 relative">
            
            {/* Avatar positioning overlap */}
            <div className="absolute -top-16 left-6 sm:left-12">
              <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100">
                <div className="w-full h-full rounded-xl bg-indigo-100 text-indigo-700 font-black text-3xl flex items-center justify-center uppercase shadow-inner">
                  {user?.Name ? user.Name.charAt(0) : "U"}
                </div>
              </div>
            </div>

            {/* User Title Information Block */}
            <div className="pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {user?.Name || "Guest Account"}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Full-Stack Platform Member
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all self-start sm:self-center"
              >
                Sign Out
              </button>
            </div>

            {/* Profile Metadata Grid Fields */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Account Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Field: Full Name */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Full Name
                  </span>
                  <span className="text-sm font-medium text-slate-800 mt-1 block">
                    {user?.Name || "Not Provided"}
                  </span>
                </div>

                {/* Field: Email Address */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-slate-800 mt-1 block">
                    {user?.email || "Not Provided"}
                  </span>
                </div>

                {/* Field: Account ID */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    User Identifier Code
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-600 mt-1 block truncate">
                    {user?.id || "Session Token Unassigned"}
                  </span>
                </div>

                {/* Field: Security Status */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Active Session Authentication
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                    {user?.id ? "MERN Stateful Auth Active" : "Unverified Session"}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}