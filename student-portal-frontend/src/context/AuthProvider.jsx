import { createContext, useState } from "react";

// ✅ Create context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// ✅ Define provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
