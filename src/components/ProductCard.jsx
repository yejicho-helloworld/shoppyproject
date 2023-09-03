import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-2 cursor-pointer">
      <img src={product.image} alt={product.title} className="object-cover" />
      <h2 className="text-base font-semibold mt-2">{product.title}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-lg font-bold text-pink-500 mt-2 float-right">
        ₩{product.price}
      </p>
    </div>
  );
}
