import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyCart from "./pages/MyCart";
import ProductDetail from "./pages/ProductDetail";
import NewProduct from "./pages/NewProduct";
import AllProducts from "./pages/AllProducts";
import Home from "./pages/Home";
import Header from "./components/Header";
import { AuthContextProvider } from "./context/AuthContext.";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/carts" element={<MyCart />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
