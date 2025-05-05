import React, { useEffect, useState } from "react";
import "./popular.css";
import Item from "../Item/item";
import { getAllProducts } from "../../services/product";

const Popular = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 4;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [products, totalSlides]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="popular">
      <h1>POPULAR IN JYSTORE</h1>
      <hr />
      <div className="popular-controls">
        <button onClick={goPrev} className="popular-arrow">
          ‹
        </button>
        <div className="popular-viewport">
          <div
            className="popular-slider"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const start = slideIndex * itemsPerSlide;
              const end = start + itemsPerSlide;
              const group = products.slice(start, end);
              return (
                <div className="popular-slide" key={slideIndex}>
                  {group.map((item) => (
                    <Item
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      new_price={item.new_price}
                      old_price={item.old_price}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={goNext} className="popular-arrow">
          ›
        </button>
      </div>
    </div>
  );
};

export default Popular;
