| Reducer             | Trigger                        | Purpose                                      |
|---------------------|--------------------------------|----------------------------------------------|
| toggleEntryLocal    | Checkbox onChange              | Optimistically flips checkbox in state       |
| setEntries          | On app load (GET /entries)     | Replaces full entries map from API           |
| setTaskEntries      | Per-task fetch                 | Merges a single task's entries into map      |
| removeTaskEntries   | On task delete                 | Cleans up all entries for that task          |
| revertToggleEntry   | API toggle fails               | Rolls back optimistic toggle                 |
| setEntriesLoading   | Thunk start/end                | Manages loading state                        |
| setEntriesError     | Thunk catch block              | Stores error message                         |