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
    <main className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold">Naiad's User Table</h1>
      <p>Loaded users: {users.length}</p>

      <div className="overflow-x-auto max-h-[80vh] border rounded mt-4">
        <table className="lg:min-w-full min-w-[900px] border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white shadow z-10">
            <tr>
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">
                First Name
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Last Name
              </th>
              <th className="hidden sm:table-cell border border-gray-300 p-2 text-left">
                Email
              </th>
              <th className="hidden md:table-cell border border-gray-300 p-2 text-left">
                City
              </th>
              <th className="hidden md:table-cell border border-gray-300 p-2 text-left">
                Registered Date
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Full Name
              </th>
              <th className="hidden md:table-cell border border-gray-300 p-2 text-left">
                DSR
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              const daysSinceRegistration = Math.floor(
                (Date.now() - new Date(user.registeredDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <tr key={user.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">
                    {user.firstName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {user.lastName}
                  </td>
                  <td className="hidden sm:table-cell border border-gray-300 p-2">
                    {user.email}
                  </td>
                  <td className="hidden md:table-cell border border-gray-300 p-2">
                    {user.city}
                  </td>
                  <td className="hidden md:table-cell border border-gray-300 p-2">
                    {new Date(user.registeredDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">{fullName}</td>
                  <td className="hidden md:table-cell border border-gray-300 p-2">
                    {daysSinceRegistration}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Home;
