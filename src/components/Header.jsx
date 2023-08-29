import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { BsFillPencilFill } from "react-icons/bs";
import { UserAuth } from "../context/AuthContext.";
import { database } from "../firebase";
import { getDatabase, get, ref, child } from "firebase/database";
import { ref as sRef } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

      // firebase realtime database 인스턴스 생성
      const database = getDatabase();
      // admin 경로를 참조하는 데이터베이스 참조를 생성함. 
      const adminRef = ref(database, "admins");
      console.log(adminRef);
      // 데이터베이스 참조로부터 데이터를 읽어오는 get 함수를 호출하고,
      // 그 결과인 snapshot을 기다림.
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        // sanpshot에서 데이터를 추출하여 adminData 변수에 저장
        const adminData = snapshot.val();
        console.log(adminData);
        // adminData객체의 값을 배열로 변환한 후, 현재 사용자의 uid가 그 배열에
        // 포함되어있는지를 확인하여 어드민 여부를 결정함. 
        const isAdminUser = Object.values(adminData).includes(user.uid);
        // 어드민 여부를 isAdmin 상태 변수에 설정
        setIsAdmin(isAdminUser);
      }
    };
    checkAdmin();
  }, [user]);

  // 콘솔에 출력해봄. admin 권한을 가진 계정으로 로그인한 경우 true가 출력됨.
  console.log(isAdmin);
  return (
    <div>
      <nav className="p-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center text-pink-600/70 text-4xl"
        >
          <FiShoppingBag />
          Shoppy
        </Link>
        <div className="flex items-center text-xl">
          <Link to="/products" className="text-black font-bold mr-4">
            Products
          </Link>
          {user && (
            <Link to="/carts" className="text-black font-bold mr-4">
              Carts
            </Link>
          )}
          {isAdmin && user && (
            <Link to="/products/new" className="text-black font-bold">
              <BsFillPencilFill />
            </Link>
          )}
          {user?.displayName ? (
            <div className="flex items-center ml-4">
              <img
                src={user.photoURL}
                alt={`${user.displayName}'s Avatar`}
                className="rounded-full h-10 w-10 object-cover"
              />
              <span className="ml-2 font-bold">{user.displayName}</span>
              <button
                onClick={handleSignOut}
                className="text-black ml-5 font-bold"
              >
                Logout
              </button>
            </div>
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
      <hr className="border-t border-gray-300 mx-auto" />
    </div>
  );
}
