import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";

interface Props {
  taskId: number;
  days: { formatted: string; label: string }[];
}

export default function HeatMap({ taskId, days }: Props) {
  const entries = useAppSelector((state) => state.entries.entries);

  return (
    <Box>
      <Typography variant="h6">HeatMap</Typography>

      <Box sx={{ display: "flex", gap: "6px", mt: 2 }}>
        {days.map((day) => {
          const key = `${taskId}-${day.formatted}`;
          const completed = entries[key];

          return (
            <Box
              key={day.formatted}
              title={day.label}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "4px",
                backgroundColor: completed ? "#4caf50" : "#2a2a2a",
                border: "1px solid #444",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}