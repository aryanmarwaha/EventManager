from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

import uuid

DATABASE_URL = "sqlite:///MAIN_DATABASE.db"
DB_ENGINE_ECHO = False

# DataBase --connection initialization:
engine = create_engine(DATABASE_URL, echo=DB_ENGINE_ECHO)
sessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)

ModelBase = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

# Creating The DB-dependency:
def createSession():
    return sessionLocal()

def rollbackSession(session):
    try:
        session.rollback()
    except:
        pass
def closeSession(session):
    try:
        session.close()
    except:
        pass