"use client";

import { useEffect, useState } from "react";
import { generateFakeUsers, User } from "./lib/generateUsers";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUsers(parsed);
      } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        const fakeUsers = generateFakeUsers(500);
        localStorage.setItem("users", JSON.stringify(fakeUsers));
        setUsers(fakeUsers);
      }
    } else {
      const fakeUsers = generateFakeUsers(500);
      localStorage.setItem("users", JSON.stringify(fakeUsers));
      setUsers(fakeUsers);
    }
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Naiad's User Table</h1>
      <p>Loaded users: {users.length}</p>
    </main>
  );
};

export default Home;
