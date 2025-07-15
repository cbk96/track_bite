export const getKorPaymentLabel = (paymentMethod: string) => {
  const paymentMethodKor =
    paymentMethod === "credit card"
      ? "카드결제"
      : paymentMethod === "pay in person with card"
      ? "만나서 결제 (카드)"
      : paymentMethod === "pay in person with cash"
      ? "만나서 결제 (현금)"
      : "";
  return paymentMethodKor;
};

export const getKorPurStatusLabel = (purStatus: string) => {
  const purStatusKor =
    purStatus === "Order_Placed"
      ? "주문완료"
      : purStatus === "Preparing_for_Delivery"
      ? "배달준비중"
      : purStatus === "Out_for_Delivery"
      ? "배달중"
      : purStatus === "Delivered"
      ? "배달완료"
      : "";

  return purStatusKor;
};
