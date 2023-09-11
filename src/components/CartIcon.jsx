import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartRef = ref(database, "carts");

    onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        let totalCount = 0;
        for (const key in cartData) {
          totalCount += cartData[key].quantity || 0;
        }
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
    });
  }, []);

  return (
    <div className="relative">
      <AiOutlineShoppingCart size="2rem" />
      {/* cartCount가 0보다 크면, 뱃지가 표시되고 제품 수량이 표시됨. */}
      {cartCount > 0 && (
        <span className="bg-pink-400 text-white font-bold rounded-full px-2 py-1 text-xs absolute -top-1 -right-1 transform translate-x-1/3 -translate-y-1/3">
          {cartCount}
        </span>
      )}
    </div>
  );
}
