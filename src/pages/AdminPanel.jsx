import React, { useState } from 'react';
import { useQueue } from '../hooks/useQueue';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QUEUES = [
  { id: 'canteen', title: 'Canteen' },
  { id: 'admin', title: 'Admin Office' },
  { id: 'library', title: 'Library' },
];

export default function AdminPanel() {
  const [activeQueue, setActiveQueue] = useState(QUEUES[0].id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Control Panel</h1>
        <p className="mt-2 text-slate-600 font-medium">Manage active queues and process students.</p>
      </div>

      {/* Queue Selector */}
      <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        {QUEUES.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQueue(q.id)}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              activeQueue === q.id 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Active Queue Display */}
      <QueueManager queueId={activeQueue} />
    </div>
  );
}

function QueueManager({ queueId }) {
  const { entries, loading, completeInteraction, leaveQueue } = useQueue(queueId);

  if (loading) return <div className="text-slate-500 font-medium">Loading queue data...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 capitalize">{queueId} Queue</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
          {entries.length} waiting
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">Queue is currently empty</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div key={entry.id} className={`p-6 flex items-center justify-between transition-colors hover:bg-slate-50 ${index === 0 ? 'bg-blue-50/50 hover:bg-blue-50' : ''}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    {entry.userName}
                    {index === 0 && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full uppercase tracking-wider font-bold">Next Up</span>}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
                    <Clock className="w-4 h-4 mr-1.5" />
                    Joined {formatDistanceToNow(entry.joinedAt?.toDate() || new Date(), { addSuffix: true })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => completeInteraction(entry.userId)}
                  className="flex items-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-semibold transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 mr-1.5" />
                  Complete
                </button>
                <button
                  onClick={() => {
                    if(window.confirm(`Kick ${entry.userName} from the queue?`)) {
                      leaveQueue(entry.userId);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  title="Remove from queue"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
