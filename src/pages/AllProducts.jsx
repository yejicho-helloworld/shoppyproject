import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../firebase";
import ProductCard from "../components/ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const productsRef = database.ref("products");
        const productsRef = ref(database, "products"); // "products" 경로의 참조를 가져옵니다.
        // 이미 초기화된 Firebase 데이터베이스를 사용합니다.
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

  return (
    <div className="flex">
      {/* 각 카드를 수평으로 배열하기 위해 flex 클래스 추가 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {/* 각 카드를 수평으로 배열하려면 grid-cols-3을 사용 */}
        {Object.keys(products).map((productId) => {
          const product = products[productId];
          return <ProductCard key={productId} product={product} />;
        })}
      </div>
    </div>
  );
}
