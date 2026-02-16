import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface TaskWithActions {
  id: string;
  channel_name: string;
  channel_avatar: string;
  video_title: string;
  video_thumbnail: string;
  video_url: string;
  video_duration: number;
  keywords: string[];
  base_reward: number;
  total_reward: number;
  status: string;
  created_at: string;
  expires_at: string;
  task_actions: {
    id: string;
    type: string;
    label: string;
    reward: number;
    required: boolean;
    sort_order: number;
  }[];
}

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, task_actions(*)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TaskWithActions[];
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, task_actions(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as TaskWithActions | null;
    },
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (taskData: {
      channel_name: string;
      video_title: string;
      video_url: string;
      video_duration: number;
      keywords: string[];
      actions: { type: string; label: string; reward: number; required: boolean }[];
      base_reward: number;
      total_reward: number;
    }) => {
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
          created_by: user!.id,
          channel_name: taskData.channel_name,
          video_title: taskData.video_title,
          video_url: taskData.video_url,
          video_duration: taskData.video_duration,
          keywords: taskData.keywords,
          base_reward: taskData.base_reward,
          total_reward: taskData.total_reward,
        })
        .select()
        .single();
      if (taskError) throw taskError;

      const actionsToInsert = taskData.actions.map((a, i) => ({
        task_id: task.id,
        type: a.type,
        label: a.label,
        reward: a.reward,
        required: a.required,
        sort_order: i,
      }));

      const { error: actionsError } = await supabase
        .from("task_actions")
        .insert(actionsToInsert);
      if (actionsError) throw actionsError;

      return task;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useSubmitTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      task_id: string;
      completed_actions: string[];
      earned_reward: number;
      screenshot_url?: string;
    }) => {
      const { error } = await supabase
        .from("user_task_completions")
        .upsert({
          user_id: user!.id,
          task_id: data.task_id,
          completed_actions: data.completed_actions,
          earned_reward: data.earned_reward,
          screenshot_url: data.screenshot_url,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
