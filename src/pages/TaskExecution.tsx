import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_TASKS, TaskAction } from "@/lib/types";
import { ArrowLeft, ExternalLink, Eye, ThumbsUp, UserPlus, MessageSquare, CheckCircle2, Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const actionIcons = {
  watch: Eye,
  like: ThumbsUp,
  subscribe: UserPlus,
  comment: MessageSquare,
};

const actionDescriptions = {
  watch: "Watch the entire video to completion",
  like: "Click the like button on the video",
  subscribe: "Subscribe to the channel",
  comment: "Leave a meaningful comment (5+ words)",
};

const TaskExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = MOCK_TASKS.find((t) => t.id === id);
  const [actions, setActions] = useState<TaskAction[]>(task?.actions ?? []);
  const [started, setStarted] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  const completedReward = actions
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + a.reward, 0);

  const handleStart = () => {
    setStarted(true);
    window.open(task.videoUrl, "_blank");
  };

  const toggleAction = (index: number) => {
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleSubmit = () => {
    const requiredDone = actions.filter((a) => a.required).every((a) => a.completed);
    if (!requiredDone) {
      toast.error("Complete all required actions first");
      return;
    }
    toast.success(`Task submitted! You earned $${completedReward.toFixed(2)}`);
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Task Details</h1>
            <p className="text-xs text-muted-foreground">{task.channelName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Reward</p>
            <p className="stat-number text-lg text-reward">${task.totalReward.toFixed(2)}</p>
          </div>
        </div>

        {/* Video Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg font-bold text-foreground shrink-0">
              {task.channelName.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="font-semibold text-foreground leading-tight">{task.videoTitle}</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {task.videoDuration} min
                </span>
                <span>Base: ${task.baseReward.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {task.keywords.map((kw) => (
              <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {kw}
              </span>
            ))}
          </div>

          {!started ? (
            <Button onClick={handleStart} className="w-full gap-2">
              <ExternalLink className="w-4 h-4" /> Open Video & Start Task
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Task in progress — complete actions below
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <AnimatePresence>
          {started && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-foreground">Actions</h3>
              {actions.map((action, i) => {
                const Icon = actionIcons[action.type];
                return (
                  <motion.button
                    key={action.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => toggleAction(i)}
                    className={`w-full glass-card p-4 flex items-center gap-4 text-left transition-all ${
                      action.completed ? "glow-border" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      action.completed ? "bg-primary/20" : "bg-secondary"
                    }`}>
                      {action.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${action.completed ? "text-primary" : "text-foreground"}`}>
                        {action.label}
                        {action.required && <span className="text-destructive ml-1">*</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {actionDescriptions[action.type]}
                      </p>
                    </div>
                    <span className="stat-number text-sm text-reward shrink-0">
                      +${action.reward.toFixed(2)}
                    </span>
                  </motion.button>
                );
              })}

              {/* Screenshot Upload */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Verification Screenshot</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot showing your completed actions for verification
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/30 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload screenshot</p>
                </div>
              </div>

              {/* Submit */}
              <div className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Your reward</p>
                  <p className="stat-number text-xl text-reward">${completedReward.toFixed(2)}</p>
                </div>
                <Button onClick={handleSubmit} className="gap-2" disabled={completedReward === 0}>
                  <CheckCircle2 className="w-4 h-4" /> Submit Task
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskExecution;
