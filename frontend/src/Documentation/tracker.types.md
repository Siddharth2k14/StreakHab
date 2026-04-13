# Interface Task
-   id: Represents the task id and it is of "Number" type.
-   title: Represents the title of the task and it is of "String" type.
-   createdAt: Represents the date/time at which the task is created for the first time and it is of "String" type.
-   updatedAt: Represents the date/time at which the task is updated recently and it is of "String" type.

# Interface Entry
-   taskId: Represents the id of the task for which this entry is for and it is of "Number" type.
-   date: Represents the date at which this entry is made and it is of "String" type.
-   completed: Represents the status of the entry whether it is completed or not and it is of "Boolean" type.

# Interface TaskState
-   task: Represents the array of the tasks and it is of "Task" interface.
-   loading: Represents the loading state whether it is loading or not and it is of "Boolean" type.
-   error: Represents the error of the taskState and it is of "String" or "null" type.
-   editingTaskId: Represents the TaskId that is being editing and it is of "Number" or "null" type.
-   editedTitle: Represents the title of the edited task and it is of "String" type.

# Interface EntriesState
-   entries: Represents the entries and it is of "EntriesMap" type.
-   loading: Represents the loading state whether the entries are loading or not and it is of "Boolean" type.
-   error: Represents the error of the entriesState and it is of "String" or "null" type.

# Interface CreateTaskPayload
-   title: Represents the title of the task and it is of "String" type.

# Interface UpdateTaskPayload
-   id: Represents the id of the task that is being updated and it is of "Number" type.
-   title: Represents the title of the task that is being updated and it is of "String" type.

# Interface ToggleEntryPayload
-   taskId: Represents the id of the task and it is of "Number" type.
-   date: Represents the date of the task when it get toggled and it is of "String" type.
-   completed: Represents the completed state whether the toggle is completed or not and it is of "Boolean" type.