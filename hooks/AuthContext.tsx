import { createContext, useState, ReactNode } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import Router, { useRouter } from "next/router";

type AuthContextType = {
  token: string | null;
  expirationTime: number | null;
  login: (token: string, expirationTime: number) => void;
  logout: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  expirationTime: null,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [expirationTime, setExpirationTime] = useState<number | null>(null);

  const loginHandler = (token: string, expirationTime: number) => {
    setToken(token);
    setExpirationTime(expirationTime);
  };

  const logoutHandler = async () => {
    Cookie.remove("token");
    Cookie.remove("name");
    Cookie.remove("role");
    const token = Cookie.get("token") as string;
    const logout = await axios
      .post("https://spda.17management.my.id/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setToken(null);
    setExpirationTime(null);
    Router.replace("/auth/login");
  };

  const contextValue: AuthContextType = {
    token: token,
    expirationTime: expirationTime,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
