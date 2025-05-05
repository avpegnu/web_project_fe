import { useState } from "react";
import "./ratingModal.css"; // Import CSS styles for the component

const RatingModal = ({ product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating || !comment.trim()) {
      alert("Please rate and write a review.");
      return;
    }
    onSubmit({
      product_id: product._id,
      rating,
      comment,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Product reviews</h2>
        <p className="modal-product-name">{product.name}</p>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`star ${star <= rating ? "selected" : ""}`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          rows="4"
          placeholder="Write your review..."
          className="textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
