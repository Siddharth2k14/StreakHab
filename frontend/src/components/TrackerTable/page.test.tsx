import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TrackerTable from './page';
import { renderWithProviders } from '../../test-utils';

// Mock window.prompt
vi.spyOn(window, 'prompt').mockImplementation(() => 'New Task Title');

describe('TrackerTable Component', () => {
    it('renders the component with headers and Add Task button', () => {
        renderWithProviders(<TrackerTable />);

        // Expect to find "Task" header
        expect(screen.getByText('Task')).toBeInTheDocument();

        // Expect to find "Add Task" button
        expect(screen.getByRole('button', { name: /\+ Add Task/i })).toBeInTheDocument();

        // Check if 14 days of headers are rendered (plus the Task header)
        const rowGroup = screen.getAllByRole('rowgroup');
        const thead = rowGroup[0];
        const headers = thead.querySelectorAll('th');
        expect(headers).toHaveLength(15); // 1 for 'Task' + 14 for days
    });

    it('adds a new task when Add Task is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TrackerTable />);

        const addBtn = screen.getByRole('button', { name: /\+ Add Task/i });

        await user.click(addBtn);

        expect(window.prompt).toHaveBeenCalledWith('Enter task name');

        // After adding, the task should appear in the document
        expect(screen.getByText('New Task Title')).toBeInTheDocument();
    });

    it('edits an existing task', async () => {
        const user = userEvent.setup();

        const preloadedState = {
            tasks: {
                tasks: [{ id: 1, title: 'Old Task Title', createdAt: '', updatedAt: '' }],
                loading: false,
                error: null,
                editingTaskId: null,
                editedTitle: '',
            },
            entries: {
                entries: {},
                loading: false,
                error: null,
            }
        };

        renderWithProviders(<TrackerTable />, { preloadedState });

        // Wait for old task to be visible
        expect(screen.getByText('Old Task Title')).toBeInTheDocument();

        // Click the menu button (which has the MoreVertIcon)
        // Since there is also the "Add Task" button, we will use a more specific query
        const menuBtn = screen.getByTestId('MoreVertIcon').closest('button') as HTMLButtonElement;
        await user.click(menuBtn);

        // Click "Edit"
        const editOption = screen.getByText('Edit');
        await user.click(editOption);

        // Expect input to be focused and have the current title
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('Old Task Title');

        // Change the title
        await user.clear(input);
        await user.type(input, 'Updated Task Title{enter}');

        // Wait for the new title to be rendered
        expect(screen.getByText('Updated Task Title')).toBeInTheDocument();
        expect(screen.queryByText('Old Task Title')).not.toBeInTheDocument();
    });

    it('deletes an existing task', async () => {
        const user = userEvent.setup();

        const preloadedState = {
            tasks: {
                tasks: [{ id: 1, title: 'Task to Delete', createdAt: '', updatedAt: '' }],
                loading: false,
                error: null,
                editingTaskId: null,
                editedTitle: '',
            },
            entries: {
                entries: {},
                loading: false,
                error: null,
            }
        };

        renderWithProviders(<TrackerTable />, { preloadedState });

        expect(screen.getByText('Task to Delete')).toBeInTheDocument();

        // Click the menu button
        const menuBtn = screen.getByTestId('MoreVertIcon').closest('button') as HTMLButtonElement;
        await user.click(menuBtn);

        // Click "Delete"
        const deleteOption = screen.getByText('Delete');
        await user.click(deleteOption);

        // Task should be removed
        expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });

    it('toggles a checkbox for a task entry', async () => {
        const user = userEvent.setup();

        const preloadedState = {
            tasks: {
                tasks: [{ id: 1, title: 'Task 1', createdAt: '', updatedAt: '' }],
                loading: false,
                error: null,
                editingTaskId: null,
                editedTitle: '',
            },
            entries: {
                entries: {},
                loading: false,
                error: null,
            }
        };

        renderWithProviders(<TrackerTable />, { preloadedState });

        // Initially no checkboxes are checked
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).not.toBeChecked();

        // Click first checkbox
        await user.click(checkboxes[0]);

        // It should now be checked
        expect(checkboxes[0]).toBeChecked();

        // Click it again to uncheck
        await user.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();
    });
});