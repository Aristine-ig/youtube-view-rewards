export interface YouTubeTask {
  id: string;
  channelName: string;
  channelAvatar: string;
  videoTitle: string;
  videoThumbnail: string;
  videoUrl: string;
  videoDuration: number; // in minutes
  keywords: string[];
  actions: TaskAction[];
  baseReward: number;
  totalReward: number;
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface TaskAction {
  type: 'watch' | 'like' | 'subscribe' | 'comment';
  label: string;
  reward: number;
  completed: boolean;
  required: boolean;
}

export interface UserStats {
  totalEarnings: number;
  tasksCompleted: number;
  pendingRewards: number;
  activeStreak: number;
}

export const MOCK_TASKS: YouTubeTask[] = [
  {
    id: '1',
    channelName: 'TechVault',
    channelAvatar: '',
    videoTitle: 'AI Revolution: What Nobody Is Telling You About 2026',
    videoThumbnail: '',
    videoUrl: 'https://youtube.com/watch?v=example1',
    videoDuration: 12,
    keywords: ['AI', 'technology', 'future'],
    actions: [
      { type: 'watch', label: 'Watch full video', reward: 0.24, completed: false, required: true },
      { type: 'like', label: 'Like the video', reward: 0.05, completed: false, required: false },
      { type: 'subscribe', label: 'Subscribe to channel', reward: 0.10, completed: false, required: false },
      { type: 'comment', label: 'Leave a comment', reward: 0.15, completed: false, required: false },
    ],
    baseReward: 0.24,
    totalReward: 0.54,
    status: 'available',
    createdAt: '2026-02-15T08:00:00Z',
    expiresAt: '2026-02-16T08:00:00Z',
  },
  {
    id: '2',
    channelName: 'CryptoWave',
    channelAvatar: '',
    videoTitle: 'Bitcoin to $500K? Analysis of the Next Bull Run',
    videoThumbnail: '',
    videoUrl: 'https://youtube.com/watch?v=example2',
    videoDuration: 22,
    keywords: ['crypto', 'bitcoin', 'investing'],
    actions: [
      { type: 'watch', label: 'Watch full video', reward: 0.44, completed: false, required: true },
      { type: 'like', label: 'Like the video', reward: 0.05, completed: false, required: false },
      { type: 'subscribe', label: 'Subscribe to channel', reward: 0.10, completed: false, required: false },
      { type: 'comment', label: 'Leave a comment', reward: 0.15, completed: false, required: false },
    ],
    baseReward: 0.44,
    totalReward: 0.74,
    status: 'available',
    createdAt: '2026-02-15T10:00:00Z',
    expiresAt: '2026-02-16T10:00:00Z',
  },
  {
    id: '3',
    channelName: 'FitLife Pro',
    channelAvatar: '',
    videoTitle: '30-Day Body Transformation Challenge',
    videoThumbnail: '',
    videoUrl: 'https://youtube.com/watch?v=example3',
    videoDuration: 8,
    keywords: ['fitness', 'workout', 'health'],
    actions: [
      { type: 'watch', label: 'Watch full video', reward: 0.16, completed: false, required: true },
      { type: 'like', label: 'Like the video', reward: 0.05, completed: false, required: false },
      { type: 'subscribe', label: 'Subscribe to channel', reward: 0.10, completed: false, required: false },
    ],
    baseReward: 0.16,
    totalReward: 0.31,
    status: 'available',
    createdAt: '2026-02-15T06:00:00Z',
    expiresAt: '2026-02-17T06:00:00Z',
  },
  {
    id: '4',
    channelName: 'DevMaster',
    channelAvatar: '',
    videoTitle: 'Build a Full-Stack App in 1 Hour with React',
    videoThumbnail: '',
    videoUrl: 'https://youtube.com/watch?v=example4',
    videoDuration: 58,
    keywords: ['programming', 'react', 'tutorial'],
    actions: [
      { type: 'watch', label: 'Watch full video', reward: 1.16, completed: false, required: true },
      { type: 'like', label: 'Like the video', reward: 0.05, completed: false, required: false },
      { type: 'subscribe', label: 'Subscribe to channel', reward: 0.10, completed: false, required: false },
      { type: 'comment', label: 'Leave a comment', reward: 0.15, completed: false, required: false },
    ],
    baseReward: 1.16,
    totalReward: 1.46,
    status: 'available',
    createdAt: '2026-02-14T12:00:00Z',
    expiresAt: '2026-02-16T12:00:00Z',
  },
];

export const MOCK_STATS: UserStats = {
  totalEarnings: 14.72,
  tasksCompleted: 23,
  pendingRewards: 2.35,
  activeStreak: 5,
};
