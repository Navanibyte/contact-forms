import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
const OAuthSuccess: React.FC = () => {

     useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  console.log("OAuth Token:", token);

    if (token) {
    sessionStorage.setItem("accessToken", token);
    localStorage.setItem("accessToken", token);
    window.location.href = "/dashboard";
    }
   }, []);

    return <h1>Processing OAuth Success...</h1>;
}

export default OAuthSuccess;