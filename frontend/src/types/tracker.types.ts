/**
 * Represents a Single task in the tracker
 */
export interface Task {
    id: Number;
    title: String;
    createdAt: String;
    updatedAt: String;
}

/**
 * Represents a single daily entry (checkbox state) for a task on a specific date.
 */
export interface Entry {
    taskId: Number;
    date: String;
    completed: Boolean;
}

export type EntriesMap = Record<string, boolean>;

/**
 * Redux state shape for the tasks slice.
 */
export interface TaskState {
    tasks: Task[];
    loading: Boolean;
    error: String | null;
    editingTaskId: Number | null;
    editedTitle: String;
}

/**
 * Redux state shape for the entries slice.
 */
export interface EntriesState {
  entries: EntriesMap;
  loading: boolean;
  error: string | null;
}

/**
 * Payload for creating a new task.
 */
export interface CreateTaskPayload {
  title: string;
}

/**
 * Payload for updating an existing task's title.
 */
export interface UpdateTaskPayload {
  id: number;
  title: string;
}

/**
 * Payload for toggling a checkbox entry.
 */
export interface ToggleEntryPayload {
  taskId: number;
  date: string;
  completed: boolean;
}