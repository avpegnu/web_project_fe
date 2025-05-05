import React, { useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../components/Breadcrums/breadcrum";
import ProductDisplay from "../components/ProductDisplay/productDisplay";
import DescriptionBox from "../components/DescriptionBox/descriptionBox";
import RelatedProducts from "../components/RelatedProducts/relatedProducts";
import { getProductById } from "../services/product";
const Product = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProductById(id);

        setProductDetails(data); // Lưu thông tin sản phẩm vào state
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [id]);
  return (
    <>
      {/* <Helmet>
        <title>Thông tin sản phẩm</title>
      </Helmet> */}
      <div>
        <Breadcrum product={productDetails} />
        <ProductDisplay product={productDetails} />
        {productDetails && <DescriptionBox productId={productDetails._id} />}
        {productDetails && (
          <RelatedProducts
            category={productDetails.category}
            currentProductId={productDetails._id}
          />
        )}
      </div>
    </>
  );
};

export default Product;
