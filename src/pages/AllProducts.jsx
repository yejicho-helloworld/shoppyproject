import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../firebase";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

export default function AllProducts() {
  const [products, setProducts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const productsRef = database.ref("products");
        const productsRef = ref(database, "products");
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          setProducts(snapshot.val());
        } else {
          console.log("데이터가 없습니다.");
        }
      } catch (error) {
        console.error("데이터를 가져오는 동안 오류 발생", error);
      }
    };
    fetchData();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="flex">
      {/* 각 카드를 수평으로 배열하기 위해 flex 클래스 추가 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4">
        {/* 각 카드를 수평으로 배열하려면 grid-cols-3을 사용 */}
        {Object.keys(products).map((productId) => {
          const product = products[productId];
          return (
            <div
              key={productId}
              onClick={() => handleProductClick(productId)} // 클릭 이벤트를 처리하는 함수 호출
            >
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
