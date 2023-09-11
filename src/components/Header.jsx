import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { BsFillPencilFill } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext.";
import { getDatabase, get, ref } from "firebase/database";
import CartIcon from "./CartIcon";

export default function Header() {
  const { googleSignIn } = UserAuth();
  const { user, logOut } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);
    // useEffect훅이 로그인한 사용자의 uid가 admins 데이터베이스에 있는지
  // 확인하고, 그 결과를 isAdmin 상태 변수에 저장함.
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      console.log(user);

      const database = getDatabase();
      const adminRef = ref(database, "admins");
      console.log(adminRef);
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        console.log(adminData);
        const isAdminUser = Object.values(adminData).includes(user.uid);
        setIsAdmin(isAdminUser);
      }
    };
    checkAdmin();
  }, [user]);

  console.log(isAdmin);
  return (
    <div>
      <nav className="p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-pink-600/70 text-4xl">
          <FiShoppingBag />
          Shoppy
        </Link>
        <div className="flex items-center text-xl">
          <Link to="/products" className="text-black font-bold mr-5">
            Products
          </Link>
          {user && (
            <Link to="/carts" className="mr-5">
              <CartIcon />
            </Link>
          )}
          {isAdmin && user && (
            <Link to="/products/new" className="text-black font-bold">
              <BsFillPencilFill />
            </Link>
          )}
          {user?.displayName ? (
            <div className="flex items-center ml-5">
              <img
                src={user.photoURL}
                alt={`${user.displayName}'s Avatar`}
                className="rounded-full h-10 w-10 object-cover"
              />
              <span className="ml-2 font-bold">{user.displayName}</span>
              <button
                onClick={handleSignOut}
                className="bg-pink-400 text-white py-2 px-4 rounded-sm hover:brightness-110 ml-5"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="bg-pink-400 text-white py-2 px-4 rounded-sm hover:brightness-110 ml-3"
              onClick={handleGoogleSignIn}
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <hr className="border-t border-gray-300 mx-auto" />
    </div>
  );
}
