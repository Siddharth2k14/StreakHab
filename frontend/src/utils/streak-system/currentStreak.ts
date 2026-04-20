export const getCurrentStreak = (taskId: number | null, entries: any) => {
    let streak = 0;

    const localDate = (offset: number) => {
        const d = new Date();
        d.setDate(d.getDate() - offset);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = localDate(0);
    const yesterdayStr = localDate(1);
    const todayKey = `${taskId}-${todayStr}`;

    // Debug: log what keys exist for this task
    const taskKeys = Object.keys(entries).filter(k => k.startsWith(`${taskId}-`));
    console.log("[streak] today:", todayStr, "| yesterday:", yesterdayStr);
    console.log("[streak] today key found:", entries[todayKey], "| all keys:", taskKeys);

    // If today isn't done yet, allow streak to still count from yesterday
    const startOffset = entries[todayKey] ? 0 : 1;

    for (let i = startOffset; i < 365; i++) {
        const key = `${taskId}-${localDate(i)}`;
        if (entries[key]) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};