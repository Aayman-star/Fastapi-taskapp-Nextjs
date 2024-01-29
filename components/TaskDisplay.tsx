import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Trash, Check } from "lucide-react";
import { editTodo } from "./CRUD";
import { Input } from "./ui/input";

type todoItem = {
  id: number;
  text: string;
  is_complete: boolean;
};
type updateTodo = {
  id: number;
  text: string;
};

type displayProps = {
  item: todoItem;
  handleDelete: (id: number) => void;
  handleCheck: (id: number) => void;
};
const TaskDisplay = ({ item, handleDelete, handleCheck }: displayProps) => {
  const [text, setText] = useState(item.text);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setText(text);
    const updatedTodo: updateTodo = {
      id: item.id,
      text: text,
    };
    const response = await editTodo({ ...updatedTodo });
    setEdit(false);
  };

  // const handleBlur = async (id: number, text: string) => {
  //   setEdit(false);
  //   console.log(`ID ${id} Text ${text}`);
  //   const updatedTodo: updateTodo = {
  //     id: id,
  //     text: text,
  //   };
  //   const response = await editTodo({ ...updatedTodo });
  // };
  //const inputref = React.useRef<HTMLInputElement>(null);
  return (
    <div
      onDoubleClick={() => setEdit(true)}
      className="flex items-center justify-between border-b-2  border-zinc-800">
      {edit ? (
        <form action="post" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            // onBlur={() => handleBlur(item.id, text)}
            ref={inputRef}
          />
        </form>
      ) : (
        <li
          key={item.id}
          className={`p-3 ${
            item.is_complete ? "line-through" : "no-underline"
          }`}>
          {text}
        </li>
      )}

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
