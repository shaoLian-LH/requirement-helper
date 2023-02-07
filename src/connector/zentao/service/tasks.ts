import { TaskDetail } from './tasks.d';
import { get } from './http';

export const getTaskInfo = (taskId: string) => {
  return get<any, TaskDetail>(`/tasks/${taskId}`);
};