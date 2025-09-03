export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  avatar?: string;
  skills?: string[];
  interests?: string[];
  points: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to: string;
  created_by: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'link';
  reactions?: Record<string, string[]>;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  file_path?: string;
  category: 'notes' | 'research' | 'ideas' | 'documents';
  uploaded_by: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  type: 'deadline' | 'meeting' | 'event';
  created_by: string;
  created_at: string;
}