import { Box, Menu, MenuItem, Typography, Button } from "@mui/material";
import React from "react";
import HeatMap from "./HeatMap/page.tsx";
import { useAppSelector } from "../../store/hooks.ts";
import { selectAllTasks } from "../../store/selectors/taskSelectors.ts";
import type { Task } from "../../types/tracker.types.ts";

interface AnalyticalDashProps {
    days: Array<{ formatted: string; label: string }>;
}

export default function AnalyticalDash({ days }: AnalyticalDashProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedView, setSelectedView] = React.useState<string>("");
    const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);

    const tasks = useAppSelector(selectAllTasks);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectFun = (name: string) => {
        setSelectedView(name); // ✅ store selection
        handleClose(); // ✅ close menu
    };

    React.useEffect(() => {
        if (tasks.length > 0 && selectedTaskId === null) {
            setSelectedTaskId(tasks[0].id);
        }
    }, [tasks]);

    return (
        <Box>
            <Typography variant="h4" textAlign="center">
                Analytics
            </Typography>

            {/* Button to open menu */}
            <Button onClick={handleOpen} variant="contained">
                Select View
            </Button>

            {/* Menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => selectFun("HeatMap")}>
                    HeatMap
                </MenuItem>
                <MenuItem onClick={() => selectFun("Pie Chart")}>
                    Pie Chart
                </MenuItem>
                <MenuItem onClick={() => selectFun("Consistency Trend")}>
                    Consistency Trend
                </MenuItem>
            </Menu>

            {/* Selected View Output */}
            <Box mt={3} textAlign="center">
                {selectedView && (
                    <Typography variant="h6">{selectedView}</Typography>
                )}

                {selectedView === "HeatMap" && selectedTaskId !== null && (
                    <HeatMap taskId={selectedTaskId} days={days} />
                )}
            </Box>
        </Box>
    );
}