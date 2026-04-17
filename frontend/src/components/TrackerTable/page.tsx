import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "../../styles/TrackerTable/tracker.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { selectEntriesByKey } from "../../store/selectors/entrySelectors";
import { setEditedTitle } from "../../store/slices/tasksSlice";
import { getCurrentStreak } from "../../utils/streak-system/currentStreak";
import { getLongestStreak } from "../../utils/streak-system/longestStreak";
import type { EntriesMap, Task } from "../../types/tracker.types";

interface MethodPropss {
    handleMonthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>, taskId: number) => void;
    handleMenuClose: () => void;
    toggleEntry: ( taskId: number, date: string, currentValue: boolean ) => void;
    addTask: () => void;
    deleteTask: (taskId: number) => void;
    editTask: (taskId: number) => void;
}

interface StateProps {
    anchorEl: HTMLElement | null;
    selectedTaskId: number | null;
}

interface VariableProps {
    monthValue: string;
    days: Array<{ formatted: string; label: string }>;
    tasks: Task[];
    editingTaskId: number | null;
    editedTitle: string;
    entries: EntriesMap;
}

interface TrackerTablePropa {
    methods: MethodPropss;
    states: StateProps;
    variable: VariableProps;
}

export default function TrackerTable({ methods, states, variable }: TrackerTablePropa) {
    const dispatch = useAppDispatch();

    return (
        <Box className={styles.container}>
            {/* ── Month Filter ── */}
            <Box className={styles.filterBar}>
                <input
                    type="month"
                    value={variable.monthValue}
                    onChange={methods.handleMonthChange}
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
                            {variable.days.map((day) => (
                                <TableCell sx={{
                                    color: "white",
                                }} key={day.formatted}>{day.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* ── Body ── */}
                    <TableBody>
                        {variable.tasks.map((task) => (
                            <TableRow key={task.id}>
                                {/* ── Task Name Cell ── */}
                                <TableCell className={styles.sticky}>
                                    <Box className={styles.taskCell}>
                                        {variable.editingTaskId === task.id ? (
                                            <input
                                                value={variable.editedTitle}
                                                onChange={(e) =>
                                                    dispatch(setEditedTitle(e.target.value))
                                                }
                                                onKeyDown={methods.handleEditKeyDown}
                                                autoFocus
                                                className={styles.input}
                                            />
                                        ) : (
                                            task.title
                                        )}

                                        <IconButton
                                            onClick={(e) => methods.handleMenuOpen(e, task.id)}
                                            className={styles.menuBtn}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{
                                    color: "white",
                                }}>🔥 {getCurrentStreak(task.id, variable.entries)}</TableCell>
                                <TableCell sx={{
                                    color: "white",
                                    margin: "2px",
                                    padding: "2px",
                                    textAlign: "center",
                                }}>🏆 {getLongestStreak(task.id, variable.entries)}</TableCell>

                                {/* ── Checkbox Cells ── */}
                                {variable.days.map((day) => (
                                    <CheckboxCell
                                        key={day.formatted}
                                        taskId={task.id}
                                        date={day.formatted}
                                        onToggle={methods.toggleEntry}
                                    />
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* ── Context Menu ── */}
            <Menu anchorEl={states.anchorEl} open={Boolean(states.anchorEl)} onClose={methods.handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        if (states.selectedTaskId !== null) methods.editTask(states.selectedTaskId);
                        methods.handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (states.selectedTaskId !== null) methods.deleteTask(states.selectedTaskId);
                        methods.handleMenuClose();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>

            {/* ── Add Task Button ── */}
            <Button onClick={methods.addTask} className={styles.addBtn}>
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