import { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for logged-in user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("student_portal_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("student_portal_user");
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("student_portal_user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("student_portal_user");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
