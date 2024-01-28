import React from "react";
import TodoInput from "./TodoInput";

const TodoApp = () => {
  return (
    <div className="bg-background max-w-7xl flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-semibold text-zinc-800">Fast-Task List!</h1>

      <TodoInput />
    </div>
  );
};

export default TodoApp;
