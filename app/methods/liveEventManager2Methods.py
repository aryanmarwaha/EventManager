from app import eel
from app.state import instanceState, eventState
from datetime import datetime
from app.database import createSession
from app.models.models import Events, Participants, EventParticipants
from app.methods.utilMethods import utils

from app.methods.uiIntractionUtils import ui_interact

# from datetime import datetime, timedelta
# from concurrent.futures import ThreadPoolExecutor, wait

class EventManagement():
    def __init__(self) -> None:
        pass

    def startEvent(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event.eventStatus != "upcoming":
                raise Exception("Integity Error")
            
            event.eventStatus = "live"
            session.commit()

            eel.refreshEventListHelper()
            ui_interact.requestInflateInstanceDetailPanel(eventID)

        except Exception as err:
            eel.generatePopupMessage({"title": "Failed", "mood":False, "body": str(err)})
            session.rollback()
        finally:
            session.close()



    def resumeEvent(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event.eventStatus != "live":
                raise Exception("Integity Error")
            
            eventState.setEventState(event)
            ui_interact.redirectTo("eventAttendance.html")

        except Exception as err:
            print("\n\n\n\n\n\nn\n\n\n", err)
            # eel.generatePopupMessage({"title": "Failed", "mood":False, "body": str(err)})
            session.rollback()
        finally:
            session.close()

    def pauseEvent(self):
        session = createSession()
        eventID = eventState.eventID
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event.eventStatus != "live":
                raise Exception("Integity Error")
            
            ui_interact.redirectTo("dashboard.html")

        except Exception as err:
            eel.generatePopupMessage({"title": "Failed", "mood":False, "body": str(err)})
            session.rollback()
        finally:
            session.close()

    def endEvent(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event.eventStatus != "live":
                raise Exception("Integity Error")
            
            event.eventStatus = "ended"

            session.commit()
            ui_interact.refreshEventListHelper()
            ui_interact.requestInflateInstanceDetailPanel(eventID)

        except Exception as err:
            ui_interact.requestPopupMessage({"title": "Failed", "mood":False, "body": str(err)})
            session.rollback()
        finally:
            session.close()

    def fetchScannerConfig(self):
        ui_interact.returnScannerConfig()
    
    def fetchAttendees(self):
        session = createSession()
        eventID = eventState.eventID
        try:
            attendees = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).filter(EventParticipants.attendance == True).order_by(EventParticipants.datetime.desc()).all()
            if attendees is None:
                raise Exception("Integrity Error")
            data = []
            for p_ in attendees:
                curr = session.query(Participants).filter(Participants.pid == p_.pid).first()
                d={}
                d["value"] = p_.uid
                d["participantName"] = curr.name
                d["timeStamp"] = (p_.datetime).isoformat() if p_.datetime is not None else ""
                data.append(d)
            ui_interact.returnPastCommits(data)
        except Exception as err:
            print(err)
            session.rollback()
        finally:
            session.close()

    def markAttendee(self, pid, eventID):
        session = createSession()
        ticket = ""
        try:
            attendee = session.query(EventParticipants).filter(EventParticipants.eventID == eventState.eventID).filter(EventParticipants.pid == pid).first()
            ticket = attendee.uid
            if attendee is None:
                raise Exception("Integrity Error")
            if attendee.attendance == True:
                raise Exception("Error")
            
            attendee.attendance = True
            attendee.datetime = datetime.now()
            event = session.query(Events).filter(Events.eventID == eventState.eventID).first()
            event.venueCurr+=1
            event.registeredCurr+=1
            session.commit()
            ui_interact.re_render_chartData({"registeredCurr": event.registeredCurr, "registeredCap": event.registeredCap, "venueCurr": event.venueCurr, "venueCap": event.venueCap})
        except Exception as err:
            print(err)
            session.rollback()
            raise Exception("err")
        finally:
            session.close()
        return ticket
    
    def extractRegisteredParticipants(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event is None:
                raise Exception("event does not exists.")
            participants = session.query(EventParticipants.uid, EventParticipants.pid, Participants.name, Participants.email, Participants.phone, EventParticipants.attendance, EventParticipants.datetime).join(Participants, EventParticipants.pid == Participants.pid).filter(EventParticipants.eventID == eventID).all()
            for i in range(len(participants)):
                participants[i] = { 
                                    "ticket-no": participants[i].uid, 
                                    "participant-id": participants[i].pid,
                                    "participant-name": participants[i].name,
                                    "participant-phone": participants[i].phone,
                                    "present": participants[i].attendance,
                                    "marked-for-present-at": participants[i].datetime
                                }

            utils.extractResultListAsCSV(event.eventName, participants)
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "data extracted successfuly."})
        except Exception as err:
            print(err)
        finally:
            session.close()
        
    def extractEventDetailsToTextFile(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            if event is None:
                raise Exception("event does not exists.")
            event = event.to_dict()
            utils.extractEventDetailsToTextFile([event])
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "data extracted successfuly."})
        except Exception as err:
            print(err)
            session.rollback()
        finally:
            session.close()

    # Mark Attendee
    # RegisterWalkin
    # fetch AttendeeList
eventManagement = EventManagement()