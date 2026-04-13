1. Importing the "configureStore" dependency from redux toolkit.
2. Importing the reducers like tasksReducers and entriesReducers.
3. Configuring the stores with the reducers and adding a middleware to make sure the data that we are passing are serializable data.
4. Exporting the configured store, RootState with return type as store.getState and AppDispatch having the type same as store.dispatch.