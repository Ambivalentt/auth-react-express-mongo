import { useAuth } from "./context/AuthContext.jsx";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al cerrar sesión");

      await fetchUser(); // ✅ Refresca el estado del usuario
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };
  useEffect(() => {
    fetchUser().finally(() => setLoading(false)); 
  }, []);
  
  if (loading) return <p>Cargando...</p>;

  return (
    <section>
      {user ? (
        <div>
          <h2>Hola, {user.name}!</h2>
          <p>Tu ID es: {user.id}</p>
          <p>Tu email es: {user.email}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <h2>Bienvenido</h2>
          <p>Inicia sesión para ver tu información.</p>
        </div>
      )}
    </section>
  );
};

export default Index;
