import { motion } from "framer-motion";
import { MOCK_TASKS, MOCK_STATS } from "@/lib/types";
import StatsBar from "@/components/StatsBar";
import TaskCard from "@/components/TaskCard";
import { Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
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
            <button
              onClick={() => navigate("/admin")}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              title="Admin Portal"
            >
              <Plus className="w-4 h-4 text-foreground" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Settings className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsBar stats={MOCK_STATS} />

        {/* Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Available Tasks</h2>
            <span className="text-xs text-muted-foreground font-mono">{MOCK_TASKS.length} tasks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_TASKS.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
