import Authorization from "./components/Authorization";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import Unauthorized from "./components/Unauthorized";
import Administrator from "./components/Administrator";
import Seller from "./components/seller-page/Seller";
import User from "./components/user-page/User";
import Cart from "./components/user-page/Cart";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  let user = undefined;
  try {
    const jwt = localStorage.getItem("token");
    const tmpUser = jwtDecode(jwt);
    user = tmpUser;

    tmpUser.status === "approved" ? (user = tmpUser) : (user = undefined);
  } catch (ex) {
    console.log("You have to login");
  }

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Authorization user={user} />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        <Route
          path="/welcome"
          element={
            <ProtectedRoute isAllowed={!!user} redirectPath="/">
              <Welcome user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.role === "admin"}
              redirectPath="/unauthorized"
            >
              <Administrator user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/seller"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.role === "seller"}
              redirectPath="/unauthorized"
            >
              <Seller user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/user"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.role === "user"}
              redirectPath="/unauthorized"
            >
              <User user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/cart"
          element={
            <ProtectedRoute
              isAllowed={!!user && user.role === "user"}
              redirectPath="/unauthorized"
            >
              <Cart user={user} />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
