import { useTranslation } from "react-i18next";

function PaymentCancel() {
  const { t } = useTranslation();
  return (
    <div className="container mt-5 text-center">
      <h2>{t("payment.cancelled")}</h2>
      <p>{t("payment.cancelledInfo")}</p>
    </div>
  );
}

export default PaymentCancel;
