import React from "react";
import shoppyImage from "../assets/shoppy.jpg"; // 이미지 파일의 상대 경로를 지정합니다.
import AllProducts from "./AllProducts";

export default function Home() {
  return (
    <div className>
      <div className="w-full relative">
        {/* 배너 이미지 */}
        <img
          src={shoppyImage} // 이미지 파일의 변수를 사용합니다.
          alt="배너 이미지"
          className="w-full md:h-[25rem] lg:h-[25rem] xl:h-[30rem] 2xl-[35rem]" // 배너 이미지가 화면 전체 너비를 차지하도록 설정
        />
        {/* 텍스트 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <p className="text-6xl mb-2">Shop With US</p>
          <p className="text-2xl">Best Products, High Quality</p>
        </div>
      </div>
      <AllProducts />
    </div>
  );
}
