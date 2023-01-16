import { createContext, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  auth?: any;
  setAuth?: any;
};

const AuthContext = createContext<AuthContextType>({});

export function AuthProvider({ children }: { children: any }) {
  const [auth, setAuth] = useState({});
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
