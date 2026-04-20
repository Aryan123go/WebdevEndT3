import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../hooks/useQueue';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, Bell, AlertCircle } from 'lucide-react';

export default function QueueStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { entries, loading, joinQueue, leaveQueue, getUserPosition, AVG_WAIT_PER_PERSON_MINS } = useQueue(id);
  
  const [isJoining, setIsJoining] = useState(false);
  const [hasRequestedNotification, setHasRequestedNotification] = useState(false);

  // useMemo: calculate user's specific position and wait time
  const position = useMemo(() => getUserPosition(currentUser?.uid), [entries, currentUser, getUserPosition]);
  
  const isWaiting = position !== null;
  const peopleAhead = position !== null ? position : entries.length;
  const estimatedWait = peopleAhead * AVG_WAIT_PER_PERSON_MINS;

  useEffect(() => {
    // Advanced Feature: Push Notification simulation
    if (isWaiting && position === 0 && !hasRequestedNotification) {
      if (Notification.permission === "granted") {
        new Notification("It's your turn!", {
          body: `You are next in line for the ${id} queue. Please head to the counter.`,
        });
        setHasRequestedNotification(true);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("It's your turn!", {
              body: `You are next in line for the ${id} queue. Please head to the counter.`,
            });
            setHasRequestedNotification(true);
          }
        });
      }
    }
  }, [position, isWaiting, id, hasRequestedNotification]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinQueue(currentUser.uid, currentUser.email.split('@')[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to join queue");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Are you sure you want to leave the queue?")) {
      await leaveQueue(currentUser.uid);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          <h2 className="text-3xl font-bold tracking-tight capitalize relative z-10">{id} Queue</h2>
          <p className="text-blue-100 font-medium mt-2 relative z-10">Live Status Overview</p>
        </div>

        <div className="p-8">
          {!isWaiting ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-6 font-medium text-lg">You are not currently in this queue.</p>
              
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-800">{entries.length}</p>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Waiting</p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-800">~{estimatedWait}</p>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Mins Est</p>
                </div>
              </div>

              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-50"
              >
                {isJoining ? 'Joining...' : 'Join the Queue'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 transform hover:scale-[1.02] transition-transform">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Your Position</p>
                <div className="text-7xl font-black text-blue-700 font-mono tracking-tighter">
                  #{position + 1}
                </div>
                {position === 0 && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-2 rounded-lg font-medium">
                    <Bell className="w-5 h-5 animate-bounce" />
                    <span>You are next! Head to the counter.</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">People Ahead</p>
                  <p className="text-3xl font-bold text-slate-800">{peopleAhead}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Est. Wait</p>
                  <p className="text-3xl font-bold text-slate-800">~{estimatedWait}<span className="text-xl text-slate-400 font-medium">m</span></p>
                </div>
              </div>

              <button
                onClick={handleLeave}
                className="flex items-center justify-center w-full py-3.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition-colors"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Leave Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
