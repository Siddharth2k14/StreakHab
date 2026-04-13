import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import entriesReducer from "./slices/entriesSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        entries: entriesReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["tasks/setEditingTaskId"],
        },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;