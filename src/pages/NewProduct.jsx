import axios from "axios";
import { push, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { v4 as uuid } from "uuid";

export default function NewProduct() {
  // 이 파라미터들이 Cloudinary API 호출에 필요한 인증 정보임.
  const preset_key = "uploadimage";
  const cloud_name = "shoppyimage";
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false); // 4초 후에 성공 메시지를 숨기기
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  // 이 함수는 사용자가 선택한 이미지 파일을 productImage 상태에 저장하여 미리보기하거나 서버로 전송
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setImage(imageFile);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", preset_key);
    formData.append("cloud_name", cloud_name);
    console.log(formData);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then((res) => {
        setImage(res.data.secure_url);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = uuid();

    setIsUploading(true);

    const productData = {
      id,
      title,
      price,
      category,
      description,
      options,
      image: image || "",
    };

    try {
      const productsRef = ref(database, "products");
      await push(productsRef, productData);
      setImage(null);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setOptions([]);
      setUploadSuccess(true);
      console.log("데이터가 Firebase 데이터베이스에 저장되었습니다!");
    } catch (error) {
      console.log("데이터 저장 중 오류 발생", error);
    } finally {
      setIsUploading(false);
      setImage(null);
    }
  };

  return (
    <div className="flex-column items-center justify-center w-full">
      <div className="flex justify-center text-2xl font-bold w-full px-50 mt-10 mb-5 h-[2rem]">
        새로운 제품 등록
      </div>
      {image && (
        <img className="w-96 mx-auto mb-2" src={image} alt="Product Preview" />
      )}
      {isUploading && <p className="text-blue-500">업로딩 중...</p>}
      {/* <div className="flex-justify-center ml-50 mr-50 mb-50"> */}
      {uploadSuccess && (
        <p className="w-[16rem] mx-auto mb-4">
          ✅ 제품이 성공적으로 추가되었습니다!
        </p>
      )}
      {/* {success && <p className="w-96 mx-auto mb-2">✅ {success}</p>} */}
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center ml-50 mr-50">
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 pt-4 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <input
            placeholder="제품명"
            type="text"
            id="productName"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <input
            placeholder="가격"
            type="number"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <input
            placeholder="카테고리"
            type="text"
            id="productCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <input
            placeholder="제품 설명"
            type="text"
            id="productCategory"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <input
            placeholder="옵션들(콤마(,)로 구분)"
            type="text"
            id="selectedSize"
            value={options.join(",")}
            onChange={(e) => setOptions(e.target.value.split(","))}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>
        <div className="flex justify-center ml-50 mr-50">
          <button
            type="submit"
            className="font-bold bg-pink-300 text-white rounded h-[3rem] w-4/5 px-5 mt-1 mb-10"
            disabled={isUploading} //업로드 중일 때 버튼 비활성화
          >
            {isUploading ? "업로드 중..." : "제품 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
