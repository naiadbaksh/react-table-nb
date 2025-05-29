"use client";

import { useEffect, useState } from "react";
import { generateFakeUsers, User } from "./lib/generateUsers";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortColumn, setSortColumn] = useState<
    keyof User | "fullName" | "dsr" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number = "";
    let bValue: string | number = "";

    if (sortColumn === "fullName") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    } else if (sortColumn === "dsr") {
      aValue = Math.floor(
        (Date.now() - new Date(a.registeredDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      bValue = Math.floor(
        (Date.now() - new Date(b.registeredDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    } else {
      aValue = a[sortColumn];
      bValue = b[sortColumn];
    }

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  return (
    <main className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold">Naiad's User Table</h1>
      <p>Loaded users: {users.length}</p>

      <div className="overflow-x-auto max-h-[80vh] border rounded mt-4">
        <table className="lg:min-w-full min-w-[900px] border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              {[
                { label: "ID", key: "id" },
                { label: "First Name", key: "firstName" },
                { label: "Last Name", key: "lastName" },
                { label: "Email", key: "email" },
                { label: "City", key: "city" },
                { label: "Registered Date", key: "registeredDate" },
                { label: "Full Name", key: "fullName" },
                { label: "DSR", key: "dsr" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as typeof sortColumn)}
                  className="cursor-pointer border border-gray-300 p-2 text-left whitespace-nowrap"
                >
                  {label}{" "}
                  {sortColumn === key && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              const dsr = Math.floor(
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
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.city}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(user.registeredDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">{fullName}</td>
                  <td className="border border-gray-300 p-2">{dsr}</td>
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
