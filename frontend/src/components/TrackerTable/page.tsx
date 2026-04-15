import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "../../styles/TrackerTable/tracker.module.css";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectAllTasks, selectEditedTitle, selectEditingTaskId, selectTaskLoading } from "../../store/selectors/taskSelectors";
import { removeTaskEntries, toggleEntryLocal } from "../../store/slices/entriesSlice";
import { addTaskLocal, clearEditing, deleteTaskLocal, setEditedTitle, setEditingTaskId, updateTaskLocal } from "../../store/slices/tasksSlice";
import { selectEntriesByKey } from "../../store/selectors/entrySelectors";
import { getCurrentStreak } from "../../utils/streak-system/currentStreak";
import { getLongestStreak } from "../../utils/streak-system/longestStreak";

const generateDaysForMonth = (year: number, month: number) => {
    const days = [];
    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

    for (let d = 1; d <= lastDay; d++) {
        const date = new Date(year, month, d);
        const formatted = date.toISOString().split("T")[0];
        const label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        days.push({ formatted, label });
    }

    return days;
};

export default function TrackerTable() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);

    const today = new Date();
    const [selectedYear, setSelectedYear] = React.useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = React.useState(today.getMonth());

    const dispatch = useAppDispatch();
    const tasks = useAppSelector(selectAllTasks) ?? [];
    const loading = useAppSelector(selectTaskLoading);
    const editingTaskId = useAppSelector(selectEditingTaskId);
    const editedTitle = useAppSelector(selectEditedTitle);

    const days = generateDaysForMonth(selectedYear, selectedMonth);
    const open = Boolean(anchorEl);
    const entries = useAppSelector((state) => state.entries.entries);

    const monthValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;

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
        <Box className={styles.container}>
            {/* ── Month Filter ── */}
            <Box className={styles.filterBar}>
                <input
                    type="month"
                    value={monthValue}
                    onChange={handleMonthChange}
                    className={styles.monthPicker}
                />
            </Box>

            <TableContainer className={styles.tableWrapper}>
                <Table className={styles.table}>

                    {/* ── Head ── */}
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.sticky}>Task</TableCell>
                            <TableCell align="center"
                                sx={{
                                    color: "white",
                                    fontSize: "14px"
                                }}>🔥 Streak</TableCell>
                            <TableCell align="center" sx={{ color: "white", fontSize: "14px" }}>🏆 Best</TableCell>
                            {days.map((day) => (
                                <TableCell sx={{
                                    color: "white",
                                }} key={day.formatted}>{day.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* ── Body ── */}
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                {/* ── Task Name Cell ── */}
                                <TableCell className={styles.sticky}>
                                    <Box className={styles.taskCell}>
                                        {editingTaskId === task.id ? (
                                            <input
                                                value={editedTitle}
                                                onChange={(e) =>
                                                    dispatch(setEditedTitle(e.target.value))
                                                }
                                                onKeyDown={handleEditKeyDown}
                                                autoFocus
                                                className={styles.input}
                                            />
                                        ) : (
                                            task.title
                                        )}

                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, task.id)}
                                            className={styles.menuBtn}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{
                                    color: "white",
                                }}>🔥 {getCurrentStreak(task.id, entries)}</TableCell>
                                <TableCell sx={{
                                    color: "white",
                                    margin: "2px",
                                    padding: "2px",
                                    textAlign: "center",
                                }}>🏆 {getLongestStreak(task.id, entries)}</TableCell>

                                {/* ── Checkbox Cells ── */}
                                {days.map((day) => (
                                    <CheckboxCell
                                        key={day.formatted}
                                        taskId={task.id}
                                        date={day.formatted}
                                        onToggle={toggleEntry}
                                    />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* ── Context Menu ── */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        if (selectedTaskId !== null) editTask(selectedTaskId);
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (selectedTaskId !== null) deleteTask(selectedTaskId);
                        handleMenuClose();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>

            {/* ── Add Task Button ── */}
            <Button onClick={addTask} className={styles.addBtn}>
                + Add Task
            </Button>
        </Box>
    );
}

// ─────────────────────────────────────────────
// CheckboxCell — isolated to safely call
// useAppSelector per cell inside the loop
// ─────────────────────────────────────────────

interface CheckboxCellProps {
    taskId: number;
    date: string;
    onToggle: (taskId: number, date: string, currentValue: boolean) => void;
}

function CheckboxCell({ taskId, date, onToggle }: CheckboxCellProps) {
    const checked = useAppSelector(selectEntriesByKey(taskId, date));

    return (
        <TableCell>
            <Checkbox
                checked={checked}
                onChange={() => onToggle(taskId, date, checked)}
                sx={{
                    color: "white",
                    "&.Mui-checked": { color: "white" },
                }}
            />
        </TableCell>
    );
}