import React, { useState, useEffect } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { auth, database } from "../firebase"; // 위에서 export한 firebase 인스턴스를 import
import axios from "axios";

export default function NewProducts() {
  const preset_key = "uploadimage";
  const cloud_name = "shoppyimage";
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  // 배열 형태로 useState안에 []로 초기화해준다.
  // options를 객체형태로 구성하고, 선택한 사이즈마다 순차적인 키를 할당하여 저장!
  // setOptions라는 배열 상태를 사용하여 사용자가 입력한 사이즈 옵션을 저장함.
  const [options, setOptions] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false); // 4초 후에 성공 메시지 숨기기
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  // 이 함수는 사용자가 선택한 이미지 파일을 productImage 상태에 저장하여 미리보기하거나
  // 나중에 서버로 전송하는 역할을 함.
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setImage(imageFile);

    // FormData 생성 및 업로드 프리셋 설정
    // 위에서 선언한 변수를 append의 두번째 인자로 넣어줘야한다!
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", preset_key);
    formData.append("cloud_name", cloud_name);

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 업로딩 상태 설정
    setIsUploading(true);

    const productData = {
      title,
      price,
      category,
      description,
      options,
      image: image || "",
    };

    // Firebase에 데이터 저장
    try {
      const productsRef = ref(database, "products");
      await push(productsRef, productData);

      // 폼 데이터 초기화
      setImage(null);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      // 배열로 초기화
      setOptions([]);

      // 성공 상태 설정
      setUploadSuccess(true);

      console.log("데이터가 Firebase 데이터베이스에 저장되었습니다.");
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
    } finally {
      // 업로딩 상태 리셋
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-column items-center justify-center w-full">
      <div className="flex justify-center text-2xl font-bold w-full px-50 mt-10 mb-5 h-[2rem]">
        새로운 제품 등록
      </div>
      {/* productImgage 상태가 존재할 때에만 아래의 내용이 렌더링되도록하는 조건부 렌더링
      <img...> 업로드한 이미지를 미리보기하는 img 요소임. 'src'속성을 통해 업로드한 이미지의
      url을 설정하고, 'alt'속성을 통해 대체 텍스트를 지정함.*/}
      {image && (
        <img
          // src={URL.createObjectURL(productImage)}
          src={image}
          alt="Product Preview"
          className="w-4/5 h-auto mx-auto mb-5"
        />
      )}

      {/* 업로드 상태 표시 */}
      {isUploading && <p className="text-blue-500">업로딩 중...</p>}
      <div className="flex justify-center ml-50 mr-50">
        {uploadSuccess && (
          <p className="text-black"> ✅제품이 성공적으로 추가되었습니다!</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center ml-50 mr-50">
          {/* 사용자가 이미지 파일을 선택하면 input 요소의 onChange 이벤트가 발생함. 
  handleImageChange 함수가 호출됨. 이벤트 객체의 target.files 속성을 사용하여 
  사용자가 선택한 파일들을 접근할 수 있음. 여기서는 첫번째 파일을 선택하고 이를
  'imageFile'변수에 저장함. 그리고 'setProductImage(imageFile)'을 호출하여
  'productsImage' 상태를 업데이트함. 이렇게 하면 선택한 이미지 파일이 'productImage'
  상태에 저장됨. */}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 pt-4 mb-5 outline-none"
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
            type="text"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
            required
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
          {/* setOptions라는 배열 상태를 사용하여 사용자가 입력한 사이즈 옵션을 저장
          사용자가 입력한 옵션들을 쉼표로 구분된 문자열로 표시하고, 이 문자열을 배열로 변환하여
          SetOptions에서 저장. 
          => 이렇세 함으로써 데이터베이스에 선택한 사이즈 옵션을 배열 형태로 저장할 수 있음 */}
          <input
            placeholder="옵션들(콤마(,)로 구분)"
            type="text"
            id="selectedSize"
            value={options.join(", ")}
            onChange={(e) => setOptions(e.target.value.split(", "))}
            required
            className="border border-gray-300 rounded h-[4rem] w-4/5 px-5 mb-5 outline-none"
          />
        </div>

        <div className="flex justify-center ml-50 mr-50">
          <button
            type="submit"
            className="font-bold bg-pink-300 text-white rounded h-[3rem] w-4/5 px-5 mt-1 mb-10"
            disabled={isUploading} // 업로드 중일 때 버튼 비활성화
          >
            {isUploading ? "업로딩 중..." : "제품 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
