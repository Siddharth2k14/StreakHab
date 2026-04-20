import React from "react";
import { Box } from "@mui/material";
import TrackerTable from "../../components/TrackerTable/page";
import AnalyticalDash from "../../components/Analytical Dashboard/page";
import { selectAllTasks, selectEditedTitle, selectEditingTaskId, selectTaskLoading } from "../../store/selectors/taskSelectors";
import { removeTaskEntries, toggleEntryLocal } from "../../store/slices/entriesSlice";
import { addTaskLocal, clearEditing, deleteTaskLocal, setEditingTaskId, updateTaskLocal } from "../../store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function TrackerPage() {
    const today = new Date();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);
    const [analyticsTaskId, setAnalyticsTaskId] = React.useState<number | null>(null);
    const [selectedYear, setSelectedYear] = React.useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = React.useState(today.getMonth());

    const dispatch = useAppDispatch();
    const tasks = useAppSelector(selectAllTasks) ?? [];
    const loading = useAppSelector(selectTaskLoading);

    // Default to first task for analytics
    React.useEffect(() => {
        if (tasks.length > 0 && analyticsTaskId === null) {
            setAnalyticsTaskId(tasks[0].id);
        }
    }, [tasks]);
    const editingTaskId = useAppSelector(selectEditingTaskId);
    const editedTitle = useAppSelector(selectEditedTitle);

    const entries = useAppSelector((state) => state.entries.entries);

    const generateDaysForMonth = (year: number, month: number) => {
        const days = [];
        const today = new Date();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
        const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

        for (let d = 1; d <= lastDay; d++) {
            const yyyy = year;
            const mm = String(month + 1).padStart(2, "0");
            const dd = String(d).padStart(2, "0");
            const formatted = `${yyyy}-${mm}-${dd}`;
            const date = new Date(year, month, d);
            const label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            days.push({ formatted, label });
        }

        return days;
    };

    const monthValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    const days = generateDaysForMonth(selectedYear, selectedMonth);


    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [y, m] = e.target.value.split("-").map(Number);
        setSelectedYear(y);
        setSelectedMonth(m - 1);
    };

    // Toggle checkbox
    const toggleEntry = (taskId: number, date: string, currentValue: boolean) => {
        dispatch(toggleEntryLocal({
            taskId,
            date,
            completed: !currentValue,
        }));
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedTaskId(taskId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTaskId(null);
    };

    // Add new task
    const addTask = () => {
        const title = prompt("Enter task name");
        if (!title?.trim()) return;

        dispatch(addTaskLocal({
            id: Date.now(),
            title: title.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
    };

    // Delete task
    const deleteTask = (taskId: number) => {
        dispatch(deleteTaskLocal(taskId));
        dispatch(removeTaskEntries(taskId));
    };

    const editTask = (taskId: number) => {
        dispatch(setEditingTaskId(taskId));
    };

    const saveTask = () => {
        if (!editedTitle.trim() || editingTaskId === null) return;

        dispatch(updateTaskLocal({
            id: editingTaskId,
            title: editedTitle.trim(),
        }));

        dispatch(clearEditing());
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") saveTask();
        if (e.key === "Escape") dispatch(clearEditing());
    };


    if (loading) return <Box sx={{ color: "white" }}>Loading...</Box>;

    return (
        <Box>
            <TrackerTable 
                methods = {{ handleMonthChange, handleEditKeyDown, handleMenuOpen, handleMenuClose, toggleEntry, addTask, deleteTask, editTask, onTaskClick: setAnalyticsTaskId }}
                states = {{ anchorEl, selectedTaskId }}
                variable = {{ monthValue, days, tasks, editingTaskId, editedTitle, entries }}
            />
            <AnalyticalDash days={days} selectedTaskId={analyticsTaskId} />
        </Box>
    )
}