export interface userInfo {
  cid: string;
  name: string;
  password: string;
  tel: string;
  address: string;
  prefer: string;
  joinDate: Date;
  dormancy: boolean;
}

export type userLogin = {
  logined: boolean;
  userInfo?: userInfo;
};
