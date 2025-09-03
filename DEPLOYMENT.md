# TeamSpace Deployment Guide

This guide will help you deploy your TeamSpace application with real-time functionality.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **GitHub Account**: For version control and deployment
3. **Vercel Account**: For frontend deployment (or Netlify)

## Step 1: Set up Supabase Database

### 1.1 Create a new Supabase project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be created

### 1.2 Set up the database schema
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  avatar TEXT,
  skills TEXT[],
  interests TEXT[],
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id) NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'image', 'link')) DEFAULT 'text',
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  file_path TEXT,
  category TEXT CHECK (category IN ('notes', 'research', 'ideas', 'documents')) DEFAULT 'notes',
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_events table
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT CHECK (type IN ('deadline', 'meeting', 'event')) DEFAULT 'event',
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read all users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can read all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assigned_to);
CREATE POLICY "Users can delete tasks" ON tasks FOR DELETE USING (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can read all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON messages FOR DELETE USING (auth.uid() = user_id);

-- Resources policies
CREATE POLICY "Users can read all resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Users can create resources" ON resources FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update own resources" ON resources FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own resources" ON resources FOR DELETE USING (auth.uid() = uploaded_by);

-- Calendar events policies
CREATE POLICY "Users can read all events" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own events" ON calendar_events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own events" ON calendar_events FOR DELETE USING (auth.uid() = created_by);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE resources;
ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;
```

### 1.3 Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable email authentication
3. Configure your site URL (you'll update this after deployment)
4. Set up email templates if needed

## Step 2: Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Get your Supabase URL and anon key from y  our project settings
3. Update the environment variables:

```bash
VITE_SUPABASE_URL=https://dsfjdlewtclmoyvxgfwl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZmpkbGV3dGNsbW95dnhnZndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTc3MjMsImV4cCI6MjA3MjI5MzcyM30.fbLX9H79tCe7WFULs5aL2Md3cxZY89CdYK10S-urr3U
```

## Step 3: Deploy to Vercel

### 3.1 Prepare for deployment
1. Make sure your code is committed to a Git repository
2. Push your code to GitHub

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Deploy the project

### 3.3 Update Supabase settings
1. Go back to your Supabase project
2. Update the Site URL in Authentication settings to your Vercel domain
3. Add your Vercel domain to the allowed origins

## Step 4: Test Real-time Functionality

1. Open your deployed application
2. Create a user account
3. Test the following real-time features:
   - Send messages in the discussion board
   - Create and update tasks
   - Add resources
   - Create calendar events

## Step 5: Optional Enhancements

### 5.1 Custom Domain
1. Add a custom domain in Vercel
2. Update Supabase settings with the new domain

### 5.2 Email Notifications
1. Set up email templates in Supabase
2. Configure SMTP settings for email notifications

### 5.3 File Upload
1. Set up Supabase Storage for file uploads
2. Update the resources component to handle file uploads

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your domain is added to Supabase allowed origins
2. **Authentication not working**: Check your environment variables and Supabase settings
3. **Real-time not working**: Ensure RLS policies are correct and real-time is enabled

### Support:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
