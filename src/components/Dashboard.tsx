import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  CheckSquare,
  Clock,
  Users,
  Target,
  Calendar,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Task, Message, CalendarEvent } from '../types';
import { indianMotivationalQuotes } from '../data/quotes';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueeTasks: 0,
  });

  const currentQuote = indianMotivationalQuotes[
    Math.floor(Math.random() * indianMotivationalQuotes.length)
  ];

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (tasksData) {
        setTasks(tasksData);
        const total = tasksData.length;
        const completed = tasksData.filter(t => t.status === 'completed').length;
        const inProgress = tasksData.filter(t => t.status === 'in_progress').length;
        const overdue = tasksData.filter(t => 
          new Date(t.due_date) < new Date() && t.status !== 'completed'
        ).length;

        setStats({
          totalTasks: total,
          completedTasks: completed,
          inProgressTasks: inProgress,
          overdueeTasks: overdue,
        });
      }

      // Fetch recent messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*, users(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (messagesData) {
        setRecentMessages(messagesData);
      }

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(3);

      if (eventsData) {
        setUpcomingEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'सुप्रभात (Good Morning)';
    if (hour < 17) return 'नमस्ते (Good Afternoon)';
    return 'शुभ संध्या (Good Evening)';
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          {getTimeOfDayGreeting()}, {user?.name}!
        </h1>
        <p className="text-lg opacity-90 mb-4">Ready to make progress together?</p>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm italic">{currentQuote}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckSquare}
          title="Total Tasks"
          value={stats.totalTasks}
          color="#FF9933"
        />
        <StatCard
          icon={Target}
          title="Completed"
          value={stats.completedTasks}
          color="#138808"
        />
        <StatCard
          icon={TrendingUp}
          title="In Progress"
          value={stats.inProgressTasks}
          color="#000080"
        />
        <StatCard
          icon={Clock}
          title="Overdue"
          value={stats.overdueeTasks}
          color="#DC2626"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-orange-500" />
              Your Recent Tasks
            </h3>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Recent Team Activity
            </h3>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'New Task', icon: CheckSquare, color: 'orange' },
            { name: 'Team Chat', icon: MessageSquare, color: 'green' },
            { name: 'Resources', icon: BookOpen, color: 'blue' },
            { name: 'Calendar', icon: Calendar, color: 'purple' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-200 flex flex-col items-center space-y-2"
              >
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {action.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;