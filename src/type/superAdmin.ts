export type SecureAppSettings = {
  publicId: string;
  editToken: string;
  businessFee: number;
  createDate: Date;
  updateDate: Date;
};

export type AppSettings = Omit<
  SecureAppSettings,
  "editToken" | "createDate" | "updateDate"
>;
