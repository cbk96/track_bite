export const dateFormat = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const formatDate = `${yyyy}-${MM}-${dd}`;
  return formatDate;
};
