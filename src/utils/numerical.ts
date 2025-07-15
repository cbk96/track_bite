export const accounting = (score: number) => {
  return new Intl.NumberFormat().format(score);
};

export const showDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

export const filterNumber = (value: string | number) => {
  const filteredValue = String(value).replace(/[^0-9]/g, "");
  return filteredValue;
};
