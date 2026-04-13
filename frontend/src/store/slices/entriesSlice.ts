import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EntriesMap, EntriesState, ToggleEntryPayload } from "../../types/tracker.types";

const initialState: EntriesState = {
    entries: {},
    loading: false,
    error: null,
};

const entriesSlice = createSlice({
    name: "entries",
    initialState, 

    reducers: {
        toggleEntryLocal(state, action: PayloadAction<ToggleEntryPayload>) {
            const { taskId, date, completed } = action.payload;
            const key = `${taskId}-${date}`;
            state.entries[key] = completed;
        },

        setEntries(state, action: PayloadAction<EntriesMap>) {
            state.entries = action.payload;
        },

        setTaskEntries(
            state,
            action: PayloadAction<{
                taskId: number;
                entries: Record<string, boolean>
            }>
        ) {
            const { taskId, entries } = action.payload;

            Object.entries(entries).forEach(([date, completed]) => {
                const key = `${taskId}-${date}`;
                state.entries[key] = completed;
            });
        },

        removeTaskEntries(state, action: PayloadAction<number>) {
            const taskId = action.payload;

            const updated: EntriesMap = {};
            Object.entries(state.entries).forEach(([key, value]) => {
                if (!key.startsWith(`${taskId}-`)) {
                updated[key] = value;
                }
            });

            state.entries = updated;
        },

        revertToggleEntry(state, action: PayloadAction<ToggleEntryPayload>) {
            const { taskId, date, completed } = action.payload;
            const key = `${taskId}-${date}`;

            state.entries[key] = completed;
        },

        setEntriesLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setEntriesError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
    toggleEntryLocal,
    setEntries,
    setTaskEntries,
    removeTaskEntries,
    revertToggleEntry,
    setEntriesLoading,
    setEntriesError,
} = entriesSlice.actions;

export default entriesSlice.reducer;