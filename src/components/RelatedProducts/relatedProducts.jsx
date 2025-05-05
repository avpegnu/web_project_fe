import React, { useEffect, useState } from "react";
import "./relatedProducts.css";
import Item from "../Item/item";
import { getAllProducts } from "../../services/product";

const RelatedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      // Lọc sản phẩm có cùng category và khác id hiện tại
      const filtered = data.filter(
        (item) => item.category === category && item._id !== currentProductId
      );
      setProducts(filtered);
    };
    if (category) fetchData(); // đảm bảo category đã có
  }, [category, currentProductId]);

  return (
    <div className="related-products">
      <h1>Related Products</h1>
      <hr />
      <div className="related-products-item">
        {products.slice(0, 4).map((item, i) => (
          <Item
            key={i}
            id={item._id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
