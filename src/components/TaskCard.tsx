import { motion } from "framer-motion";
import { TaskWithActions } from "@/hooks/useTasks";
import { Play, Clock, Eye, ThumbsUp, UserPlus, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: TaskWithActions;
  index: number;
}

const actionIcons: Record<string, typeof Eye> = {
  watch: Eye,
  like: ThumbsUp,
  subscribe: UserPlus,
  comment: MessageSquare,
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card task-card-hover cursor-pointer overflow-hidden"
      onClick={() => navigate(`/task/${task.id}`)}
    >
      <div className="relative h-36 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
            <Play className="w-5 h-5 text-primary ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 left-3 z-20 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
            {task.channel_name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-foreground/80">{task.channel_name}</span>
        </div>
        <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1 bg-background/60 backdrop-blur-sm rounded px-1.5 py-0.5">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">{task.video_duration}m</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {task.video_title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {task.keywords?.map((kw) => (
            <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {kw}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {task.task_actions?.map((action) => {
            const Icon = actionIcons[action.type] || Eye;
            return (
              <div key={action.id} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center" title={action.label}>
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Total reward</span>
          <span className="stat-number text-sm text-reward">${Number(task.total_reward).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
