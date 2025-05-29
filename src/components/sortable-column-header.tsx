"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MouseEvent } from "react";

interface Props {
  id: string;
  label: string;
  isSorted: boolean;
  sortDirection: "asc" | "desc" | null;
  onSort: () => void;
}

const SortableColumnHeader = ({
  id,
  label,
  isSorted,
  sortDirection,
  onSort,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onSort();
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="border border-gray-300 p-2 text-left bg-white sticky top-0 z-10"
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      {label}
      {isSorted && (
        <span className="ml-1 text-xs">
          {sortDirection === "asc" ? "▲" : "▼"}
        </span>
      )}
    </th>
  );
};

export default SortableColumnHeader;
