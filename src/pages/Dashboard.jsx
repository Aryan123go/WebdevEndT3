import React, { useState, useEffect } from 'react';
import QueueCard from '../components/ui/QueueCard';
import { useAuth } from '../contexts/AuthContext';
import { useQueue } from '../hooks/useQueue';
import { useNavigate } from 'react-router-dom';

const QUEUES = [
  { id: 'canteen', title: 'Campus Canteen' },
  { id: 'admin', title: 'Admin Office / Fees' },
  { id: 'library', title: 'Library Services' },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // For students to just see an overview of lengths, 
  // maybe we don't fetch all individually in a big app, but for MVP we can.
  // Instead, let's just make the user join the queue directly.
  
  const [joiningId, setJoiningId] = useState(null);

  const handleJoin = (queueId) => {
    navigate(`/queue/${queueId}`);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Queues</h1>
        <p className="mt-2 text-slate-600 font-medium">
          Welcome back, {currentUser.displayName || currentUser.email.split('@')[0]}! Select a service to join the virtual line.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUEUES.map((q) => (
          <QueueCardWrapper 
            key={q.id} 
            queue={q} 
            onJoin={handleJoin} 
          />
        ))}
      </div>
    </div>
  );
}

// A wrapper component to fetch individual queue data
function QueueCardWrapper({ queue, onJoin }) {
  const { entries, AVG_WAIT_PER_PERSON_MINS } = useQueue(queue.id);
  const peopleAhead = entries.length;
  const waitTime = peopleAhead * AVG_WAIT_PER_PERSON_MINS;

  return (
    <QueueCard
      id={queue.id}
      title={queue.title}
      waitTime={waitTime}
      peopleAhead={peopleAhead}
      onJoin={onJoin}
    />
  );
}
