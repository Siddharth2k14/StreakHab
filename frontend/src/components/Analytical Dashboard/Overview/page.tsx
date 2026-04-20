import { Box, Typography, IconButton, Collapse, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CloseFullscreen } from "@mui/icons-material";
import { useState } from "react";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { useAppSelector } from "../../../store/hooks";
import { getCurrentStreak } from "../../../utils/streak-system/currentStreak";
import { getLongestStreak } from "../../../utils/streak-system/longestStreak";
import PieChartLayout from "../Pie Chart/page";
import { OpenInFull } from "@mui/icons-material";

interface Props {
    taskId: number | null;
    days: { formatted: string; label: string }[];
}

type StatKey = "current" | "best" | "completion" | "missed" | "consistency";

export default function Overview({ taskId, days }: Props) {
    const entries = useAppSelector((state) => state.entries.entries);
    const [expanded, setExpanded] = useState<StatKey | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    // All dates this task has ever been tracked (completed or not)
    // We derive total tracked days from the earliest entry to today
    const allTaskKeys = Object.keys(entries).filter((k) => k.startsWith(`${taskId}-`));
    const allCompletedDates = allTaskKeys.filter((k) => entries[k]).map((k) => k.replace(`${taskId}-`, "")).sort();

    // Total tracked days = from first ever entry date to today
    const localToday = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();

    let totalTrackedDays = 0;
    let completedAllTime = 0;

    if (allTaskKeys.length > 0) {
        const firstDate = allTaskKeys.map((k) => k.replace(`${taskId}-`, "")).sort()[0];
        const start = new Date(firstDate);
        const end = new Date(localToday);
        totalTrackedDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
        completedAllTime = allCompletedDates.length;
    }

    const completion = totalTrackedDays > 0 ? Math.round((completedAllTime / totalTrackedDays) * 100) : 0;
    const missed = totalTrackedDays - completedAllTime;
    const consistency = completion;
    const currentStreak = getCurrentStreak(taskId, entries);
    const bestStreak = getLongestStreak(taskId, entries);

    // Build per-day data for charts
    const dailyData = days.map((day) => {
        const key = `${taskId}-${day.formatted}`;
        return {
            label: day.label.slice(5), // e.g. "Apr 20"
            done: entries[key] ? 1 : 0,
        };
    });


    // Rolling completion %
    const completionData = days.map((day, i) => {
        const slice = days.slice(0, i + 1);
        const c = slice.filter((d) => entries[`${taskId}-${d.formatted}`]).length;
        return { label: day.label.slice(5), pct: Math.round((c / slice.length) * 100) };
    });

    // Missed per week
    const missedData: { label: string; missed: number }[] = [];
    for (let i = 0; i < days.length; i += 7) {
        const week = days.slice(i, i + 7);
        const m = week.filter((d) => !entries[`${taskId}-${d.formatted}`]).length;
        missedData.push({ label: `W${Math.floor(i / 7) + 1}`, missed: m });
    }

    const toggle = (key: StatKey) =>
        setExpanded((prev) => (prev === key ? null : key));

    const stats: { key: StatKey; label: string; value: any }[] = [
        { key: "current", label: "🔥 Current", value: currentStreak },
        { key: "best", label: "🏆 Best", value: bestStreak },
        { key: "completion", label: "📈 Completion", value: `${completion}%` },
        { key: "missed", label: "❌ Missed", value: missed },
        { key: "consistency", label: "🎯 Consistency", value: `${consistency}%` },
    ];

    const chartContent = (height: number) => (<>
        {expanded === "current" && (() => {
            const allDates = Object.keys(entries)
                .filter((k) => k.startsWith(`${taskId}-`) && entries[k])
                .map((k) => k.replace(`${taskId}-`, ""))
                .sort();

            let cur = 0;
            const currentData: { label: string; streak: number }[] = [];

            allDates.forEach((dateStr, i) => {
                if (i === 0) {
                    cur = 1;
                } else {
                    const prev = new Date(allDates[i - 1]);
                    const curr = new Date(dateStr);
                    const diff = (curr.getTime() - prev.getTime()) / 86400000;
                    cur = diff === 1 ? cur + 1 : 1;
                }
                const d = new Date(dateStr);
                const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }).slice(0, 6);
                currentData.push({ label, streak: cur });
            });

            return (
                <ChartWrapper title="🔥 Streak History" height={height}>
                    <LineChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="label" tick={{ fill: "#aaa", fontSize: 11 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "#1e1e1e", border: "none" }} formatter={(v) => [v, "Streak on this day"]} />
                        <Line type="natural" dataKey="streak" stroke="#ff6b35" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartWrapper>
            );
        })()}
        {expanded === "best" && (() => {
            // Build best-streak-over-time from ALL entry keys, not just current month
            const allDates = Object.keys(entries)
                .filter((k) => k.startsWith(`${taskId}-`) && entries[k])
                .map((k) => k.replace(`${taskId}-`, ""))
                .sort();

            let cur = 0;
            let best = 0;
            const bestData: { label: string; best: number }[] = [];

            allDates.forEach((dateStr, i) => {
                if (i === 0) {
                    cur = 1;
                } else {
                    const prev = new Date(allDates[i - 1]);
                    const curr = new Date(dateStr);
                    const diff = (curr.getTime() - prev.getTime()) / 86400000;
                    cur = diff === 1 ? cur + 1 : 1;
                }
                best = Math.max(best, cur);
                const d = new Date(dateStr);
                const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }).slice(0, 6);
                bestData.push({ label, best });
            });

            return (
                <ChartWrapper title="🏆 Best Streak Progression" height={height}>
                    <LineChart data={bestData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="label" tick={{ fill: "#aaa", fontSize: 11 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "#1e1e1e", border: "none" }} formatter={(v) => [v, "Best Streak"]} />
                        <Line type="natural" dataKey="best" stroke="#ffd700" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartWrapper>
            );
        })()}
        {expanded === "completion" && (
            <ChartWrapper title="📈 Completion Rate Over Time" height={height}>
                <LineChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="label" tick={{ fill: "#aaa", fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis unit="%" tick={{ fill: "#aaa", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#1e1e1e", border: "none" }} formatter={(v) => `${v}%`} />
                    <Line type="natural" dataKey="pct" stroke="#4caf50" strokeWidth={2} dot={true} />
                </LineChart>
            </ChartWrapper>
        )}
        {expanded === "missed" && (
            <ChartWrapper title="❌ Missed Days Per Week" height={height}>
                <LineChart data={missedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="label" tick={{ fill: "#aaa", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#1e1e1e", border: "none" }} />
                    <Line type="natural" dataKey="missed" stroke="#f44336" strokeWidth={2} dot={true} />
                </LineChart>
            </ChartWrapper>
        )}
        {expanded === "consistency" && (
            <ChartWrapper title="🎯 Daily Consistency" height={height}>
                <LineChart data={dailyData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="label" tick={{ fill: "#aaa", fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "#aaa", fontSize: 11 }} ticks={[0, 1]} />
                    <Tooltip contentStyle={{ background: "#1e1e1e", border: "none" }} formatter={(v) => (v ? "Done" : "Missed")} />
                    <Line type="monotone" dataKey="done" stroke="#7c4dff" strokeWidth={2} dot={true} />
                </LineChart>
            </ChartWrapper>
        )}
    </>);

    return (
        <Box sx={{ color: "white", mt: 3 }}>
            {/* Main row: Pie | Chart (expandable) | Stats */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                {/* Pie chart */}
                <Box display="flex" justifyContent="center" flexShrink={0}>
                    <PieChartLayout taskId={taskId} days={days} />
                </Box>

                {/* Stats column */}
                <Box sx={{ display: "flex", flexDirection: expanded ? "column" : "row" , gap: 2, flexShrink: 0 }}>
                    {stats.map(({ key, label, value }) => (
                        <StatCard
                            key={key}
                            label={label}
                            value={value}
                            active={expanded === key}
                            onClick={() => toggle(key)}
                        />
                    ))}
                </Box>

                {/* Inline expandable chart */}
                <Collapse in={expanded !== null} unmountOnExit orientation="horizontal"
                    sx={{ flex: expanded ? 1 : 0 }}
                >
                    <Box
                        sx={{
                            background: "#1a1a2e",
                            borderRadius: "12px",
                            p: 3,
                            position: "relative",
                            width: "700px",
                        }}
                    >
                        {/* Close button */}
                        <IconButton
                            onClick={() => setExpanded(null)}
                            size="small"
                            sx={{ position: "absolute", top: 8, right: 44, color: "white", background: "#333", "&:hover": { background: "#555" } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>

                        {/* Open in full button */}
                        <IconButton
                            onClick={() => setFullscreen(true)}
                            size="small"
                            sx={{ position: "absolute", top: 8, right: 8, color: "white", background: "#333", "&:hover": { background: "#555" } }}
                        >
                            <OpenInFull fontSize="small" />
                        </IconButton>

                        {chartContent(220)}
                    </Box>
                </Collapse>
            </Box>

            {/* Fullscreen Dialog */}
            <Dialog
                open={fullscreen}
                onClose={() => setFullscreen(false)}
                fullWidth
                maxWidth="lg"
                PaperProps={{ sx: { background: "#1a1a2e", borderRadius: "12px", p: 2 } }}
            >
                <DialogContent sx={{ position: "relative", p: 3 }}>
                    <IconButton
                        onClick={() => setFullscreen(false)}
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 44, color: "white", background: "#333", "&:hover": { background: "#555" } }}
                    >
                        <CloseFullscreen fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={() => { setFullscreen(false); setExpanded(null); }}
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8, color: "white", background: "#333", "&:hover": { background: "#555" } }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    {chartContent(460)}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

function StatCard({ label, value, active, onClick }: {
    label: string; value: any; active: boolean; onClick: () => void;
}) {
    return (
        <Box
            onClick={onClick}
            sx={{
                textAlign: "center",
                padding: "10px 20px",
                background: active ? "#2a2a4a" : "#1e1e1e",
                borderRadius: "8px",
                minWidth: 100,
                cursor: "pointer",
                border: active ? "1px solid #7c4dff" : "1px solid transparent",
                transition: "all 0.2s",
                "&:hover": { background: "#2a2a3a", border: "1px solid #555" },
            }}
        >
            <Typography variant="body2">{label}</Typography>
            <Typography variant="h6">{value}</Typography>
        </Box>
    );
}

function ChartWrapper({ title, height, children }: { title: string; height: number; children: React.ReactNode }) {
    return (
        <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "#ccc" }}>{title}</Typography>
            <ResponsiveContainer width="100%" height={height}>
                {children as React.ReactElement}
            </ResponsiveContainer>
        </Box>
    );
}
