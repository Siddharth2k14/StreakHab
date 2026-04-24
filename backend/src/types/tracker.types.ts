interface Task {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

interface Entries {
    task_id: number;
    date: string;
    completed: boolean;
}

interface createTaskBody {
    title: string;
}

interface updateTaskBody {
    title: string;
}

interface ToggleEntryBody {
    task_id: number;
    date: string;
    completed: boolean;
}

interface GetEntriesQuery {
    task_id: string
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface ApiError {
    success: false;
    message: string;
}

export  {
    Task,
    Entries,
    createTaskBody,
    updateTaskBody,
    ToggleEntryBody,
    GetEntriesQuery,
    ApiResponse,
    ApiError
};