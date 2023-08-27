import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import userEvent from "@testing-library/user-event";

// context를 만들어줌.
const AuthContext = createContext();

// 어플리케이션 전반적으로 사용할 것임.
export const AuthContextProvider = ({ children }) => {
  // manage our user in our state
  const [user, setUser] = useState({});

  // 로그인하는 함수를 만듦.
  // doc에 있는 대로 authprovider가 필요하므로 추가해줌.
  // Create an instance of the Google provider object:
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  // play this onAuth State change
  // set user to current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("user", currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // we only want to run once when the component mounts

  // 로그아웃 함수를 만들어준 후 logOut, user를 패스해준다.
  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
