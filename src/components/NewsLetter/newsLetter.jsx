import React, { useState } from "react";
import "./newsLetter.css";
import { subscribeEmail } from "../../services/email";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const response = await subscribeEmail(email);
      alert(response.message);
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error);
    } finally {
      setLoading(false);
      setEmail("");
    }
  };
  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay upload</p>
      <div>
        <input
          type="email"
          placeholder="Your Email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? "Sending..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
