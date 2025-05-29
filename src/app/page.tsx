"use client";

import { useEffect, useState } from "react";
import { generateFakeUsers, User } from "./lib/generateUsers";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableColumnHeader from "@/components/sortable-column-header";
import { ColumnKey, DEFAULT_COLUMNS, columnLabels } from "./lib/columns";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [columns, setColumns] = useState<ColumnKey[]>(DEFAULT_COLUMNS);
  const [sortConfig, setSortConfig] = useState<{
    key: ColumnKey;
    direction: "asc" | "desc";
  } | null>(null);

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

  const handleSort = (key: ColumnKey) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: string | number = a[key] ?? "";
    let bValue: string | number = b[key] ?? "";

    if (key === "fullName") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }
    if (key === "dsr") {
      const getDSR = (date: string) =>
        Math.floor(
          (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
        );
      aValue = getDSR(a.registeredDate);
      bValue = getDSR(b.registeredDate);
    }

    if (typeof aValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }
    return direction === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Naiad's User Table</h1>
      <p>Loaded users: {users.length}</p>

      <div className="overflow-x-auto max-h-[80vh] border rounded">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (active.id !== over?.id) {
              setColumns((cols) => {
                const oldIndex = cols.indexOf(active.id as ColumnKey);
                const newIndex = cols.indexOf(over?.id as ColumnKey);
                return arrayMove(cols, oldIndex, newIndex);
              });
            }
          }}
        >
          <SortableContext
            items={columns}
            strategy={horizontalListSortingStrategy}
          >
            <table className="lg:min-w-full min-w-[900px] border-collapse border border-gray-300">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  {columns.map((col) => (
                    <SortableColumnHeader
                      key={col}
                      id={col}
                      label={columnLabels[col]}
                      onClick={() => handleSort(col)}
                      isSorted={sortConfig?.key === col}
                      direction={sortConfig?.direction}
                    />
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
                      {columns.map((col) => {
                        let value;
                        if (col === "fullName") value = fullName;
                        else if (col === "dsr") value = dsr;
                        else if (col === "registeredDate")
                          value = new Date(user[col]).toLocaleDateString();
                        else value = user[col];

                        return (
                          <td
                            key={col}
                            className="border border-gray-300 p-2 whitespace-nowrap"
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
};

export default Home;
