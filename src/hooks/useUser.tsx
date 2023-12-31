import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  createAt: Date;
  updatedAt: Date;
}

export default function useUser() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await axios.get("/api/user");
      setUser(res.data.user);
    };
    fetchUserDetails();
  }, []);

  return { user };
}
