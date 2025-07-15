export const readItemFromStorageP = (key: string) =>
  new Promise<string | null>(async (resolve, reject) => {
    try {
      const value = localStorage.getItem(key);
      resolve(value);
    } catch (e) {
      reject(e);
    }
  });

export const writeItemToStorageP = (key: string, value: string) =>
  new Promise<string | null>(async (resolve, reject) => {
    try {
      localStorage.setItem(key, value); //로컬 스토리지에 key는 중복되지 않으며 중복되는 key로 값을 저장할 경우 이전 key의 값에 덮어씌어진다.
      resolve(value);
    } catch (e) {
      reject(e);
    }
  });

export const readStringP = readItemFromStorageP;
export const writeStringP = writeItemToStorageP;
