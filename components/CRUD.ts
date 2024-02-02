type Data = {
  text: string;
  isComplete: boolean;
};
type Data1 = {
  id: number;
  text: string;
};
type todo = {
  id: number;
  text: string;
  is_complete: boolean;
};
const BASE_URL = "http://127.0.0.1:8000";

export const sendTodo = async ({ text, isComplete }: Data) => {
  console.log(text, isComplete);
  try {
    const response = await fetch(`${BASE_URL}/api/create-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        is_complete: false,
      }),
    });
    if (response.ok) {
      return response.json();
    } else {
      return response.status;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const fetchTodos = async () => {
  const response = await fetch(`${BASE_URL}/api`, { cache: "no-store" });
  if (response.ok) {
    return response.json();
  } else {
    return "No tasks found";
  }
};

export const deleteTodo = async (id: number) => {
  console.log(`Id in the crud function ${id}`);
  const response = await fetch(`${BASE_URL}/api/del/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todo_id: id,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    return "Error";
  }
};

export const checkTodo = async (id: number) => {
  console.log(`Id from the check function in CRUD ${id}`);
  const response = await fetch(`${BASE_URL}/api/check-todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      task_id: id,
    }),
  });
};
export const deleteAll = async () => {
  const response = await fetch(`${BASE_URL}/api/delete-all`, {
    method: "DELETE",
  });
  if (response.ok) {
    return response.json();
  } else {
    return "Error";
  }
};
export const editTodo = async ({ id, text }: Data1) => {
  console.log(id, text, "I am here in the edit function");
  const response = await fetch(`${BASE_URL}/api/update-todo/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      text: text,
      is_complete: false,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    return "Error";
  }
};
