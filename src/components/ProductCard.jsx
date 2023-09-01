import React from "react";

export default function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.title} />{" "}
      {/* 이미지를 화면에 표시 */}
      <h2>{product.title}</h2>
      <p>{product.category}</p>
      <p>가격: {product.price}원</p>
    </div>
  );
}
