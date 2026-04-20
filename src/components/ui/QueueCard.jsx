import React from 'react';
import { Users, Clock, ArrowRight } from 'lucide-react';

export default function QueueCard({ id, title, waitTime, peopleAhead, onJoin, isJoining }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 mt-1 capitalize">{id} Service</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
          <Users className="w-4 h-4" />
          <span>{peopleAhead} <span className="opacity-75 font-medium">waiting</span></span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Clock className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Est. Wait Time</p>
          <p className="text-2xl font-black text-slate-800">
            ~{waitTime} <span className="text-lg font-semibold text-slate-400 tracking-normal">mins</span>
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => onJoin(id)}
        disabled={isJoining}
        className="w-full flex items-center justify-center space-x-2 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        <span>{isJoining ? 'Joining...' : 'Join Queue'}</span>
        {!isJoining && <ArrowRight className="w-5 h-5" />}
      </button>
    </div>
  );
}
