import React, { useState, useEffect } from "react";

const Index = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/", {
          credentials: "include", // Para enviar cookies
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setUser(data);
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchUser();
  }, []);

  // Función para borrar cookies y cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include", // Para asegurarse de enviar la cookie
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al cerrar sesión");
      console.log("Sesión cerrada", data.message);
      setUser(null); // Elimina el usuario del estado
      setMessage("Sesión cerrada");
    } catch (err) {
      setMessage("Error al cerrar sesión");
    }
  };

  return (
    <section>
      {user === null ? (
        <div>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h2>Hola, {user.name}!</h2>
          <p>Tu ID es: {user._id}</p>
          <p>TU email es:{user.email}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      )}
    </section>
  );
};

export default Index;
