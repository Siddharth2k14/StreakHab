import { Box, Typography, Tooltip } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { selectAllTasks } from "../../../store/selectors/taskSelectors";

interface Day {
  formatted: string;
  label: string;
}

interface Props {
  days: Day[];
}

const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const CELL = 13;
const GAP = 3;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getColor = (ratio: number) => {
  if (ratio === 0) return LEVELS[0];
  if (ratio <= 0.25) return LEVELS[1];
  if (ratio <= 0.5) return LEVELS[2];
  if (ratio <= 0.75) return LEVELS[3];
  return LEVELS[4];
};

export default function HeatMap({ days }: Props) {
  const entries = useAppSelector((state) => state.entries.entries);
  const tasks = useAppSelector(selectAllTasks) ?? [];

  if (!days || days.length === 0) return null;

  // Pad start to align first day to correct day-of-week column
  const firstDow = new Date(days[0].formatted).getDay();
  const padded: (Day | null)[] = [...Array(firstDow).fill(null), ...days];

  // Chunk into weeks (columns of 7 rows)
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const first = week.find(Boolean) as Day | undefined;
    if (!first) return;
    const m = new Date(first.formatted).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        label: new Date(first.formatted).toLocaleDateString("en-US", { month: "short" }),
        col: wi,
      });
      lastMonth = m;
    }
  });

  const gridWidth = weeks.length * (CELL + GAP) - GAP;

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        bgcolor: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: "6px",
        p: "16px",
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      {/* Month labels */}
      <Box sx={{ display: "flex", ml: `${30}px`, position: "relative", height: 20, width: gridWidth }}>
        {monthLabels.map(({ label, col }) => (
          <Typography
            key={`${label}-${col}`}
            variant="caption"
            sx={{
              position: "absolute",
              left: col * (CELL + GAP),
              color: "#7d8590",
              fontSize: 11,
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Weekday labels + grid */}
      <Box sx={{ display: "flex", gap: "4px" }}>
        {/* Weekday labels */}
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: 26, mr: "4px" }}>
          {DOW.map((d, i) => (
            <Box key={d} sx={{ height: CELL + GAP, display: "flex", alignItems: "center" }}>
              {(i === 1 || i === 3 || i === 5) && (
                <Typography variant="caption" sx={{ color: "#7d8590", fontSize: 11 }}>
                  {d}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* CSS Grid: 7 rows × N week columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: `repeat(7, ${CELL}px)`,
            gridTemplateColumns: `repeat(${weeks.length}, ${CELL}px)`,
            gridAutoFlow: "column",
            gap: `${GAP}px`,
          }}
        >
          {weeks.map((week, wi) =>
            Array(7).fill(null).map((_, dow) => {
              const day = week[dow] ?? null;

              if (!day) {
                return (
                  <Box
                    key={`${wi}-${dow}`}
                    sx={{ width: CELL, height: CELL, gridRow: dow + 1, gridColumn: wi + 1 }}
                  />
                );
              }

              const total = tasks.length;
              const completed = tasks.filter(
                (t) => entries[`${t.id}-${day.formatted}`] === true
              ).length;
              const ratio = total > 0 ? completed / total : 0;

              return (
                <Tooltip
                  key={`${wi}-${dow}`}
                  title={
                    <Typography variant="caption">
                      {completed}/{total} tasks on {day.label}
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      width: CELL,
                      height: CELL,
                      borderRadius: "2px",
                      bgcolor: getColor(ratio),
                      outline: "1px solid rgba(255,255,255,0.06)",
                      gridRow: dow + 1,
                      gridColumn: wi + 1,
                      cursor: "pointer",
                      transition: "outline 0.1s",
                      "&:hover": { outline: "1px solid #58a6ff" },
                    }}
                  />
                </Tooltip>
              );
            })
          )}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", mt: "8px" }}>
        <Typography variant="caption" sx={{ color: "#7d8590", fontSize: 11, mr: "4px" }}>Less</Typography>
        {LEVELS.map((color) => (
          <Box
            key={color}
            sx={{
              width: 11,
              height: 11,
              borderRadius: "2px",
              bgcolor: color,
              outline: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
        <Typography variant="caption" sx={{ color: "#7d8590", fontSize: 11, ml: "4px" }}>More</Typography>
      </Box>
    </Box>
  );
}
