import React, { createContext, useState, ReactNode } from "react";

export const TokenContext = createContext({
  token: "",
  setToken: (token: string) => {},
});

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState({ token: "" });

  const updateToken = (token: string) => {
    setAuthToken({ token });
  };

  return (
    <TokenContext.Provider value={{ ...authToken, setToken: updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};
