import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Heart,
  ThumbsUp,
  Smile,
  Image,
  Link as LinkIcon,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Message } from '../types';
import toast from 'react-hot-toast';

const Discussion: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content: newMessage.trim(),
          type: 'text',
        });

      if (error) throw error;

      setNewMessage('');
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Error sending message');
      console.error('Error sending message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const reactions = message.reactions || {};
      const userReactions = reactions[emoji] || [];
      
      let newReactions;
      if (userReactions.includes(user.id)) {
        // Remove reaction
        newReactions = {
          ...reactions,
          [emoji]: userReactions.filter(id => id !== user.id)
        };
      } else {
        // Add reaction
        newReactions = {
          ...reactions,
          [emoji]: [...userReactions, user.id]
        };
      }

      const { error } = await supabase
        .from('messages')
        .update({ reactions: newReactions })
        .eq('id', messageId);

      if (error) throw error;

      fetchMessages();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Discussion</h1>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share your thoughts with the team
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="What's on your mind?"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                title="Add Image"
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                title="Add Link"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Messages Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                  {(message as any).user?.name?.charAt(0) || 'U'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {(message as any).user?.name || 'Unknown User'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{message.content}</p>
                  
                  {/* Reactions */}
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      {['👍', '❤️', '😊'].map((emoji) => {
                        const reactionCount = message.reactions?.[emoji]?.length || 0;
                        const hasReacted = message.reactions?.[emoji]?.includes(user?.id || '');
                        
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200 ${
                              hasReacted
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            <span>{emoji}</span>
                            {reactionCount > 0 && <span>{reactionCount}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;