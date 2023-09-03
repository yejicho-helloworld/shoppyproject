import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    // 상품 카드를 클릭 시 ProductDetail 페이지로 이동
    navigate(`/products/${product.id}`);
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 m-2 cursor-pointer
hover:bg-gray-100 hover:shadow-lg transform transition-transform hover:-translate-y-2"
      onClick={handleProductClick}
    >
      <img src={product.image} alt={product.title} className="object-cover" />
      <div className="flex justify-between">
        <h2 className="text-base font-semibold mt-2 truncate">
          {product.title}
        </h2>
        <p className="text-lg font-bold mt-2 text-pink-500">₩{product.price}</p>
      </div>
      <p className="text-sm text-gray-500">{product.category}</p>
    </div>
  );
}
