export const getRandomNum = (unit: number = 10) => {
  const random = Math.floor(Math.random() * unit) + 1;

  return random;
};
