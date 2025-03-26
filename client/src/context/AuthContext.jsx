import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Función para refrescar el token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("No se pudo refrescar el token");

      return true; // ✅ El token se renovó correctamente
    } catch (error) {
      console.error("Error al refrescar token:", error);
      setUser(null);
      return false;
    }
  };

  // ✅ Función para obtener usuario (incluye refresh-token)
  const fetchUser = async () => {
    try {
      let response = await fetch("http://localhost:3000/", {
        credentials: "include",
      });

      if (response.status === 401) {
        console.warn("Token expirado, intentando refrescar...");
        const refreshed = await refreshAccessToken();
        if (!refreshed) return;

        response = await fetch("http://localhost:3000/", {
          credentials: "include",
        });
      }

      if (!response.ok) throw new Error("No se pudo obtener el usuario");

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser(); // ✅ Se ejecuta al montar la app
  }, []);
  // Se ejecuta al montar la app
 

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
