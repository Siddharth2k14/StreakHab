import React from 'react';
import type { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedStateShapeFromReducersMapObject } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { AppStore } from './store/store';
// As a basic setup, import your same slice reducers
import tasksReducer from './store/slices/tasksSlice';
import entriesReducer from './store/slices/entriesSlice';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedStateShapeFromReducersMapObject<{tasks: typeof tasksReducer, entries: typeof entriesReducer}>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
        tasks: { tasks: [], loading: false, error: null, editingTaskId: null, editedTitle: "" },
        entries: { entries: {}, loading: false, error: null }
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { tasks: tasksReducer as any, entries: entriesReducer as any },
      preloadedState: preloadedState as any,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
          serializableCheck: {
              ignoredActions: ["tasks/setEditingTaskId"],
          },
      }),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}