import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { useAppSelector } from "../../../store/hooks";

interface PieChartProps {
    taskId: number | null;
    days: {
        formatted: string;
        label: string;
    }[];
}

export default function PieChartLayout({ taskId, days }: PieChartProps) {
    const entries = useAppSelector((state) => state.entries.entries);

    let completed = 0;
    let missed = 0;

    days.forEach((day) => {
        const key = `${taskId}-${day.formatted}`;
        if (entries[key]) completed++;
        else missed++;
    });

    const data = [
        { name: "Completed", value: completed },
        { name: "Missed", value: missed },
    ];

    const COLORS = ["#4caf50", "#060000ff"];

    return (
        <PieChart width={300} height={300}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
            >
                {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                ))}
            </Pie>

            <Tooltip />
            <Legend
                wrapperStyle={{
                    backgroundColor: "#ffffffff",
                    padding: "10px",
                    borderRadius: "8px",
                }}
            />

        </PieChart>
    )
}