from sqlalchemy import Column, String, DateTime, SmallInteger, Integer, ForeignKey, Boolean
from app.database import ModelBase

class Users(ModelBase):
    __tablename__="users"

    uId = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False)
    role = Column(String)
    password = Column(String)
    secretToken = Column(String)


class Events(ModelBase):
    __tablename__="events"

    eventId = Column(Integer, primary_key=True, autoincrement=True)
    adminId = Column(Integer, ForeignKey("users.uId"), nullable=False)
    venueName = Column(String)
    venueFillCapacity = Column(Integer, nullable=False)
    venueMaxCapacity = Column(Integer, nullable=False)
    eventConfirmation = Column(Integer, nullable=False, default=0)
    eventMaxConfirmation = Column(Integer, nullable=False)



class EventParticipants(ModelBase):
    __tablename__="eventParticipants"
    
    uId = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String) # allways email
    datetime = Column(DateTime)

class EventAttendees(ModelBase):
    __tablename__="eventAttendees"

    attendeeId = Column(Integer, primary_key=True, autoincrement=True)
    uId = Column(Integer, ForeignKey("eventParticipants.uId"), nullable=False)
    eventId = Column(Integer, ForeignKey("events.uId"), nullable=False)
    inviteSent = Column(Boolean, default=False)
    attendance = Column(Boolean, default=False)