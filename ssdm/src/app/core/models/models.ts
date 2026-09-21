export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  lecturer: string;
  color: string;
  progress: number;
  assignmentsCount: number;
  completedCount: number;
}

export interface Assignment {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'NotStarted' | 'InProgress' | 'Done';
  progress: number;
}

export interface StudyBlock {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectColor: string;
  topic: string;
  startTime: string;
  endTime: string;
  progress: number;
  isCompleted: boolean;
}

export interface Notification {
  id: number;
  message: string;
  type: 'Info' | 'Warning' | 'Urgent';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalSubjects: number;
  pendingAssignments: number;
  upcomingDeadlines: number;
  completionRate: number;
  upcomingAssignments: Assignment[];
  todayStudyBlocks: StudyBlock[];
}
