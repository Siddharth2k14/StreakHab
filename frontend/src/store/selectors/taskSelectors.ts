import type { RootState } from "../store";

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (id: number) => (state: RootState) => state.tasks.tasks.find((t) => t.id === id) ?? null;
export const selectTaskLoading = (state: RootState) => state.tasks.loading;
export const selectTaskError = (state: RootState) => state.tasks.error;
export const selectEditingTaskId = (state: RootState) => state.tasks.editingTaskId;
export const selectEditedTitle = (state: RootState) => state.tasks.editedTitle;