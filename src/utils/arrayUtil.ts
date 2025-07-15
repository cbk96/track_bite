//특정 두 index의 item의 순서를 바꾼 배열 반환
export const swapItemsInArray = <T>(
  array: T[],
  index1: number,
  index2: number
) => {
  if (index1 > index2) {
    //뒤에서 앞으로 가져오는 경우
    console.log("뒤에서 앞으로 가져오는 경우");
    const swapArray = array.map((item, index) =>
      index < index1 && index > index2
        ? array[index - 1]
        : index === index2
        ? array[index1]
        : index === index1
        ? array[index - 1]
        : array[index]
    );
    return swapArray;
  } else if (index1 < index2) {
    //앞에서 뒤로 가져오는 경우
    console.log("앞에서 뒤로 가져오는 경우");
    const swapArray = array.map((item, index) =>
      index < index2 && index > index1
        ? array[index + 1]
        : index === index2
        ? array[index1]
        : index === index1
        ? array[index + 1]
        : array[index]
    );
    return swapArray;
  } else {
    return array;
  }
};

//특정 index의 item을 제거한 배열 반환
export const removeItmeAtIndexInArray = <T>(array: T[], removeIndex: number) =>
  array.filter((notUsed, index) => index !== removeIndex);

//item을 특정 index에 삽입한 배열 반환
export const insertItemAtIndexInArray = <T>(
  array: T[],
  insertIndex: number,
  item: T
) => {
  const before = array.filter((item, index) => index < insertIndex);
  const after = array.filter((item, index) => index >= insertIndex);
  return [...before, item, ...after];
};
