from datetime import datetime

class InstanceState():
    def __init__(self) -> None:
        self.userID = None
        self.userName = None
        self.expireAt = None
        self.currentTab = "dashboard.html"

        self.eventID = None
    
    def authenticate(self) -> bool:
        if self.userID is None or self.expireAt < datetime.now():
            self.userID = None
            self.userName = None
            self.expireAt = None
            self.currentTab = None
            
            return False
        return True
    
    def configInstanceTo_startEvent(eventID) -> None:
        self.eventID = eventID
        self.currentTab = "eventAttendance.html"



class EventState():
    def __init__(self) -> None:
        self.eventID = None
        self.eventName = None
        self.eventStatus = None
        self.startDatetime = None
        self.endDatetime = None
        self.admin = None
        self.summary = None
        self.venueName = None
        self.venueCap = None
        self.venueCurr = None
        self.registeredCap = None
        self.registeredCurr = None
        self.importCSVRoute = None
        self.exportCSVRoute = None

    def setEventState(self, event):
        self.eventID = event.eventID
        self.eventName = event.eventName
        self.eventStatus = event.eventStatus
        self.startDatetime = event.startDatetime
        self.endDatetime = event.endDatetime
        self.admin = event.admin
        self.summary = event.summary
        self.venueName = event.venueName
        self.venueCap = event.venueCap
        self.venueCurr = event.venueCurr
        self.registeredCap = event.registeredCap
        self.registeredCurr = event.registeredCurr
        self.importCSVRoute = event.importCSVRoute
        self.exportCSVRoute = event.exportCSVRoute
    
    def useEventState(self, format):
        state = {}
        if format == "configScanner":
            state = {
                "eventName": self.eventName,
                "registrationEndTimeStamp": (self.endDatetime).isoformat(),
                "confirmationCurr": int(self.registeredCurr),
                "confirmationCap": int(self.registeredCap),
                "venueCurr": int(self.venueCurr),
                "venueCap": int(self.venueCap)
            }
        # elif format == "pastCommit":
        #     state = {
        #         "timeStamp": (self.endDatetime).isoformat(),
        #         "confirmationCurr": int(self.registeredCurr),
        #         "confirmationCap": int(self.registeredCap),
        #         "venueCurr": int(self.venueCurr),
        #         "venueCap": int(self.venueCap)
        #     }
        return state


    def reset(self):
        self.eventID = None
        self.eventName = None
        self.eventStatus = None
        self.startDatetime = None
        self.endDatetime = None
        self.admin = None
        self.summary = None
        self.venueName = None
        self.venueCap = None
        self.venueCurr = None
        self.registeredCap = None
        self.registeredCurr = None
        self.importCSVRoute = None
        self.exportCSVRoute = None

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}


eventState = EventState()
instanceState = InstanceState()