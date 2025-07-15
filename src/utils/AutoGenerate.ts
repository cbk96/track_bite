export const createId = (category: string, storeId: string) => {
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const createId = `${category}-${storeId}-${timestamp}-${randomSuffix}`;

  return createId;
};
