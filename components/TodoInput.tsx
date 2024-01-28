"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { sendTodo, fetchTodos, deleteTodo, deleteAll, checkTodo } from "./CRUD";
import TaskDisplay from "./TaskDisplay";
import { TrashIcon } from "lucide-react";

type dataToSend = {
  text: string;
  isComplete: boolean;
};
type dataToReceive = {
  id: number;
  text: string;
  is_complete: boolean;
};

const TodoInput = () => {
  const [text, setText] = useState<string>("");
  const [textDisplay, setTextDisplay] = useState<string>("");
  const [todoList, setTodoList] = useState<Array<dataToReceive>>([]);
  useEffect(() => {
    fetchTodos().then((data) => setTodoList(data));
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(text);
    //!!Setting text taken from the input field to the state variable task
    const singleTask: dataToSend = {
      text: text,
      isComplete: false,
    };
    setTextDisplay(text);
    setText("");
    const response = await sendTodo({ ...singleTask });
    console.log(response);
    //!!After adding new todo refresh the display
    const newList = await fetchTodos();
    setTodoList(newList);
  };
  const handleDelete = async (id: number) => {
    console.log(`I am here ${id}`);
    //{ id, text, is_complete }
    const response = await deleteTodo(id);
    const newList = await fetchTodos();
    setTodoList(newList);
  };
  const handleCheck = async (id: number) => {
    console.log(`I am here in the handleCheck function ${id}`);
    const response = await checkTodo(id);
    const newList = await fetchTodos();
    setTodoList(newList);
  };
  const handleDeleteAll = async () => {
    const response = await deleteAll();
    const newList = await fetchTodos();
    setTodoList(newList);
  };
  return (
    <div className="w-full">
      <div className="w-full flex space-x-4">
        <div>
          <form
            className="w-full flex items-center space-x-4 mb-10"
            action="Post"
            onSubmit={handleSubmit}>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="Todo"
              placeholder="Add Todo"
            />
            <Button
              type="submit"
              className="bg-zinc-800 text-gray-50"
              variant="default">
              Add Todo
            </Button>
          </form>
        </div>

        <div>
          <Button
            onClick={handleDeleteAll}
            className="bg-zinc-800 text-zinc-50">
            <TrashIcon />
          </Button>
        </div>
      </div>{" "}
      <div>
        <ol className="p-4">
          {Array.isArray(todoList) ? (
            todoList.map((item, i) => (
              <TaskDisplay
                key={item.id}
                item={item}
                handleDelete={handleDelete}
                handleCheck={handleCheck}
              />
            ))
          ) : (
            <p className="p-2 text-zinc-800 font-semibold">
              Task List is Empty,Add a new task to get started😊{" "}
            </p>
          )}
        </ol>
      </div>
    </div>
  );
};

export default TodoInput;
