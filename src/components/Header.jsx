import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { BsFillPencilFill } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext.";

export default function Header() {
    // 로그인할 때 함수
  const { googleSignIn } = UserAuth();
  // async함수로 만들어줌.
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  // 로그 아웃할 때 함수
  const { user, logOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <nav className="p-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center text-pink-600/70 font-bold text-4xl ml-5"
        >
          <FiShoppingBag className="ml-30" />
          Shoppy
        </Link>
        <div className="flex items-center text-xl mr-5">
          <Link to="/products" className="text-black font-bold mr-4">
            Products
          </Link>
          <Link to="/carts" className="text-black font-bold mr-4">
            Carts
          </Link>
          <Link to="/products/new" className="text-black font-bold">
            <BsFillPencilFill />
          </Link>
        {/* 조건부 렌더링 */}
          {user?.displayName ? (
            <button
              onClick={handleSignOut}
              className="text-black ml-4 font-bold"
            >
              Logout
            </button>
          ) : (
            <button
              className="text-black ml-4 font-bold"
              onClick={handleGoogleSignIn}
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <hr
        className="border-t border-gray-300 mx-auto"
        // style={{ width: "90%" }} // 너비를 원하는 값으로 설정
      />
    </div>
  );
}
