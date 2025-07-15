import { useState, ChangeEvent } from "react";

export type DateRange = { startDay: Date; endDay: Date };

export const useDateRange = (day: number) => {
  const today = new Date();
  const pastDate = new Date(today.getTime() - day * 24 * 60 * 60 * 1000);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDay: pastDate,
    endDay: today,
  });

  const changeDateRange =
    (key: keyof typeof dateRange) => (e: ChangeEvent<HTMLInputElement>) => {
      setDateRange((date) => ({ ...date, [key]: new Date(e.target.value) }));
    };

  return { dateRange, setDateRange, changeDateRange };
};
