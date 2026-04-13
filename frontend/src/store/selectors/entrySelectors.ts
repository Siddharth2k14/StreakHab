import type { RootState } from "../store"

export const selectAllEntries = (state: RootState) => state.entries.entries;
export const selectEntriesByKey = (taskId: number, date: string) => (state: RootState) => state.entries.entries[`${taskId}-${date}`] ?? false;
export const selectEntriesByTaskId = (taskId: number) => (state: RootState) => {
    const allEntries = state.entries.entries;
    const taskEntries: Record<string, boolean> = {};

    Object.entries(allEntries).forEach(([key, value]) => {
        if(key.startsWith(`${taskId}-`)) {
            const date = key.replace(`${taskId}-`, "");
            taskEntries[date] = value;
        };
    });
    return taskEntries;
};
export const selectEntriesLoading = (state: RootState) => state.entries.loading;
export const selectEntriesError = (state: RootState) => state.entries.error;