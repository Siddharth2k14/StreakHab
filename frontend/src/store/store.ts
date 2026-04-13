import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import entriesReducer from "./slices/entriesSlice";

const loadState = () => {
  try {
    const data = localStorage.getItem("trackerState");
    if (!data) return undefined;

    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load state", error);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        entries: entriesReducer,
    },

    preloadedState,

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["tasks/setEditingTaskId"],
        },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  try {
    const state = store.getState();

    localStorage.setItem(
      "trackerState",
      JSON.stringify({
        tasks: state.tasks.tasks,
        entries: state.entries.entries,
      })
    );
  } catch (error) {
    console.error("Failed to save state", error);
  }
});