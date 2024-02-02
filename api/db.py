import os
from sqlalchemy import create_engine, Column, Integer, String,Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv,find_dotenv
from sqlmodel import SQLModel, Field, Relationship, Session, select
from typing import Optional

"""Loading the environment variable"""
load_dotenv(override=True)
dotenv_file = find_dotenv()


DATABASE_URL = os.environ["DATABASE_URL"]
print(DATABASE_URL)




#Base = declarative_base()

# class Todos(Base):
#     __tablename__ = "todos"

#     id = Column(Integer, primary_key=True, index=True)
#     text = Column(String, index=True)
#     is_complete = Column(Boolean, default=False) 
class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    is_complete: bool = False

class TodoCreate(SQLModel):
    text: str
    is_complete: bool = False

class TodoRead(SQLModel):
    id: int
    text: str
    is_complete: bool 

class TodoUpdate(SQLModel):
    id:int
    text: str
    is_complete: Optional[bool] = False

class Users(SQLModel,table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    useremail: str
    password:str

class UserCreate(SQLModel):
    username: str
    useremail: str
    password:str

class Token(SQLModel):
    access_token: str
    token_type: str
    

engine = create_engine(DATABASE_URL, echo=True)
#SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#session = Session(engine)
   

# Base.metadata.create_all(engine)
SQLModel.metadata.create_all(engine)
