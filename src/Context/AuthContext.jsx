import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [tokenUser, settokenUser] = useState(() => {
    return localStorage.getItem("UserToken");
  });

  const [userData, setuserData] = useState(() => {
    const savedData = localStorage.getItem("UserData");

    if (savedData && savedData !== "undefined") {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing UserData from localStorage:", error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("UserToken");
          localStorage.removeItem("UserData");
          settokenUser(null);
          setuserData(null);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{ tokenUser, settokenUser, userData, setuserData }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
