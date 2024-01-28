from pydantic import BaseModel

class TodoItem(BaseModel):
    text: str
    is_complete: bool = False
