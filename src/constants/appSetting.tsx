export const isValidName = /^[가-힣a-zA-Z0-9 ]+$/;
export const isValidIdentifier = /^[가-힣a-zA-Z0-9\-_]+$/;
export const onlyStringRegex = /^[가-힣a-zA-Z]+$/;
export const stringRegex = /[가-힣a-zA-Z]/;
export const engRegex = /^[a-zA-Z]+$/;
export const numberRegex: RegExp = /^[0-9]+$/;
export const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/;
export const telRegex = /^(01[016789]\d{7,8}|0\d{1,2}\d{7,8})$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const businessNumberRegex = /^\d{10}$/;

export type CustSignUpRule = Record<
  string,
  {
    kor: string;
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern: RegExp;
    requiredMsg: string;
    minLengthMsg: string;
    maxLengthMsg: string;
    patternMsg: string;
  }
>;

export const custSignUpRules: CustSignUpRule = {
  customerId: {
    kor: "아이디",
    required: true,
    minLength: 5,
    maxLength: 15,
    pattern: idRegex,
    requiredMsg: "아이디를 입력해주세요",
    minLengthMsg:
      "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
    maxLengthMsg:
      "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
    patternMsg: "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
  },
  password: {
    kor: "비밀번호",
    required: true,
    minLength: 8,
    maxLength: 15,
    pattern: idRegex,
    requiredMsg: "비밀번호를 입력해주세요",
    minLengthMsg:
      "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
    maxLengthMsg:
      "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
    patternMsg: "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
  },
  name: {
    kor: "이름",
    required: true,
    minLength: 2,
    maxLength: 15,
    pattern: onlyStringRegex,
    requiredMsg: "이름을 입력해주세요",
    minLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    maxLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    patternMsg: "한글, 영문 외에는 입력할 수 없습니다.",
  },
  tel: {
    kor: "전화번호",
    required: true,
    minLength: 10,
    maxLength: 11,
    pattern: telRegex,
    requiredMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    minLengthMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    maxLengthMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    patternMsg: "(-)를 제외한 전화번호를 입력해주세요.",
  },
  email: {
    kor: "이메일",
    required: false,
    pattern: emailRegex,
    minLength: 5,
    maxLength: 30,
    requiredMsg: "",
    minLengthMsg: "올바른 이메일 유형이 아닙니다.",
    maxLengthMsg: "올바른 이메일 유형이 아닙니다.",
    patternMsg: "올바른 이메일 유형이 아닙니다.",
  },
  "address.detailedAddress": {
    kor: "상세 주소",
    required: true,
    minLength: 5,
    maxLength: 100,
    pattern: stringRegex,
    requiredMsg: "상세 주소를 입력해주세요.",
    minLengthMsg: "5자 이상 100자 이하로 입력해주세요.",
    maxLengthMsg: "5자 이상 100자 이하로 입력해주세요.",
    patternMsg: "올바른 주소를 입력해주세요.",
  },
};

export const adminSignUpRules: CustSignUpRule = {
  storeId: {
    kor: "아이디",
    required: true,
    minLength: 5,
    maxLength: 15,
    pattern: idRegex,
    requiredMsg: "아이디를 입력해주세요",
    minLengthMsg:
      "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
    maxLengthMsg:
      "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
    patternMsg: "영문자와 숫자를 포함한 5글자 ~ 15글자 조합으로 입력해주세요.",
  },
  storePublicId: {
    kor: "공개 아이디",
    required: true,
    minLength: 4,
    maxLength: 15,
    pattern: engRegex,
    requiredMsg: "공개 아이디를 입력해주세요",
    minLengthMsg: "영문자 5글자 ~ 15글자를 입력해주세요.",
    maxLengthMsg: "영문자 5글자 ~ 15글자를 입력해주세요.",
    patternMsg: "영문자 5글자 ~ 15글자를 입력해주세요.",
  },
  password: {
    kor: "비밀번호",
    required: true,
    minLength: 8,
    maxLength: 15,
    pattern: idRegex,
    requiredMsg: "비밀번호를 입력해주세요",
    minLengthMsg:
      "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
    maxLengthMsg:
      "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
    patternMsg: "영문자와 숫자를 포함한 8글자 ~ 15글자 조합으로 입력해주세요.",
  },
  storeName: {
    kor: "스토어명",
    required: true,
    minLength: 2,
    maxLength: 15,
    pattern: isValidIdentifier,
    requiredMsg: "스토어명을 입력해주세요",
    minLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    maxLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    patternMsg:
      "한글, 영문, 숫자, 일부 특수문자(-, _) 외에는 입력할 수 없습니다.",
  },
  name: {
    kor: "사업주명",
    required: true,
    minLength: 2,
    maxLength: 15,
    pattern: onlyStringRegex,
    requiredMsg: "이름을 입력해주세요",
    minLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    maxLengthMsg: "2자 이상 15자 이하로 입력해주세요.",
    patternMsg: "한글, 영문 외에는 입력할 수 없습니다.",
  },
  tel: {
    kor: "전화번호",
    required: true,
    minLength: 10,
    maxLength: 11,
    pattern: telRegex,
    requiredMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    minLengthMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    maxLengthMsg: "(-)를 제외한 전화번호를 입력해주세요.",
    patternMsg: "(-)를 제외한 전화번호를 입력해주세요.",
  },
  "address.detailedAddress": {
    kor: "상세 주소",
    required: true,
    minLength: 5,
    maxLength: 100,
    pattern: stringRegex,
    requiredMsg: "상세 주소를 입력해주세요.",
    minLengthMsg: "5자 이상 100자 이하로 입력해주세요.",
    maxLengthMsg: "5자 이상 100자 이하로 입력해주세요.",
    patternMsg: "올바른 주소를 입력해주세요.",
  },
  businessType: {
    kor: "업종",
    required: true,
    minLength: 2,
    maxLength: 40,
    pattern: stringRegex,
    requiredMsg: "업종을 입력해주세요",
    minLengthMsg: "2자 이상 40자 이하로 입력해주세요.",
    maxLengthMsg: "2자 이상 40자 이하로 입력해주세요.",
    patternMsg: "한글, 영문 외에는 입력할 수 없습니다.",
  },
  businessNumber: {
    kor: "사업자등록번호",
    required: true,
    minLength: 10,
    maxLength: 10,
    pattern: businessNumberRegex,
    requiredMsg: "(-)를 제외한 사업자등록번호를 입력해주세요.",
    minLengthMsg: "(-)를 제외한 사업자등록번호를 입력해주세요.",
    maxLengthMsg: "(-)를 제외한 사업자등록번호를 입력해주세요.",
    patternMsg: "(-)를 제외한 사업자등록번호를 입력해주세요.",
  },
};

export const addressKorNames = {
  "address.zonecode": "우편번호",
  "address.sigunguCode": "시/군/구 코드",
  "address.address": "주소",
  "address.detailedAddress": "상세 주소",
};

export const categoryName = {
  empty: "전체",
  fastfood: "패스트푸드",
  bunsik: "분식",
  korean: "한식",
  japanese: "일식",
  dessert: "디저트",
  western: "양식",
  chinese: "중식",
};

export type CategoryName = keyof typeof categoryName;

export const categoryNameKeys = Object.keys(categoryName) as CategoryName[];

export const weekName = {
  sunday: "일요일",
  monday: "월요일",
  tuesday: "화요일",
  wednesday: "수요일",
  thursday: "목요일",
  friday: "금요일",
  saturday: "토요일",
};

export const weekNameKeys = Object.keys(weekName) as (keyof typeof weekName)[];
