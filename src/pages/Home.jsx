import React from "react";
import shoppyImage from "../assets/shoppy.jpg"; // 이미지 파일의 상대 경로를 지정합니다.
import AllProducts from "./AllProducts";

export default function Home() {
  return (
    <div>
      <div className="w-full relative">
        {/* 배너 이미지 */}
        <img
          src={shoppyImage} // 이미지 파일의 변수를 사용합니다.
          alt="배너 이미지"
          className="w-full h-[37rem]" // 배너 이미지가 화면 전체 너비를 차지하도록 설정
        />
        {/* 텍스트 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl text-center">
          <p className="text-6xl mb-4">Shop With US</p>
          <p className="text-2xl">Best Products, High Quality</p>
        </div>
      </div>
      <AllProducts />
    </div>
  );
}
