import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, orderBy, onSnapshot, serverTimestamp, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useQueue(queueId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useMemo: Calculate average wait time (could also come from the queue doc itself)
  // For simplicity, we assume average is 2 minutes
  const AVG_WAIT_PER_PERSON_MINS = 2;

  // useEffect: Real-time listener for this specific queue
  useEffect(() => {
    if (!queueId) {
      setLoading(false);
      return;
    }

    // We only use one where() clause here to avoid Firebase requiring a Composite Index, 
    // which causes the query to fail silently if the index isn't built in the Firebase Console.
    const q = query(
      collection(db, "queueEntries"),
      where("queueId", "==", queueId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let waitlist = [];
      querySnapshot.forEach((doc) => {
        waitlist.push({ id: doc.id, ...doc.data() });
      });

      // Filter and sort securely on the client-side
      waitlist = waitlist.filter(entry => entry.status === "waiting");
      
      waitlist.sort((a, b) => {
        // Handle serverTimestamps that might initially be null while writing
        const timeA = a.joinedAt?.toMillis() || Date.now();
        const timeB = b.joinedAt?.toMillis() || Date.now();
        return timeA - timeB;
      });

      setEntries(waitlist);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setError("Failed to fetch queue");
      setLoading(false);
    });

    return unsubscribe;
  }, [queueId]);

  // useCallback: Memoized function to join the queue so it doesn't cause unnecessary re-renders
  const joinQueue = useCallback(async (userId, userName) => {
    try {
      const docId = `${queueId}_${userId}`;
      await setDoc(doc(db, "queueEntries", docId), {
        queueId,
        userId,
        userName,
        joinedAt: serverTimestamp(),
        status: "waiting"
      });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Could not join queue limit reached or error");
    }
  }, [queueId]);

  const leaveQueue = useCallback(async (userId) => {
    try {
      const docId = `${queueId}_${userId}`;
      await updateDoc(doc(db, "queueEntries", docId), {
        status: "cancelled"
      });
    } catch (err) {
      console.error(err);
    }
  }, [queueId]);

  const completeInteraction = useCallback(async (userId) => {
     try {
       const docId = `${queueId}_${userId}`;
       await updateDoc(doc(db, "queueEntries", docId), {
         status: "completed"
       });
     } catch(err) {
       console.error(err);
     }
  }, [queueId]);

  // Helper to get position of a specific user
  const getUserPosition = useCallback((userId) => {
    const index = entries.findIndex(e => e.userId === userId);
    return index !== -1 ? index : null;
  }, [entries]);

  return { 
    entries, 
    loading, 
    error, 
    joinQueue, 
    leaveQueue, 
    completeInteraction,
    getUserPosition,
    AVG_WAIT_PER_PERSON_MINS
  };
}
