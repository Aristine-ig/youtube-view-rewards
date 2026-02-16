import { motion } from "framer-motion";
import { useTasks, useUserProfile } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import StatsBar from "@/components/StatsBar";
import TaskCard from "@/components/TaskCard";
import { Settings, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: profile } = useUserProfile();

  const stats = {
    totalEarnings: Number(profile?.total_earnings ?? 0),
    tasksCompleted: profile?.tasks_completed ?? 0,
    pendingRewards: Number(profile?.pending_rewards ?? 0),
    activeStreak: profile?.active_streak ?? 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-foreground">YT Tasks</h1>
            <p className="text-xs text-muted-foreground">Earn rewards by engaging with content</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                title="Admin Portal"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </motion.div>

        <StatsBar stats={stats} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Available Tasks</h2>
            <span className="text-xs text-muted-foreground font-mono">{tasks?.length ?? 0} tasks</span>
          </div>
          {tasksLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading tasks...</p>
          ) : tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No tasks available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
