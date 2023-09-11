import { get, push, ref, set } from "firebase/database";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../firebase";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const [selected, setSelected] = useState(
  //   product && product.options && product.options[0]
  // );
  const [selected, setSelected] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = ref(database, `products/${id}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          setProduct(snapshot.val());

          // 제품 정보를 가져온 후에 기본 옵션을 설정
          if (snapshot.val().options && snapshot.val().options.length > 0) {
            setSelected(snapshot.val().options[0]);
          }
        } else {
          console.log("제품을 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("제품 정보를 불러오는 동안 오류 발생", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSelect = (e) => setSelected(e.target.value);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        const productRef = ref(database, `products/${id}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          setProduct(snapshot.val());
        } else {
          console.log("제품을 찾을 수 없습니다");
        }

        // 사용자가 옵션을 선택하지 않은 경우, selected를 첫 번째 옵션으로 설정
        // if (!selected && product.options && product.options.length > 0) {
        //   setSelected(product.options[0]);
        // }

        const cartRef = ref(database, "carts");
        const cartSnapshot = await get(cartRef);

        const selectedOption = selected; //선택한 옵션을 저장

        // 객체를 통해 추가할 정보들을 저장해서 만든다.
        const productToAdd = {
          ...product,
          quantity: 1,
          selectedOption: selectedOption, //선택한 옵션을 추가
        };

        if (cartSnapshot.exists()) {
          const cartData = cartSnapshot.val();
          let found = false;

          for (const key in cartData) {
            if (
              cartData[key].id === productToAdd.id &&
              // 같은 제품 및 옵션 확인
              cartData[key].selectedOption === selectedOption
            ) {
              found = true;
              cartData[key].quantity += 1;
              await set(ref(database, `carts/${key}`), cartData[key]);
              break;
            }
          }

          if (!found) {
            const newCartRef = push(cartRef);
            await set(newCartRef, productToAdd);
          }
        } else {
          const newCartRef = push(cartRef);
          await set(newCartRef, productToAdd);
        }
        setSuccessMessage("✅장바구니에 추가되었습니다");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000); // 3초 후에 숨김
      }
    } catch (error) {
      console.log("에러가 발생하였습니다", error);
    }
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
        <div className="grid grid-cols-2">
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
            {successMessage && <p>{successMessage}</p>}
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
