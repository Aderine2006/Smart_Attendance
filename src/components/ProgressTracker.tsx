import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Target, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Task, User } from '../types';

const ProgressTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResult, usersResult] = await Promise.all([
        supabase
          .from('tasks')
          .select(`
            *,
            assigned_user:users!tasks_assigned_to_fkey(name),
            creator:users!tasks_created_by_fkey(name)
          `),
        supabase
          .from('users')
          .select('*')
      ]);

      setTasks(tasksResult.data || []);
      setTeamMembers(usersResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate team statistics
  const teamStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assigned_to === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'completed');
    const inProgressTasks = memberTasks.filter(task => task.status === 'in_progress');
    
    return {
      name: member.name,
      total: memberTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      completionRate: memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0,
    };
  });

  // Overall project statistics
  const overallStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    notStarted: tasks.filter(t => t.status === 'not_started').length,
  };

  const pieData = [
    { name: 'Completed', value: overallStats.completed, color: '#138808' },
    { name: 'In Progress', value: overallStats.inProgress, color: '#000080' },
    { name: 'Not Started', value: overallStats.notStarted, color: '#6B7280' },
  ];

  // Kanban Board Data
  const kanbanColumns = [
    {
      id: 'not_started',
      title: 'Not Started',
      color: 'bg-gray-100 border-gray-300',
      tasks: tasks.filter(t => t.status === 'not_started')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'bg-blue-100 border-blue-300',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-100 border-green-300',
      tasks: tasks.filter(t => t.status === 'completed')
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Progress</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: overallStats.total, icon: Target, color: '#FF9933' },
          { label: 'Completed', value: overallStats.completed, icon: TrendingUp, color: '#138808' },
          { label: 'In Progress', value: overallStats.inProgress, icon: Clock, color: '#000080' },
          { label: 'Team Members', value: teamMembers.length, icon: Users, color: '#8B5CF6' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#138808" name="Completed" />
              <Bar dataKey="inProgress" fill="#000080" name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Overview Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Project Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Kanban Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kanbanColumns.map((column) => (
            <div key={column.id} className={`rounded-lg p-4 ${column.color}`}>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
                {column.title}
                <span className="bg-white px-2 py-1 rounded-full text-sm">
                  {column.tasks.length}
                </span>
              </h4>
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h5 className="font-medium text-gray-900 mb-2">{task.title}</h5>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team Member Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Individual Contributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamStats.map((member) => (
            <div key={member.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">{member.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                  <span className="font-medium">{member.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${member.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Completed: {member.completed}</span>
                  <span>Total: {member.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressTracker;