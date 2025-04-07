
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  policy_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  policy_id?: string | null;
  title: string;
  description?: string | null;
  status?: string;
  due_date?: string | null;
  assigned_to?: string | null;
  user_id: string; // Added required user_id field
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    toast({
      title: "Error fetching tasks",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching task:', error);
    toast({
      title: "Error fetching task",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function createTask(task: TaskInput): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task) // Fixed: pass task directly, not as array
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error creating task:', error);
    toast({
      title: "Error creating task",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function updateTask(id: string, updates: Partial<TaskInput>): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully"
    });
    
    return data;
  } catch (error: any) {
    console.error('Error updating task:', error);
    toast({
      title: "Error updating task",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting task:', error);
    toast({
      title: "Error deleting task",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}
