import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface RealtimeSubscription {
  channel: string;
  table: string;
  event: string;
  callback: (payload: any) => void;
}

export const useRealtime = (subscriptions: RealtimeSubscription[]) => {
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    // Clean up existing subscriptions
    subscriptionsRef.current.forEach(sub => sub.unsubscribe());
    subscriptionsRef.current = [];

    // Create new subscriptions
    subscriptions.forEach(({ channel, table, event, callback }) => {
      const subscription = supabase
        .channel(channel)
        .on('postgres_changes', 
          { event, schema: 'public', table },
          callback
        )
        .subscribe();

      subscriptionsRef.current.push(subscription);
    });

    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
    };
  }, [subscriptions]);
};

export const useNotifications = () => {
  useEffect(() => {
    // Subscribe to task updates
    const taskSubscription = supabase
      .channel('task-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => {
          toast.success(`New task created: ${payload.new.title}`);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.new.status === 'completed') {
            toast.success(`Task completed: ${payload.new.title}`);
          }
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('message-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          toast.success('New message in discussion');
        }
      )
      .subscribe();

    return () => {
      taskSubscription.unsubscribe();
      messageSubscription.unsubscribe();
    };
  }, []);
};
