| Reducer             | Trigger                          | Purpose                                      |
|---------------------|----------------------------------|----------------------------------------------|
| addTaskLocal        | After POST /tasks                | Pushes new task into state                   |
| updateTaskLocal     | After PUT /tasks/:id             | Updates title + updatedAt in place           |
| deleteTaskLocal     | After DELETE /tasks/:id          | Filters out deleted task                     |
| setTasks            | On app load (GET /tasks)         | Replaces full task list from API             |
| setEditingTaskId    | Click Edit menu                  | Sets editing mode + pre-fills title          |
| setEditedTitle      | Input onChange                   | Tracks live input value                      |
| clearEditing        | Save or Cancel                   | Resets editing state                         |
| setLoading          | Thunk start/end                  | Manages loading spinner                      |
| setError            | Thunk catch block                | Stores error message                         |