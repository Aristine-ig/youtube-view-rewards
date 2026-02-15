import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [actions, setActions] = useState({
    watch: true,
    like: true,
    subscribe: true,
    comment: false,
  });

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 5) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const baseReward = videoDuration ? Number(videoDuration) * 0.02 : 0;
  const actionBonus =
    (actions.like ? 0.05 : 0) +
    (actions.subscribe ? 0.1 : 0) +
    (actions.comment ? 0.15 : 0);
  const totalReward = baseReward + actionBonus;

  const handleSubmit = () => {
    if (!channelName || !videoTitle || !videoUrl || !videoDuration) {
      toast.error("Fill in all required fields");
      return;
    }
    toast.success("Task created successfully!");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Create New Task</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Channel Info */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Channel Details</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="channelName" className="text-xs text-muted-foreground">Channel Name *</Label>
                <Input id="channelName" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="e.g. TechVault" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="videoTitle" className="text-xs text-muted-foreground">Video Title *</Label>
                <Input id="videoTitle" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="e.g. AI Revolution: What Nobody..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="videoUrl" className="text-xs text-muted-foreground">Video URL *</Label>
                <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="duration" className="text-xs text-muted-foreground">Video Duration (minutes) *</Label>
                <Input id="duration" type="number" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="e.g. 12" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Keywords</h2>
            <div className="flex gap-2">
              <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="Add keyword" onKeyDown={(e) => e.key === "Enter" && addKeyword()} className="flex-1" />
              <Button variant="secondary" size="icon" onClick={addKeyword}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {kw}
                  <button onClick={() => removeKeyword(i)}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Required Actions */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Required Actions</h2>
            {(["watch", "like", "subscribe", "comment"] as const).map((action) => (
              <label key={action} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{action}</p>
                  <p className="text-xs text-muted-foreground">
                    {action === "watch" && `$0.02/min base reward`}
                    {action === "like" && `+$0.05 bonus`}
                    {action === "subscribe" && `+$0.10 bonus`}
                    {action === "comment" && `+$0.15 bonus`}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={actions[action]}
                  onChange={(e) => setActions({ ...actions, [action]: e.target.checked })}
                  disabled={action === "watch"}
                  className="w-4 h-4 accent-primary"
                />
              </label>
            ))}
          </div>

          {/* Reward Preview */}
          <div className="glass-card glow-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Estimated reward per user</p>
                <p className="stat-number text-2xl text-reward">${totalReward.toFixed(2)}</p>
              </div>
              <Button onClick={handleSubmit} className="gap-2">
                <Plus className="w-4 h-4" /> Create Task
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPortal;
