import React from "react";
import { Button } from "./ui/button";
import { Trash, Check } from "lucide-react";

type todoItem = {
  id: number;
  text: string;
  is_complete: boolean;
};

type displayProps = {
  item: todoItem;
  handleDelete: (id: number) => void;
  handleCheck: (id: number) => void;
};
const TaskDisplay = ({ item, handleDelete, handleCheck }: displayProps) => {
  return (
    <div className="flex items-center justify-between border-b-2  border-zinc-800">
      <li
        key={item.id}
        className={`p-3 ${item.is_complete ? "line-through" : "no-underline"}`}>
        {item.text}
      </li>
      <div className="flex items-center space-x-2">
        <Button
          className="bg-green-500 text-zinc-50"
          size="sm"
          onClick={() => handleCheck(item.id)}>
          <Check />
        </Button>
        <Button
          className="bg-red-500 text-zinc-50"
          size="sm"
          onClick={() => handleDelete(item.id)}>
          <Trash />
        </Button>
      </div>
    </div>
  );
};

export default TaskDisplay;
