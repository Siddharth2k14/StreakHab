export const getLongestStreak = (taskId: number, entries: any) => {
  let max = 0;
  let current = 0;

  const filteredDates = Object.keys(entries)
    .filter((key) => key.startsWith(`${taskId}-`))
    .sort();

  for (let key of filteredDates) {
    if (entries[key]) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }

  return max;
};