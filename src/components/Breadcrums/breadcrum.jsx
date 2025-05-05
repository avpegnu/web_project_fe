import React from "react";
import "./breadcrum.css";
import arrow_icon from "../assets/breadcrum_arrow.png";

const Breadcrum = (props) => {
  const { product } = props;
  if (!product) {
    return <div className="breadcrum">Loading product information...</div>;
  }
  return (
    <div className="breadcrum">
      JYStore <img src={arrow_icon} alt=">" /> SHOP{" "}
      <img src={arrow_icon} alt=">" /> {product.category}{" "}
      <img src={arrow_icon} alt=">" /> {product.name}{" "}
    </div>
  );
};

export default Breadcrum;
