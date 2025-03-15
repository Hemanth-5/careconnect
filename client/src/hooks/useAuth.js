import React, { useState, useEffect } from "react";

const useAuth = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Fetch role from localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []); // Run only once when the component mounts

  return role;
};

export default useAuth;
