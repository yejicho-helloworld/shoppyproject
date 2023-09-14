import { get, ref, set } from "firebase/database";
import { database } from "../firebase";
import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrash, FaTrashAlt } from "react-icons/fa";

// 이제 상품의 정보를 firebase로부터 받아와 장바구니에 보여주어야햠.

export default function MyCart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태 추가

  // Firebase로부터 장바구니 데이터를 가져오기
  useEffect(() => {
    const cartRef = ref(database, "carts");
    get(cartRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCart(Object.values(snapshot.val()));
        } else {
          setCart([]);
        }
      })
      .catch((error) => {
        console.error("장바구니 데이터를 가져오는 중에 오류 발생", error);
      });
  }, []);

  // Firebase 업데이트 함수
  const updateFirebaseCart = (updatedCart) => {
    const cartRef = ref(database, "carts");
    set(cartRef, updatedCart);
  };

  // 수량 증가 함수
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
    updateFirebaseCart(updatedCart);
  };

  // 수량 감소 함수
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    updateFirebaseCart(updatedCart);
  };

  // 제품 삭제 함수
  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    updateFirebaseCart(updatedCart);
  };

  // 총 가격 계산 함수
  // useEffect(() => {
  //   let total = 0;
  //   cart.forEach((item) => {
  //     const itemPrice = parseFloat(item.price);
  //     total += itemPrice * item.quantity;
  //   });
  //   setTotalPrice(total + 3000); //상품 총액 + 배송비 3000원
  // }, [cart]);

  // 상품 총액 계산
  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cart]);

  return (
    <div>
      <h2 className="text-center mt-[2rem] font-bold text-2xl">내 장바구니</h2>
      {cart.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-4 border-b border-gray-300"
            >
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-[17rem] ml-[3rem] mr-[4rem] mt-[0.5rem] mb-[0.5rem]"
                />
              </div>
              <div className="w-1/4">
                <h3 className="text-lg font-semibold ">{item.title}</h3>
                <p className="text-pink-500 font-bold">{item.selectedOption}</p>
                <p>₩{item.price}</p>
              </div>
              <div className="w-1/2 flex justify-end">
                <button
                  className="border border-2 border-solid border-gray-500 px-1 py-1 mr-2"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  <FaMinus />
                </button>
                <p>{item.quantity}</p>
                <button
                  className="border border-2 border-solid border-gray-500 px-1 py-1 ml-2"
                  onClick={() => increaseQuantity(item.id)}
                >
                  <FaPlus />
                </button>
                <button
                  className="px-2 py-1 ml-2"
                  onClick={() => removeProduct(item.id)}
                >
                  <span className="text-xl">
                    <FaTrashAlt />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 총 가격 표시 */}
      {cart.length > 0 && (
        <div className="flex justify-center items-center m-[2rem]">
          <div className="2xl:mx-[8rem] xl:mx-[5rem] md:mx-[2rem] sm:mx-[0.5rem] justify-start bg-gray-100 px-20 py-10">
            <p className="text-xl font-semibold ml-2.5">상품 총액</p>
            <p className="text-xl text-pink-500 font-bold">₩{totalPrice}</p>
          </div>
          <FaPlus size="1rem" />
          <div className="2xl:mx-[8rem] xl:mx-[5rem] md:mx-[2rem] sm:mx-[0.5rem] justify-center bg-gray-100 px-20 py-10">
            <p className="text-xl font-semibold ml-3">배송비</p>
            <p className="text-xl text-pink-500 font-bold">₩3000</p>
          </div>
          <p className="text-3xl font-bold">=</p>
          <div className="2xl:mx-[8rem] xl:mx-[5rem] md:mx-[2rem] sm:mx-[0.5rem] justify-end bg-gray-100 px-20 py-10">
            <p className="text-xl font-semibold ml-4">총 가격</p>
            <p className="text-xl text-pink-500 font-bold">
              ₩{totalPrice + 3000}
            </p>
          </div>
        </div>
      )}
      <button
        type="submit"
        className="font-bold bg-pink-400 hover:brightness-110 text-white rounded h-[3rem] w-4/5 px-5 mt-1 mb-5 ml-[9rem]"
      >
        주문하기
      </button>
    </div>
  );
}
