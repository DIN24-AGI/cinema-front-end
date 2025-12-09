import { useTranslation } from "react-i18next";

function PaymentSuccess() {
  const { t } = useTranslation()
  return (
    <div className="container mt-5 text-center">
      <h2>{t("payment.success")}</h2>
      <p>{t("payment.successInfo")}</p>
    </div>
  );
}

export default PaymentSuccess;
