import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import entriesReducer from "./slices/entriesSlice";
import type { TaskState, EntriesState } from "../types/tracker.types";

type PersistedState = {
  tasks?: Partial<TaskState>;
  entries?: Partial<EntriesState>;
};

const loadState = (): PersistedState | undefined => {
  try {
    const data = localStorage.getItem("trackerState");
    if (!data) return undefined;

    return JSON.parse(data) as PersistedState;
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
