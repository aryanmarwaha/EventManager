from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

from app import DATABASE_URL, DB_ENGINE_ECHO


# DataBase --connection initialization:

engine = create_engine(DATABASE_URL, echo=DB_ENGINE_ECHO)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

ModelBase = declarative_base()


# Creating The DB-dependency:
def createMyDbSession():
    curr_session= sessionLocal()
    return curr_session

	# try:
	# 	yield curr_session
	# finally:
	# 	curr_session.close()

ModelBase.metadata.create_all(bind=engine)