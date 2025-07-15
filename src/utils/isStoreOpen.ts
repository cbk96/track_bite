import type { Address, OperatingHours, StorePublicInfo } from "../type";

export const isStoreOpen = () => {
  const isStoreOpenByTime = (optime: OperatingHours[]): boolean => {
    if (optime && optime.length > 0) {
      if (
        !optime.some(
          (time) => time.open.trim() !== "" && time.close.trim() !== ""
        )
      )
        return false;
      const today = new Date();
      const todayWeek = today.getDay();
      const nowHours = String(today.getHours()).padStart(2, "0");
      const nowMinutes = String(today.getMinutes()).padStart(2, "0");
      const now = `${nowHours}:${nowMinutes}`;
      const openTime = optime[todayWeek].open;
      const closeTime = optime[todayWeek].close;

      return now >= openTime && now <= closeTime;
    } else {
      return false;
    }
  };
  const isStoreOpenByLocation = (
    storeSigunguCode: string,
    customerSigunguCode: string
  ): boolean => {
    if (!storeSigunguCode || !customerSigunguCode) return false;
    const storeSi = storeSigunguCode.slice(0, 2);
    const customerSi = customerSigunguCode.slice(0, 2);
    const chkLocation = customerSi === storeSi;
    return chkLocation;
  };

  return { isStoreOpenByTime, isStoreOpenByLocation };
};
