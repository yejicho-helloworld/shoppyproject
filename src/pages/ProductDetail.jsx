import { get, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../firebase";

export default function ProductDetail() {
  // useParams를 사용하여 동적 파라미터로부터 id를 추출함.
  // 동적 파라미터는 URL에서 '/products/:id" 형식으로 정의된 부분을 말하며,
  // 이를 통해 제품의 고유 ID를 추출할 수 있음.
  const { id } = useParams();
  // product 상태를 초기화함.
  const [product, setProduct] = useState(null);

  // useEffect를 사용하여 fetchProduct 함수 컴포넌트가 처음 마운트될 때 호출되도록 함.
  // fetchProduct 함수는 데이터베이스에서 제품 정보를 가져오는 비동기 함수
  // productRef를 사용하여 해당 'id'에 해당하는 제품 정보를 참조함.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // firebase 데이터베이스에서 제품 정보를 가져옴.
        const productRef = ref(database, `products/${id}`);
        const snapshot = await get(productRef);

        // snapshot.exists()를 사용하여 제품 정보가 존재하는지 확인하고, 존재하면
        // setProduct 함수를 사용하여 product 상태에 저장함.
        if (snapshot.exists()) {
          setProduct(snapshot.val());
        } else {
          console.log("제품을 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("제품 정보를 불러오는 동안 오류 발생", error);
      }
    };
    fetchProduct();
  }, [id]);

  const [selected, setSelected] = useState(
    product && product.options && product.options[0]
  );
  const handleSelect = (e) => setSelected(e.target.value);

  const handleAddToCart = () => {
    // 장바구니에 제품을 추가하는 로직을 구현
    // 이 부분은 상태 관리나 데이터베이스 연동이 필요
    // 예를 들어 firebase firestore를 사용하여 장바구니에 추가할 수 있음.
    // 필요햔 상태나 함수를 추가하여 구현
  };

  return (
    <div
      className="mt-10 ml-10 mr-10 
    xl:max-w-[75%]
    xl:ml-[10rem]
    2xl:max-w-[65%] 
    2xl:ml-[15rem] 2xl:mr-[10rem]
    justify-center items-center"
    >
      {product ? (
        <div className="flex flex-col md:flex-row">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="object-fill"
            />
          </div>
          <div className="pl-10 2xl:ml-[1rem]">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 font-extrabold mb-4">
              ₩{product.price}
            </p>
            <div className="border-b border-gray-300" />
            <p className="text-gray-700 mt-5 mb-4">{product.description}</p>
            <div className="mb-4 flex">
              <label
                htmlFor="options"
                className="block text-md w-[4rem] p-3 font-medium text-pink-500"
              >
                옵션:
              </label>
              <select
                id="options"
                className="border-dashed rounded-md p-2 mt-1 focus:outline-none"
                style={{ width: "100%" }}
                onChange={handleSelect}
                value={selected}
              >
                {product.options
                  ? product.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-pink-400 text-white mt-5 py-2 px-4 hover:brightness-110 transition-colors duration-300 ease-in-out"
              style={{ width: "100%" }}
            >
              장바구니에 추가
            </button>
          </div>
        </div>
      ) : (
        <p>제품을 불러오는 중입니다...</p>
      )}
    </div>
  );
}
