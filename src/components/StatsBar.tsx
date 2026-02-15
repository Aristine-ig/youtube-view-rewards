import { motion } from "framer-motion";
import { UserStats } from "@/lib/types";
import { DollarSign, CheckCircle2, Clock, Flame } from "lucide-react";

interface StatsBarProps {
  stats: UserStats;
}

const StatItem = ({
  icon: Icon,
  label,
  value,
  isCurrency,
  delay,
}: {
  icon: typeof DollarSign;
  label: string;
  value: number;
  isCurrency?: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-4 flex items-center gap-3"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="stat-number text-lg text-foreground">
        {isCurrency ? `$${value.toFixed(2)}` : value}
      </p>
    </div>
  </motion.div>
);

const StatsBar = ({ stats }: StatsBarProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatItem icon={DollarSign} label="Total Earnings" value={stats.totalEarnings} isCurrency delay={0} />
      <StatItem icon={CheckCircle2} label="Tasks Done" value={stats.tasksCompleted} delay={0.05} />
      <StatItem icon={Clock} label="Pending" value={stats.pendingRewards} isCurrency delay={0.1} />
      <StatItem icon={Flame} label="Day Streak" value={stats.activeStreak} delay={0.15} />
    </div>
  );
};

export default StatsBar;
