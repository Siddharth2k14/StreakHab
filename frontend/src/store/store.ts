import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import entriesReducer from "./slices/entriesSlice";
import authReducer from "./slices/authSlice";
import type { TaskState, EntriesState } from "../types/tracker.types";

type PersistedState = {
  tasks?: Partial<TaskState>;
  entries?: Partial<EntriesState>;
};

const migrateEntries = (entries: Record<string, boolean>): Record<string, boolean> => {
  const migrated: Record<string, boolean> = {};

  for (const [key, value] of Object.entries(entries)) {
    // Keys are in format "taskId-YYYY-MM-DD"
    const match = key.match(/^(\d+)-(\d{4}-\d{2}-\d{2})$/);
    if (!match) {
      migrated[key] = value;
      continue;
    }

    const [, taskId, dateStr] = match;
    // Check if this date is off by one (UTC shift artifact):
    // Re-parse using Date constructor (which treats YYYY-MM-DD as UTC)
    // and compare to local date string
    const utcDate = new Date(dateStr);
    const localStr = `${utcDate.getFullYear()}-${String(utcDate.getMonth() + 1).padStart(2, "0")}-${String(utcDate.getDate()).padStart(2, "0")}`;

    if (localStr !== dateStr) {
      // Shift the key to the correct local date
      migrated[`${taskId}-${localStr}`] = value;
    } else {
      migrated[key] = value;
    }
  }

  return migrated;
};


const loadState = (): PersistedState | undefined => {
  try {
    const data = localStorage.getItem("trackerState");
    if (!data) return undefined;

    const parsed = JSON.parse(data) as PersistedState;

    if (parsed.entries?.entries) {
      parsed.entries.entries = migrateEntries(parsed.entries.entries);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load state", error);
    return undefined;
  }
};

// Cast to unknown first to avoid RTK 2.x generic inference conflict
const preloadedState = loadState() as unknown;

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    entries: entriesReducer,
    auth: authReducer,
  },

  ...(preloadedState ? { preloadedState } : {}),

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["tasks/setEditingTaskId"],
    },
  }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  try {
    const state = store.getState();

    localStorage.setItem(
      "trackerState",
      JSON.stringify({
        tasks: { tasks: state.tasks.tasks },
        entries: { entries: state.entries.entries },
      })
    );
  } catch (error) {
    console.error("Failed to save state", error);
  }
});
