export type Address = {
  zonecode: string; // 우편번호
  sigunguCode: string;
  address: string;
  detailedAddress: string;
};

export const initialAddress: Address = {
  zonecode: "",
  sigunguCode: "",
  address: "",
  detailedAddress: "",
};
