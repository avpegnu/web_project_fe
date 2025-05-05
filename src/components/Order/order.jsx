import { useEffect, useState } from "react";
import {
  getOrdersByUserId,
  updatePaymentStatus,
  updateOrderStatus,
} from "../../services/order";
import moment from "moment";
import { Link } from "react-router-dom";
import RatingModal from "../RatingModal/ratingModal";
import { createReview } from "../../services/review";
import "./order.css";
import { HelmetProvider } from "react-helmet-async";

const statusLabels = {
  pending: "🔄 Pending",
  shipping: "🚚 Shipping",
  completed: "✅ Completed",
  cancelled: "❌ Cancelled",
  reviewed: "⭐ Reviewed",
};

const translatePaymentMethod = (method) => {
  switch (method) {
    case "cash_on_delivery":
      return "Cash on Delivery";
    case "VNPay_bank_transfer":
      return "VNPAY";
    default:
      return "Other";
  }
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentReviewProduct, setCurrentReviewProduct] = useState(null);

  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersByUserId(user_id);
      setOrders(data);
    } catch (err) {
      console.error("Error when getting order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      setUpdatingId(orderId);
      await updatePaymentStatus(orderId, "completed");
      await fetchOrders();
    } catch (err) {
      alert("Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmCancelled = async () => {
    if (!selectedOrderId) return;
    try {
      setUpdatingId(selectedOrderId);
      await updateOrderStatus(selectedOrderId, "cancelled");
      setShowCancelModal(false);
      await fetchOrders();
    } catch (err) {
      alert("Unable to update order status.");
    } finally {
      setUpdatingId(null);
      setSelectedOrderId(null);
    }
  };

  const handleOpenReview = (product) => {
    setCurrentReviewProduct(product);
    setShowRatingModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await createReview({ ...reviewData, user_id });
      await updateOrderStatus(currentReviewProduct._id, "reviewed");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === currentReviewProduct._id
            ? { ...order, order_status: "reviewed" }
            : order
        )
      );

      setReviewSuccess(true);
      setShowRatingModal(false);
      setTimeout(() => setReviewSuccess(false), 3000); // Tự động ẩn thông báo sau 3s
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  useEffect(() => {
    if (user_id) fetchOrders();
  }, [user_id]);

  if (!user_id)
    return <p className="no-orders-message">Please login to view orders.</p>;
  if (loading) return <p className="loading-message">Loading orders...</p>;

  const filteredOrders = orders.filter(
    (order) => order.order_status === selectedStatus
  );

  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  return (
    <>
      <HelmetProvider>
        <title>My Orders</title>
      </HelmetProvider>
      {reviewSuccess && (
        <div className="review-success-message">
          Review successful! Thanks for sharing your opinion.
        </div>
      )}

      <div className="orders-container">
        <div className="status-filter">
          <h2 className="status-filter-title">Status</h2>
          <div className="status-buttons">
            {Object.entries(statusLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`status-button ${
                  selectedStatus === key ? "selected" : "unselected"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="orders-list">
          <h2 className="orders-title">{statusLabels[selectedStatus]}</h2>

          {filteredOrders.length === 0 ? (
            <p className="no-orders">No orders yet.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <p>
                      <span style={{ fontWeight: "600" }}>Order ID:</span> #
                      {order._id}
                    </p>
                    <p>
                      <span style={{ fontWeight: "600" }}>Status:</span>{" "}
                      <span
                        className={`status-label ${getStatusColorClass(
                          order.order_status
                        )}`}
                      >
                        {statusLabels[order.order_status]}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontWeight: "600" }}>Payment:</span>{" "}
                      {translatePaymentMethod(order.payment_method)} (
                      {order.payment_status === "pending"
                        ? "Not yet paid"
                        : "Paid"}
                      )
                    </p>
                  </div>
                  <div className="order-date">
                    <p>
                      <span style={{ fontWeight: "600" }}>Date:</span>{" "}
                      {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <p>
                      <span style={{ fontWeight: "600" }}>Total:</span>{" "}
                      <span style={{ fontWeight: "700", color: "#FF5733" }}>
                        ${Number(order.order_total).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="shipping-address">
                  <h4>Delivery address:</h4>
                  <p>{order.shipping_address?.address}</p>
                  <p>
                    {order.shipping_address?.ward} -{" "}
                    {order.shipping_address?.district} -{" "}
                    {order.shipping_address?.city}
                  </p>
                </div>

                <div className="order-products">
                  <h4>Products:</h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {order.order_items.map((item, index) => (
                      <div key={index} className="product-item">
                        <Link to={`/product/${item._id}`}>
                          <img src={item.image} alt={item.name} />
                        </Link>
                        <div className="product-details">
                          <p style={{ fontWeight: "600" }}>{item.name}</p>
                          <p>
                            Size:{" "}
                            <span style={{ fontWeight: "600" }}>
                              {item.size}
                            </span>
                          </p>
                          <p>
                            Quantity:{" "}
                            <span style={{ fontWeight: "600" }}>
                              {item.quantity}
                            </span>
                          </p>
                          <p>
                            Price:{" "}
                            <span style={{ fontWeight: "600" }}>
                              ${item.new_price}
                            </span>
                          </p>
                          {order.order_status === "completed" &&
                            !reviewedProducts.has(item._id) && (
                              <button onClick={() => handleOpenReview(item)}>
                                Review
                              </button>
                            )}
                          {reviewedProducts.has(item._id) && (
                            <button className="button-repurchase">
                              Buy again
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-actions">
                  {order.order_status === "completed" ? (
                    <></>
                  ) : (
                    <div className="buttons-container">
                      <button
                        onClick={() => handleConfirmReceived(order._id)}
                        disabled={order.order_status !== "shipping"}
                        className={`received-button ${
                          order.order_status !== "shipping" ? "disabled" : ""
                        }`}
                      >
                        Received
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setShowCancelModal(true);
                        }}
                        disabled={order.order_status !== "pending"}
                        className={`cancel-button ${
                          order.order_status !== "pending" ? "disabled" : ""
                        }`}
                      >
                        Cancel order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="cancel-modal">
          <div className="modal-content">
            <h2 className="modal-header">Xác nhận huỷ đơn hàng</h2>
            <p className="modal-body">
              Bạn chắc chắn muốn huỷ đơn hàng này chứ?
            </p>
            <div className="button-container">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrderId(null);
                }}
                className="cancel-button"
              >
                Không
              </button>
              <button
                onClick={handleConfirmCancelled}
                className="confirm-button"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && (
        <RatingModal
          product={currentReviewProduct}
          onSubmit={handleSubmitReview}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </>
  );
};

export default Order;
