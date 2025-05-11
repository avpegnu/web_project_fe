import React, { useContext, useState, useEffect } from "react";
import "./productDisplay.css";
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { getStorageData } from "../../helpers/stored";
import ChatWidget from "../ChatWidget/chatWidget";
import { HelmetProvider } from "react-helmet-async";
const ProductDisplay = (props) => {
  const userId = getStorageData("user")?.id || null;
  console.log("userId", userId);

  const navigate = useNavigate();
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  console.log("product", product);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product?._id]);

  if (!product) {
    return <div className="product-display">Loading products...</div>;
  }

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    const user = getStorageData("user", null);

    if (!user) {
      // Nếu chưa đăng nhập → lưu lại hành động + chuyển hướng
      sessionStorage.setItem(
        "pendingAddToCart",
        JSON.stringify({ itemId: product._id, size: selectedSize })
      );
      navigate("/login");
      return;
    }

    // Nếu đã đăng nhập → thêm vào giỏ
    addToCart(product._id, selectedSize);
  };

  return (
    <>
      <HelmetProvider>
        <title>{product.name}</title>
      </HelmetProvider>
      <div className="product-display">
        <div className="product-display-left">
          <div className="product-display-img-list">
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
          </div>
          <div className="product-display-img">
            <img
              className="product-display-main-img"
              src={product.image}
              alt=""
            />
          </div>
        </div>
        <div className="product-display-right">
          <h1>{product.name}</h1>
          <div className="product-display-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
          </div>
          <div className="product-display-right-prices">
            <div className="product-display-right-price-old">
              ${product.old_price}
            </div>
            <div className="product-display-right-price-new">
              ${product.new_price}
            </div>
          </div>
          <div className="product-display-right-description">
            {product.description}
          </div>
          <div className="product-display-right-size">
            <h1>Select size</h1>
            <div className="product-display-right-sizes">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  className={selectedSize === size ? "active-size" : ""}
                  onClick={() => handleSizeClick(size)}
                  style={{
                    border:
                      selectedSize === size
                        ? "2px solid #555"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={!selectedSize}
            onClick={handleAddToCart}
            style={{
              backgroundColor: selectedSize ? "red" : "#ccc",
              cursor: selectedSize ? "pointer" : "not-allowed",
            }}
          >
            ADD TO CART
          </button>
          <p className="product-display-right-category">
            <span>Category: </span> Women, T-shirt, Crop-top
          </p>
          <p className="product-display-right-category">
            <span>Tags: </span> Modern, Latest
          </p>
        </div>
      </div>
      {userId && <ChatWidget userId={userId} />}
    </>
  );
};

export default ProductDisplay;
