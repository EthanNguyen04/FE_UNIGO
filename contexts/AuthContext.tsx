import React, { createContext, useState, ReactNode } from "react";

export const AuthContext = createContext({
  email: "",
  password: "",
  setAuthData: (email: string, password: string) => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthDataState] = useState({ email: "", password: "" });

  const setAuthData = (email: string, password: string) => {
    setAuthDataState({ email, password });
  };

  return (
    <AuthContext.Provider value={{ ...authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
