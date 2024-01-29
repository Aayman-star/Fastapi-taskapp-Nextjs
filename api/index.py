from fastapi import FastAPI,Body,Depends,HTTPException
from sqlalchemy.orm import Session
from models import TodoItem
from database import SessionLocal,engine,Todos
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
import uvicorn

app: FastAPI = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}
@app.get("/")
def read_todos(db:Session = Depends(get_db)):
    """Get all Todos"""
    todos = db.query(Todos).order_by(Todos.id)
    if todos.first() is None:
        raise HTTPException(status_code=404, detail="No todos found")
    return todos.all()

@app.get("/todo/{todo_id}")
def get_todo(todo_id:int,db:Session=Depends(get_db)):
    """Get a single todo from the database"""
    todo = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.post("/api/create-todo")
def create_todo(todo:TodoItem,db:Session=Depends(get_db)):
    """Creating and storing a todo item in the database"""
    todo_item = Todos(text=todo.text,is_complete=todo.is_complete)
    db.add(todo_item)
    db.commit()
    db.refresh(todo_item)
    return todo_item

@app.get("/complete-todos")
def get_complete_todos(db: Session = Depends(get_db)):
    """Get all complete todos"""
    todos = db.query(Todos).filter(Todos.is_complete == True).order_by(Todos.id)
    if todos.first() is None:
        raise HTTPException(status_code=404, detail="No todos found")
    return todos.all( ) 

@app.put("/check-todo/{task_id}")
def check_task(task_id:int,db:Session=Depends(get_db)):
    """Check a task as complete"""
    todo = db.query(Todos).filter(Todos.id == task_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.is_complete = not todo.is_complete
    db.commit()
    db.refresh(todo)
    return todo

@app.put("/update-todo/{task_id}")
def update_todo(task_id:int,text:str,db:Session=Depends(get_db)):
    print(task_id,text)
    """Update Todo Description"""
    todo = db.query(Todos).filter(Todos.id == task_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.text = text
    db.commit()
    db.refresh(todo)
    return todo

@app.delete("/del/{todo_id}")
def delete_todo(todo_id:int,db:Session=Depends(get_db)):
    """Delete a todo from the database"""
    print(f"This is the id {todo_id}")
    todo = db.query(Todos).filter(Todos.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}

@app.delete("/delete-all")
def delete_all(db:Session=Depends(get_db)):
    """Delete all todos from the database"""
    db.query(Todos).delete()
    db.commit()
    return {"message": "All todos deleted successfully"}



if __name__ == "__main__":
    uvicorn.run("index:app", reload=True)
