export const getCurrentStreak = (taskId: number, entries: any) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        const formatted = date.toISOString().split("T")[0];
        const key = `${taskId}-${formatted}`;

        if (entries[key]) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};