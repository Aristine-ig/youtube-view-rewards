import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateTask } from "@/hooks/useTasks";
import { supabase } from "@/integrations/supabase/client";

const AdminPortal = () => {
  const navigate = useNavigate();
  const createTask = useCreateTask();
  const [channelName, setChannelName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

  const totalReward = rewardAmount ? Number(rewardAmount) : 0;

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("thumbnails").upload(filePath, file);
    if (error) {
      toast.error("Thumbnail upload failed");
    } else {
      const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(filePath);
      setThumbnailUrl(urlData.publicUrl);
      toast.success("Thumbnail uploaded");
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    if (!channelName || !videoTitle || !videoDuration || !rewardAmount) {
      toast.error("Fill in all required fields");
      return;
    }

    const taskActions: { type: string; label: string; reward: number; required: boolean }[] = [];
    if (actions.watch) taskActions.push({ type: "watch", label: "Watch full video", reward: 0, required: true });
    if (actions.like) taskActions.push({ type: "like", label: "Like the video", reward: 0, required: false });
    if (actions.subscribe) taskActions.push({ type: "subscribe", label: "Subscribe to channel", reward: 0, required: false });
    if (actions.comment) taskActions.push({ type: "comment", label: "Leave a comment", reward: 0, required: false });

    createTask.mutate(
      {
        channel_name: channelName,
        video_title: videoTitle,
        video_duration: Number(videoDuration),
        video_thumbnail: thumbnailUrl ?? "",
        keywords,
        actions: taskActions,
        base_reward: totalReward,
        total_reward: totalReward,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully!");
          setTimeout(() => navigate("/"), 1000);
        },
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
                <Label htmlFor="duration" className="text-xs text-muted-foreground">Video Duration (minutes) *</Label>
                <Input id="duration" type="number" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="e.g. 12" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Video Thumbnail</h2>
            {thumbnailUrl ? (
              <div className="relative">
                <img src={thumbnailUrl} alt="Thumbnail" className="rounded-lg w-full max-h-48 object-cover" />
                <button
                  onClick={() => setThumbnailUrl(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="w-3 h-3 text-foreground" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/30 transition-colors block">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload thumbnail"}</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP</p>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          {/* Keywords */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Keywords</h2>
            <div className="flex gap-2">
              <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="Add keyword" onKeyDown={(e) => e.key === "Enter" && addKeyword()} className="flex-1" />
              <Button variant="secondary" size="icon" onClick={addKeyword}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {kw}
                  <button onClick={() => removeKeyword(i)}><X className="w-3 h-3 text-muted-foreground hover:text-foreground" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Required Actions */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Required Actions</h2>
            {(["watch", "like", "subscribe", "comment"] as const).map((action) => (
              <label key={action} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer">
                <p className="text-sm font-medium text-foreground capitalize">{action}</p>
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

          {/* Reward Input */}
          <div className="glass-card glow-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Reward</h2>
            <div>
              <Label htmlFor="reward" className="text-xs text-muted-foreground">Reward Amount ($) *</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="e.g. 0.50"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Reward per user</p>
                <p className="stat-number text-2xl text-reward">${totalReward.toFixed(2)}</p>
              </div>
              <Button onClick={handleSubmit} className="gap-2" disabled={createTask.isPending}>
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
