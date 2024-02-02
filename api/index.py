import select
from fastapi import FastAPI,Body,Depends,HTTPException
from sqlalchemy.orm import Session
from db import engine,Todo,TodoCreate,TodoRead,TodoUpdate
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
import uvicorn
from sqlmodel import Session, delete,select
from typing import List
#import auth
from auth import router, get_current_user

app: FastAPI = FastAPI()

app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_session():
    with Session(engine) as session:
        yield session


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/user",status_code = status.HTTP_200_OK)
def get_user(*,session : Session = Depends(get_session),user = Depends(get_current_user)):
    """This is to get the current user"""
    if user is None:
        raise HTTPException(status_code=404, detail="No user found")
    return {"User":user}

@app.get("/api",response_model=List[TodoRead])
def read_todos(*,session:Session=Depends(get_session)):
    """Get all Todos"""
    todos = session.exec(select(Todo).order_by(Todo.id)).all()
    if todos is None:
        raise HTTPException(status_code=404, detail="No todos found")
    return todos


@app.get("/api/todo/{todo_id}",response_model=TodoRead)
def get_todo(*,session:Session = Depends(get_session),todo_id:int):
    """Get a single todo from the database"""
    todo = session.get(Todo, todo_id)  # Get the todo item from the database
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.post("/api/create-todo",response_model=TodoRead)
def create_todo(*,session:Session = Depends(get_session),todo:TodoCreate):
    """Creating and storing a todo item in the database"""
    todo_item = Todo.model_validate(todo)
    session.add(todo_item)
    session.commit()
    session.refresh(todo_item)
    return todo_item

@app.get("/api/complete-todos",response_model=List[TodoRead])
def get_complete_todos(*,session:Session = Depends(get_session)):
    """Get all complete todos"""
    todos = session.exec(select(Todo).where(Todo.is_complete == True)).all()
    if todos is None:
        raise HTTPException(status_code=404, detail="No todos found")
    return todos

@app.put("/api/check-todo/{task_id}")
def check_task(*,session:Session = Depends(get_session),task_id:int):
    """Check a task as complete"""
    db_todo = session.get(Todo, task_id)  # Get the todo item from the database
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.is_complete = not db_todo.is_complete
    session.add(db_todo)  # Add the updated todo to the session
    session.commit()
    session.refresh(db_todo)
    return db_todo

@app.put("/api/update-todo/{task_id}",response_model=TodoRead)
def update_todo(*,session:Session = Depends(get_session),task_id:int,todo:TodoUpdate):
    print(task_id,todo)
    """Update Todo Description"""
    db_todo = session.get(Todo,task_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo_data = todo.model_dump(exclude_unset=True)
    print(todo_data)
    for key, value in todo_data.items():
        setattr(db_todo, key, value)
    print(db_todo)
    session.add(db_todo)  # Add the updated todo to the session 
    session.commit()
    session.refresh(db_todo)
    return db_todo

@app.delete("/api/del/{todo_id}")
def delete_todo(*,session:Session = Depends(get_session),todo_id:int):
    """Delete a todo from the database"""
    print(f"This is the id {todo_id}")
    todo = session.get(Todo,todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()
    return {"message": "Todo deleted successfully"}

@app.delete("/api/delete-all")
def delete_all(*,session:Session = Depends(get_session)):
    """Delete all todos from the database"""
    result = session.exec(delete(Todo))
    session.commit()
    return {"message": f"{result.rowcount} todos deleted successfully"}



# if __name__ == "__main__":
#     uvicorn.run("index:app", reload=True)
