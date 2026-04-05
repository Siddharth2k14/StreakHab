import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "../../styles/TrackerTable/tracker.module.css";
import React from "react";

const generateLast14Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        const formatted = date.toISOString().split("T")[0];
        const label = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });

        days.push({ formatted, label })
    }

    return days;
}

export default function TrackerTable() {
    const [tasks, setTasks] = React.useState([
        {
            id: 1,
            title: "Gym"
        },
        {
            id: 2,
            title: "Study"
        },
    ]);

    const [entries, setEntries] = React.useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedTaskId, setSelectedTaskId] = React.useState(null);
    const [editingTaskId, setEditingTaskId] = React.useState(null);
    const [editedTitle, setEditedTitle] = React.useState("");

    const days = generateLast14Days();
    const open = Boolean(anchorEl);

    // Toggle checkbox
    const toggleEntry = (taskId, date) => {
        const key = `${taskId}-${date}`;

        setEntries((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleMenuOpen = (event, taskId) => {
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
        if (!title) return;

        setTasks((prev) => [
            ...prev,
            { id: Date.now(), title },
        ]);
    };

    // Delete task
    const deleteTask = (taskId) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    const editTask = (taskId) => {
        const currentTask = tasks.find((t) => t.id === taskId);

        setEditingTaskId(taskId);
        setEditedTitle(currentTask.title);
    };

    const saveTask = () => {
        if (!editedTitle.trim()) return;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === editingTaskId
                    ? { ...task, title: editedTitle }
                    : task
            )
        );

        setEditingTaskId(null);
        setEditedTitle("");
    };

    return (
        <Box className={styles.container}>
            <TableContainer className={styles.tableWrapper}>
                <Table className={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.sticky}>Task</TableCell>
                            {days.map((day) => (
                                <TableCell key={day.formatted} sx={{ color: "white" }}>{day.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className={styles.sticky}>
                                    <Box className={styles.taskCell}>
                                        {editingTaskId === task.id ? (
                                            <input
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveTask();
                                                }}
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

                                {days.map((day) => {
                                    const key = `${task.id}-${day.formatted}`;
                                    const checked = entries[key] || false;

                                    return (
                                        <TableCell key={day.formatted}>
                                            <Checkbox
                                                checked={checked}
                                                onChange={() => toggleEntry(task.id, day.formatted)}
                                                sx={{
                                                    color: "white", // unchecked color
                                                    "&.Mui-checked": {
                                                        color: "white", // checked color
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        editTask(selectedTaskId);
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        deleteTask(selectedTaskId);
                        handleMenuClose();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>

            <Button
                onClick={addTask}
                className={styles.addBtn}
            >+ Add Task</Button>
        </Box>
    );
};