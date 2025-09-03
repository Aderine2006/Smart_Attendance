import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Target,
  Calendar,
  User,
  Crown,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User as UserType, Task } from '../types';

const Leaderboard: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<UserType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResult, tasksResult] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('tasks').select('*')
      ]);

      setTeamMembers(usersResult.data || []);
      setTasks(tasksResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate leaderboard data
  const leaderboardData = teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assigned_to === member.id);
    const completedTasks = memberTasks.filter(task => task.status === 'completed');
    const thisWeekTasks = memberTasks.filter(task => {
      const taskDate = new Date(task.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate >= weekAgo;
    });

    // Calculate points
    let points = completedTasks.length * 10; // Base points for completion
    points += completedTasks.filter(t => t.priority === 'high').length * 5; // Bonus for high priority
    points += completedTasks.filter(t => new Date(t.due_date) >= new Date()).length * 2; // Bonus for on-time completion

    return {
      ...member,
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      thisWeekTasks: thisWeekTasks.length,
      completionRate: memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0,
      points,
    };
  }).sort((a, b) => b.points - a.points);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return { icon: Crown, color: '#FFD700' };
      case 1: return { icon: Medal, color: '#C0C0C0' };
      case 2: return { icon: Medal, color: '#CD7F32' };
      default: return { icon: Star, color: '#6B7280' };
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 1: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 2: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Leaderboard</h1>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">🏆 Top Performers This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboardData.slice(0, 3).map((member, index) => {
            const rankInfo = getRankIcon(index);
            const RankIcon = rankInfo.icon;
            
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    {member.name.charAt(0)}
                  </div>
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: rankInfo.color }}
                  >
                    <RankIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-white/80">{member.points} points</p>
                <p className="text-sm text-white/70">
                  {member.completedTasks} tasks completed
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Full Team Rankings</h3>
        <div className="space-y-4">
          {leaderboardData.map((member, index) => {
            const rankInfo = getRankIcon(index);
            const RankIcon = rankInfo.icon;
            
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(index)}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0)}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {member.completedTasks}/{member.totalTasks} tasks completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
                    <p className="font-bold text-gray-900 dark:text-white">{member.completionRate}%</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Points</p>
                    <p className="font-bold text-gray-900 dark:text-white">{member.points}</p>
                  </div>
                  
                  <RankIcon className="w-6 h-6" style={{ color: rankInfo.color }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievement System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Task Master',
              description: 'Complete 10 tasks',
              icon: Target,
              color: '#FF9933',
              achieved: leaderboardData.some(m => m.completedTasks >= 10)
            },
            {
              title: 'Consistency King',
              description: '90% completion rate',
              icon: TrendingUp,
              color: '#138808',
              achieved: leaderboardData.some(m => m.completionRate >= 90)
            },
            {
              title: 'Team Player',
              description: 'Most collaborative',
              icon: User,
              color: '#000080',
              achieved: true
            },
          ].map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.title}
                className={`p-6 rounded-lg border-2 ${
                  achievement.achieved 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: achievement.achieved ? `${achievement.color}20` : '#F3F4F6',
                      color: achievement.achieved ? achievement.color : '#6B7280'
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                {achievement.achieved && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Achieved!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;