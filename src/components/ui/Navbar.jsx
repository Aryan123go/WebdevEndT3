import React from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const { currentUser, userRole } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold tracking-tight text-slate-800">
              SmartQueue
            </span>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900">
                  {currentUser.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                  {userRole}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
