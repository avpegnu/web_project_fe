import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./successOrder.css";
import { useLocation } from "react-router-dom";
import { updatePaymentStatus } from "../../services/order";

const SuccessOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const txnRef = queryParams.get("vnp_TxnRef"); // chính là orderId bạn gửi đi lúc thanh toán
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");

    if (txnRef && vnpResponseCode === "00") {
      updatePaymentStatus(txnRef, "paid")
        .then(() => {
          console.log(" Cập nhật trạng thái đơn hàng thành công.");
        })
        .catch((err) => {
          console.error(" Lỗi cập nhật trạng thái đơn hàng:", err);
        });
    }
  }, [location.search]);

  return (
    <div className="success-container">
      <CheckCircle className="success-icon" />
      <h1 className="success-title">Order Successful!</h1>
      <p className="success-message">
        Thank you for your purchase. Your order is being processed.
      </p>
      <p className="success-subtext">
        You will be redirected to the homepage shortly...
      </p>
    </div>
  );
};

export default SuccessOrder;
