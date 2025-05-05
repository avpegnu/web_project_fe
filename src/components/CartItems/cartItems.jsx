import React, { useContext } from "react";
import "./cartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/cart_cross_icon.png";
import { Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const CartItems = () => {
  const {
    allProduct,
    cartItems,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    selectedItems,
    getSelectedTotalAmount,
    toggleSelectItem,
  } = useContext(ShopContext);

  // const formatCurrency = (value) => {
  //   return value.toLocaleString("vi-VN") + "đ";
  // };

  // const parsePrice = (str) => parseInt(str.replace(/\./g, ""), 10);

  return (
    <>
      <HelmetProvider>
        <title>Cart</title>
      </HelmetProvider>
      <div className="cart-items">
        <div className="cart-items-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Size</p>
          <p>Quantity</p>
          <p>Total</p>
          <p style={{ textAlign: "center" }}>Activity</p>
        </div>
        <hr />
        {Object.entries(cartItems).map(([key, quantity]) => {
          if (quantity <= 0) return null;

          const [productId, size] = key.split("_");
          const product = allProduct.find((p) => p._id === productId);
          if (!product) return null;

          return (
            <div key={key}>
              <div className="cart-items-format cart-items-format-main">
                <img
                  className="cart-items-product-icon"
                  src={product.image}
                  alt=""
                />

                <p>{product.name}</p>
                <p>${Number(product.new_price).toFixed(1)}</p>
                <p>Size: {size}</p>
                <div className="cart-items-quantity-control">
                  <button
                    onClick={() => decreaseCartQuantity(product._id, size)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => increaseCartQuantity(product._id, size)}
                  >
                    +
                  </button>
                </div>

                <p>${(product.new_price * quantity).toFixed(1)}</p>

                <div className="cart-items-remove-icon">
                  <input
                    style={{ width: "20px", height: "20px" }}
                    type="checkbox"
                    checked={selectedItems.includes(key)}
                    onChange={() => toggleSelectItem(key)}
                  />

                  <img
                    src={remove_icon}
                    onClick={() => removeFromCart(product._id, size)}
                    alt="Remove"
                  />
                </div>
              </div>
              <hr />
            </div>
          );
        })}
        <div className="cart-items-down">
          <div className="cart-items-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cart-items-total-item">
                <p>Subtotal</p>
                <p>${getSelectedTotalAmount().toFixed(1)}</p>
              </div>
              <hr />
              <div className="cart-items-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cart-items-total-item">
                <h3>Total</h3>
                <h3>${getSelectedTotalAmount().toFixed(1)}</h3>
              </div>
            </div>
            {selectedItems.length > 0 && cartItems ? (
              <Link to="/checkout">
                <button>PROCEED TO CHECKOUT</button>
              </Link>
            ) : (
              <button disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Please choose the product to checkout
              </button>
            )}
          </div>
          <div className="cart-items-promo-code">
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-items-promo-box">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CartItems;
