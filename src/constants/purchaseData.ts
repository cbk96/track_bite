export const paymentMethod = {
  Credit_card: "카드결제",
  Pay_in_person_with_card: "만나서 결제 (카드)",
  Pay_in_person_with_cash: "만나서 결제 (현금)",
};

export const purchaseStatus = {
  Order_Placed: "주문완료",
  Preparing_for_Delivery: "배달준비중",
  Out_for_Delivery: "배달중",
  Delivered: "배달완료",
};

export const saleStatus = {
  soldout: "품절",
  onsale: "판매중",
};

export type PaymentMethod = keyof typeof paymentMethod;
export type PurchaseStatus = keyof typeof purchaseStatus;
export type SaleStatus = keyof typeof saleStatus;

export const paymentMethodKeys = Object.keys(paymentMethod) as PaymentMethod[];

export const purchaseStatusKeys = Object.keys(
  purchaseStatus
) as PurchaseStatus[];

export const saleStatusKeys = Object.keys(saleStatus) as SaleStatus[];
