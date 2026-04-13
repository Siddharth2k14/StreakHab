import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaskState, Task } from "../../types/tracker.types";

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    editingTaskId: null,
    editedTitle: "",
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,

    reducers: {
        addTaskLocal(state, action: PayloadAction<Task>){
            state.tasks.push(action.payload);
        },

        updateTaskLocal(state, action: PayloadAction<{ 
            id: number;
            title: string;
        }>) {
            const task = state.tasks.find((t) => t.id === action.payload.id);
            if (task) {
                task.title = action.payload.title;
                task.updatedAt = new Date().toISOString();
            }
        },

        deleteTaskLocal(state, action: PayloadAction<number>) {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        },

        setTasks(state, action: PayloadAction<Task[]>) {
            state.tasks = action.payload;
        },

        setEditingTaskId(state, action: PayloadAction<number | null>) {
            state.editingTaskId = action.payload;

            if (action.payload === null) {
                state.editedTitle = "";
            } else {
                const task = state.tasks.find((t) => t.id === action.payload);
                state.editedTitle = task ? task.title : "";
            }
        },

        setEditedTitle(state, action: PayloadAction<string>) {
            state.editedTitle = action.payload;
        },

        clearEditing(state) {
            state.editingTaskId = null;
            state.editedTitle = "";
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
    addTaskLocal,
    updateTaskLocal,
    deleteTaskLocal,
    setTasks,
    setEditingTaskId,
    setEditedTitle,
    clearEditing,
    setLoading,
    setError,
} = taskSlice.actions;

export default taskSlice.reducer;