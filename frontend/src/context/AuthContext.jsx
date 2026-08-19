import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
  try {
    const storedUser =
      localStorage.getItem("case_tracker_user") ||
      sessionStorage.getItem("case_tracker_user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
});

  async function login(email, password, rememberMe) {
    const { data } = await client.post("/auth/login", { email, password });
     const storage = rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem(
    "case_tracker_token",
    data.token
  );

  storage.setItem(
    "case_tracker_user",
    JSON.stringify(data.user)
  );

  setUser(data.user);
  }

function logout() {
  localStorage.removeItem("case_tracker_token");
  localStorage.removeItem("case_tracker_user");

  sessionStorage.removeItem("case_tracker_token");
  sessionStorage.removeItem("case_tracker_user");

  setUser(null);
}

useEffect(() => {
  const token =
    localStorage.getItem("case_tracker_token") ||
    sessionStorage.getItem("case_tracker_token");

  if (!token) {
    setUser(null);
  }
}, []);
  const value = useMemo(() => ({
    user, login, logout, isAuthenticated: Boolean(user)
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
