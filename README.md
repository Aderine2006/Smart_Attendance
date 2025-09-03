# TeamSpace - Real-time Team Collaboration Platform

A modern, real-time team collaboration platform built with React, TypeScript, and Supabase. Features include task management, team discussions, resource sharing, progress tracking, and more.

## 🚀 Features

- **Real-time Collaboration**: Live updates for tasks, messages, and resources
- **Task Management**: Create, assign, and track tasks with priority levels
- **Team Discussion**: Real-time messaging with reactions
- **Resource Sharing**: Share knowledge, documents, and links
- **Progress Tracking**: Visual progress indicators and analytics
- **Calendar Integration**: Schedule meetings and deadlines
- **User Profiles**: Team member profiles with points system
- **Leaderboard**: Gamified team performance tracking
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account
- A Vercel account (for deployment)
- Git installed

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `DEPLOYMENT.md` in your Supabase SQL Editor
3. Get your project URL and anon key from Settings > API

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub**: Commit and push your code to a GitHub repository

2. **Deploy with Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Update Supabase Settings**:
   - Go to your Supabase project
   - Update Authentication > Settings with your Vercel domain
   - Add your domain to allowed origins

### Option 2: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

## 🔧 Configuration

### Database Schema

The application requires the following Supabase tables:
- `users` - User profiles and authentication
- `tasks` - Task management
- `messages` - Team discussions
- `resources` - Knowledge sharing
- `calendar_events` - Calendar integration

See `DEPLOYMENT.md` for the complete SQL schema.

### Real-time Features

The application uses Supabase's real-time subscriptions for:
- Live task updates
- Real-time messaging
- Resource sharing notifications
- Progress tracking updates

### Authentication

- Email/password authentication via Supabase Auth
- Row Level Security (RLS) policies for data protection
- Automatic user profile creation on signup

## 📱 Usage

### Getting Started

1. **Sign Up**: Create an account with your email
2. **Create Tasks**: Add tasks and assign them to team members
3. **Start Discussions**: Use the discussion board for team communication
4. **Share Resources**: Add links, documents, and knowledge
5. **Track Progress**: Monitor team performance and task completion

### Team Management

- **Admin Role**: Full access to all features
- **Member Role**: Standard user permissions
- **Points System**: Gamified progress tracking
- **Leaderboard**: Team performance rankings

## 🎨 Customization

### Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary: Orange (#FF9933)
- Secondary: Green (#138808)
- Accent: Blue (#000080)

### Components

All components are built with:
- TypeScript for type safety
- Framer Motion for animations
- Responsive design principles
- Accessibility features

## 🔒 Security

- Row Level Security (RLS) on all database tables
- Secure authentication via Supabase Auth
- Environment variable protection
- CORS configuration for production

## 📊 Performance

- Optimized bundle size with Vite
- Lazy loading for components
- Efficient real-time subscriptions
- Responsive image handling

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Supabase allowed origins
2. **Authentication Issues**: Check environment variables and Supabase settings
3. **Real-time Not Working**: Verify RLS policies and real-time subscriptions
4. **Build Errors**: Ensure all dependencies are installed and environment variables are set

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Vercel Documentation](https://vercel.com/docs)
- Open an issue in the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for deployment platform
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://framer.com/motion) for animations
- [Lucide](https://lucide.dev) for icons

---

**Made with ❤️ for better team collaboration**
