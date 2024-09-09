from sqlalchemy import Column, String, DateTime, SmallInteger, Integer, ForeignKey, Boolean
from app.database import ModelBase, engine, generate_uuid

class Users(ModelBase):
    __tablename__="users"

    userID = Column("userID", String, primary_key=True, default = generate_uuid)
    email = Column("email", String, nullable=False)
    name = Column("name", String)
    role = Column("role", String, default="organizer")
    password = Column("password", String, nullable=False)

    def __init__(self, email, name, role, password):
        self.email = email
        self.name = name
        self.role = role
        self.password = password


class Events(ModelBase):
    __tablename__="events"

    eventID = Column(Integer, primary_key=True, autoincrement=True)
    eventName = Column(String, nullable = False)
    eventStatus = Column(String, default="pending")
    startDatetime = Column(DateTime, nullable = False)
    endDatetime = Column(DateTime, nullable = False)
    admin = Column(String, nullable = False)
    summary = Column(String, default="")
    venueName = Column(String, default="")
    venueCap = Column(Integer, default=0)
    venueCurr = Column(Integer, default=0)
    registeredCap = Column(Integer, default=0)
    registeredCurr = Column(Integer, default=0)
    importCSVRoute = Column(String)
    exportCSVRoute = Column(String)

    def __init__(self, eventName, eventStatus, startDatetime, endDatetime, admin, summary=None, venueName=None, 
                 venueCap=0, venueCurr=0, registeredCap=0, registeredCurr=0, 
                 importCSVRoute=None, exportCSVRoute=None):
        self.eventName = eventName
        self.eventStatus = eventStatus
        self.startDatetime = startDatetime
        self.endDatetime = endDatetime
        self.admin = admin
        self.summary = summary
        self.venueName = venueName
        self.venueCap = venueCap
        self.venueCurr = venueCurr
        self.registeredCap = registeredCap
        self.registeredCurr = registeredCurr
        self.importCSVRoute = importCSVRoute
        self.exportCSVRoute = exportCSVRoute
    
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}


class Participants(ModelBase):
    __tablename__="participants"
    
    pid = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, default="")
    email = Column(String, unique = True ,nullable=False)
    phone = Column(String, default=None)
    def __init__(self, name, email, phone):
        self.name = name
        self.email = email
        self.phone = phone


class EventParticipants(ModelBase):
    __tablename__="eventParticipants"
    uid = Column(Integer, primary_key=True, autoincrement=True)
    pid = Column(Integer, ForeignKey("participants.pid"), nullable=False)
    eventID = Column(Integer, ForeignKey("events.eventID"), nullable=False)
    attendance = Column(Boolean, default=False)
    datetime = Column(DateTime)
    def __init__(self, pid, eventID):
        self.pid = pid
        self.eventID = eventID
    
    def __str__(self):
        return f"EventParticipants(uid={self.uid}, pid={self.pid}, eventID={self.eventID}, attendance={self.attendance}, datetime={self.datetime})"
    
    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}




ModelBase.metadata.create_all(bind=engine)