import { useState, useEffect } from "react";
import { createReview, getReviewsByProductId } from "../../services/review"; // Đảm bảo có hàm API lấy đánh giá sản phẩm
import "./descriptionBox.css";

const DescriptionBox = ({ productId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]); // Lưu trữ các đánh giá
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description"); // Thêm state để kiểm soát tab đang hiển thị

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login.");

    const reviewData = {
      user_id: user._id,
      product_id: productId,
      rating,
      comment,
    };

    try {
      await createReview(reviewData);
      alert("Review has been submitted!");

      setShowReviewForm(false);
      setRating(5);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviewsByProductId(productId);
      setReviews(data);
    } catch (error) {
      console.error("Error while getting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="description-box">
      <div className="description-box-navigator">
        <div
          className={`description-box-nav-box ${
            activeTab === "description" ? "active" : ""
          }`}
          onClick={() => setActiveTab("description")} // Chuyển sang tab mô tả
        >
          Description
        </div>
        <div
          className={`description-box-nav-box ${
            activeTab === "reviews" ? "active" : ""
          }`}
          onClick={() => setActiveTab("reviews")} // Chuyển sang tab đánh giá
        >
          Reviews({reviews.length})
        </div>
      </div>

      {/* Hiển thị nội dung dựa trên tab đang active */}
      {activeTab === "description" && (
        <div className="description-box-description">
          <p>
            The high-end shirt is designed with a modern, sophisticated style,
            bringing confidence and elegance to the wearer. The cotton material
            is cool, absorbs sweat well, suitable for both work and play. The
            meticulous seams and standard Vietnamese form help you always stand
            out in all situations.
          </p>
          <p>
            The product is available in a variety of colors and sizes, easy to
            coordinate with jeans, khakis or vests. This is an ideal choice for
            those who are looking for a combination of comfort and fashion.
          </p>
          <p>
            Care instructions: Wash at room temperature, do not use bleach, iron
            at low temperature and avoid drying in direct sunlight.
          </p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="reviews">
          {/* Hiển thị form đánh giá nếu đang bật */}
          {showReviewForm && (
            <div className="review-form">
              <h3 className="review-form-title">Product reviews</h3>
              <div className="review-form-group">
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </div>
              <div className="review-form-group">
                <label>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button
                onClick={handleSubmitReview}
                className="review-submit-btn"
              >
                Submit a review
              </button>
            </div>
          )}

          {loading ? (
            <p>Loading review...</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-user-top">
                  {review.user_id
                    ? `${review.user_id.name} (ID: ${review.user_id._id.slice(
                        0,
                        6
                      )}...${review.user_id._id.slice(-4)})`
                    : "Anonymous"}
                </div>
                <div className="review-header">
                  <span className="review-rating">⭐ {review.rating} / 5</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DescriptionBox;
