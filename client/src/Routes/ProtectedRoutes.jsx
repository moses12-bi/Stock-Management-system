import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/useAuth";

const ProtectedRoutes = (props) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn());

  return isLoggedIn() ? (
    <>{props.children}</>
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
