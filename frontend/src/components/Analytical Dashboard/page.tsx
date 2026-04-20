import { Box, Typography, Tabs, Tab } from "@mui/material";
import React from "react";
import HeatMap from "./HeatMap/page.tsx";
import Overview from "./Overview/page.tsx";

interface AnalyticalDashProps {
    days: Array<{ formatted: string; label: string }>;
    selectedTaskId: number | null;
}

export default function AnalyticalDash({ days, selectedTaskId }: AnalyticalDashProps) {
    const [selectedView, setSelectedView] = React.useState("Overview");

    return (
        <Box>
            <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
                Analytics
            </Typography>

            <Tabs
                value={selectedView}
                onChange={(_, val) => setSelectedView(val)}
                sx={{
                    borderBottom: "1px solid #333",
                    "& .MuiTab-root": { color: "#aaa" },
                    "& .Mui-selected": { color: "white" },
                    "& .MuiTabs-indicator": { backgroundColor: "#7c4dff" },
                }}
            >
                <Tab label="Overview" value="Overview" />
                <Tab label="HeatMap" value="HeatMap" />
            </Tabs>

            <Box mt={3}>
                {selectedView === "Overview" && <Overview taskId={selectedTaskId} days={days} />}
                {selectedView === "HeatMap" && <HeatMap days={days} />}
            </Box>
        </Box>
    );
}
