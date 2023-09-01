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
  // 배열 형태로 useState 안에 []로 초기화해준다.
  // options를 객체 형태로 구성하고, 선택한 사이즈마다 순차적인 키를 할당하여 저장!
  // setOptions라는 배열 상태를 사용하여 사용자가 입력한 사이즈 옵션을 저장함.
  const [options, setOptions] = useState([]);

  // 업로드 중일 때와, 업로드가 성공했을 때의 상태 변수를 각각 만들어줌.
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 타이머가 정리되도록 컴포넌트가 언마운트되면 clearTimeout(timer)를
  // 호출하여 타이머를 정리함.
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

    // formData 생성 및 업로드 프리셋 설정
    // 위에서 선언한 변수를 append의 두번째 인자로 넣어줘야한다!
    const formData = new FormData();
    // formData 객체의 append() 메서드는 폼 데이터에 새로운 키-값 쌍을
    // 추가하는 역할을 함.
    // 웹 페이지에서 사용자로부터 입력받은 데이터나 파일 업로드 같은 경우에 유용하게 사용
    // 주로 ajax 요청이나 post 요청과 함께 사용되어 서버에 데이터를 전송하는데 사용
    formData.append("file", imageFile);
    formData.append("upload_preset", preset_key);
    formData.append("cloud_name", cloud_name);
    console.log(formData);
    // 첫번째 key는 서버에서 해당 데이터를 식별하기 위한 역할을 함
    // 두번째 인자는 폼 데이터에 추가하려는 데이터의 값, 해당 데이터의 값
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then((res) => {
        // 이미지 파일을 업로드하면 이미지 url이 setImage에 들어옴.
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

    // 업로딩 상태 설정
    setIsUploading(true);

    // 데이터를 전체적으로 한 데 묶어서 firebase에 저장하기 위해 변수를 선언함
    // 사용자가 입력한 제품 정보를 productData에 객체 형태로 저장함.
    const productData = {
      id,
      title,
      price,
      category,
      description,
      options,
      image: image || "",
    };

    // firebase에 데이터를 저장함.
    try {
      // firebase 데이터베이스의 products 경로에 대한 참조를 생성.
      //  이 참조를 통해 제품 정보를 저장할 위치를 지정
      const productsRef = ref(database, "products");
      // firebase의 push 함수를 사용하여 제품 정보를 데이터베이스에 추가
      // push 함수는 제품 정보 객체를 'products' 경로에 추가함.
      await push(productsRef, productData);
      // 폼 데이터 초기화
      setImage(null);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setOptions([]);

      // 성공 상태 설정
      setUploadSuccess(true);
      console.log("데이터가 Firebase 데이터베이스에 저장되었습니다!");
    } catch (error) {
      console.log("데이터 저장 중 오류 발생", error);
    } finally {
      // 업로딩 상태 리셋
      setIsUploading(false);
      setImage(null);
    }
  };
  // finally 는 오류가 발생하든 말든, 무조건 실행되는 블록. 업로딩 상태를
  // false로 리셋하여 로딩이 끝났음을 나타냄.

  // 각각의 입려폼을 div에 넣어서 중간정렬해주었음.
  // onChange에 각각 e.target.value 함수 전달
  return (
    <div className="flex-column items-center justify-center w-full">
      <div className="flex justify-center text-2xl font-bold w-full px-50 mt-10 mb-5 h-[2rem]">
        새로운 제품 등록
      </div>
      {/* image가 존재할 때에만 아래의 내용이 렌더링되도록 하는 조건부 렌더링
    업로드한 이미지를 미리보기하는 img 요소임. 'src'속성을 통해 업로드한 이미지의 url을
    설정하고, 'alt'속성을 통해서 대체 텍스트 지정 */}
      {image && (
        <img className="w-96 mx-auto mb-2" src={image} alt="Product Preview" />
      )}
      {/* 업로드 상태 표시 */}
      {/* && 연산자는 조건이 true일 때만 뒤의 표현식을 평가하고 반환 */}
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
          {/* 사용자가 이미지 파일을 선택하면 input 요소의 onChange 이벤트가 발생함.
          handleImageChange 함수가 호출됨. 이벤트 객체의 target.files 속성을 사용하여
          사용자가 선택한 파일들을 접근할 수 있음. 여기서는 첫번째 파일을 선택하고 imageFile 변수에 저장.
          그리고 'setProductImage(imageFile)'을 호출하여 setImage 상태를 업데이트함. 
          이렇게 하면 선택한 이미지 파일이 setImage 상태에 저장됨.  */}
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
            {/* 조건부 연산자 ?는 조건에 따라 두가지 다른 표현식 중 하나를 선택하여 반환 */}
            {isUploading ? "업로드 중..." : "제품 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
