from app import eel
from app.state import instanceState,eventState

from app.database import createSession
from app.models.models import Events, Participants, EventParticipants
from app.methods.utilMethods import utils

from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, wait

from app.methods.uiIntractionUtils import ui_interact


class EventManagement():
#private:
    def pageRunningFilter(self,d_):
        if d_["eventStatus"] == 'live':
            return True
        return False
    
    def pageUpComingFilter(self,d_):
        if d_["eventStatus"] == 'upcoming':
            return True
        return False
    
    def pageEndedFilter(self,d_):
        if d_["eventStatus"] == 'ended':
            return True
        return False
    def registerParticipantToApp(self, participant, session):
        p_ = None
        try:
            print(participant)
            p_ = session.query(Participants).filter(Participants.email==participant["email"]).first()
            if p_ is None:
                p_ = Participants(participant["name"], participant["email"], participant["phone"])
                session.add(p_)
                session.commit()
        except Exception as err:
            return "error"
        return p_.pid
    
    def registerParticipantToEvent(self, participant, eventID, session):
        try:
            p_ = EventParticipants(participant["pid"], eventID)
            session.add(p_)
            session.commit()
        except:
            session.rollback()

#public:
    def __init__(self) -> None:
        pass
    
    def createAnEvent(self, data):
        session = createSession()
        try:
            newEvent = Events(  data["eventName"],
                                "pending",
                                datetime.strptime(data["startDatetime"], "%Y-%m-%dT%H:%M"),
                                datetime.strptime(data["endDatetime"], "%Y-%m-%dT%H:%M"),
                                instanceState.userName,
                                data["summary"],
                                data["venueName"],
                                int(data["venueCap"]),
                                0,
                                0,
                                0,
                                data["importCSVRoute"],
                                data["exportCSVRoute"]
                            )
            session.add(newEvent)
            session.commit()
            ui_interact.eventCreatedSuccess()
            ui_interact.refreshEventListHelper()
        except Exception as err:
            session.rollback()
            ui_interact.eventCreatedFailed()
        finally:
            session.close()

    def fetchEventData(self, currentPage, filterVal=None):
        session = createSession()
        data=[]
        try:
            if filterVal==None:
                data = session.query(Events).all()
            else:
                data = session.query(Events).filter(Events.eventName.startswith(filterVal)).all()
        except:
            session.rollback()
        finally:
            session.close()

        for i in range(len(data)):
            data[i] = data[i].to_dict()
            data[i]["startDatetime"] = str(data[i]["startDatetime"])
            data[i]["endDatetime"] = str(data[i]["endDatetime"])
            
        if currentPage == 'running':
            ui_interact.returnEventsInstanceList(list(filter(self.pageRunningFilter, data)))
        elif currentPage == 'upcoming':
            ui_interact.returnEventsInstanceList(list(filter(self.pageUpComingFilter, data)))
        elif currentPage == 'history':
            ui_interact.returnEventsInstanceList(list(filter(self.pageEndedFilter, data)))
        else:
            ui_interact.returnEventsInstanceList(data)
    
    
    
    def updateEventDetails(self, data):
        # print(data)
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == data["eventID"]).first()
            if event is None:
                raise Exception("err")

            event.eventName = data['eventName']
            event.startDatetime = datetime.strptime(data["startDatetime"], '%Y-%m-%d %H:%M:%S')
            event.endDatetime = datetime.strptime(data["endDatetime"], '%Y-%m-%d %H:%M:%S')
            event.summary = data['summary']
            event.venueName = data['venueName']
            event.venueCap = data['venueCap']
            event.venueCurr = data['venueCurr']
            event.registeredCap = data['registeredCap']
            event.registeredCurr = data['registeredCurr']
            event.importCSVRoute = data['importCSVRoute']
            event.exportCSVRoute = data['exportCSVRoute']
            
            session.commit()
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "Updated "+event.eventName+" successfully."})
            ui_interact.refreshEventListHelper()
        except Exception as err:
            session.rollback()
        finally:
            session.close()
    
    def deleteEvent(self, eventID):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID == eventID).first()
            tickets = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).all()
            if event is None:
                raise Exception("Integrity Error")

            session.delete(event)
            for ticket in tickets:
                session.delete(ticket)
            session.commit()
            ui_interact.refreshEventListHelper()
        except Exception as err:
            print(err)
            session.rollback()
        finally:
            session.close()

    def registerWalkin(self, name, email, phone):
        session = createSession()
        eventID = eventState.eventID
        try:
            participant = {}
            participant["name"] = name
            participant["email"]= email
            participant["phone"] = phone

            participant["pid"] = self.registerParticipantToApp(participant, session)

            event = session.query(EventParticipants).filter(EventParticipants.eventID==eventID).filter(EventParticipants.pid==participant["pid"]).first()
            if event is not None:
                raise Exception("duplicate entry")
            utils.generateQRCode_and_MailItToParticipant(participant, eventID)
            self.registerParticipantToEvent(participant, eventID, session)
            
            event = session.query(Events).filter(Events.eventID == eventState.eventID).first()
            event.registeredCap+=1
            session.commit()
            ui_interact.re_render_chartData({"registeredCurr": event.registeredCurr, "registeredCap": event.registeredCap, "venueCurr": event.venueCurr, "venueCap": event.venueCap})
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "Ticket has successfully been generated and sent to participant successfully."})
        except Exception as err:
            session.rollback()
        finally:
            session.close()
        
    def registerParticipantsFromCSV(self, eventID, participants=None):
        session = createSession()
        try:
            event = session.query(Events).filter(Events.eventID==eventID).first()
            if event is None:
                raise Exception("eventID does not exist.")
            if participants==None:
                participants = utils.importRegistrationLinksFromCSV(event.importCSVRoute)
            participants = list(participants.values())
            
            event.registeredCap = len(participants)
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "Generating Qrcodes and mailing them to all the participants may take sometime\n*please do not close the application in the meanwhile."})
            # session.commit()
            futures = []
            with ThreadPoolExecutor() as executor:
                for participant in participants:
                    participant["pid"] = self.registerParticipantToApp(participant, session)
                    future = executor.submit(utils.generateQRCode_and_MailItToParticipant, participant, eventID)
                    futures.append(future)
                    self.registerParticipantToEvent(participant, eventID, session)
                wait(futures)
                    
            # endLoader
            eel.refreshEventListHelper()
            ui_interact.requestPopupMessage({"title": "Success", "mood":True, "body": "Tickets have successfully been generated and sent to all participants successfully."})
            event.eventStatus = "upcoming"
            session.commit()
            ui_interact.requestInflateInstanceDetailPanel(eventID)
        except Exception as err:
            session.rollback()
        finally:
            session.close()
    
    def showRegisteredParticipants(self, eventID, page=1, filterValue=None):
        filterValue = filterValue or ""
        page = int(page)
        eventID = int(eventID)
        session = createSession()
        data = []
        nextPageExists = False
        try:
            # if filterValue=="":
            #     registered_participants = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).offset((page-1)*10).limit(11).all()
            # else:
            #     registered_participants = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).offset((page-1)*10).limit(11).all()

            # if registered_participants is None or len(registered_participants) == 0:
            #     raise Exception("no data found")

            registered_participants = (session.query(EventParticipants.pid, Participants.name, Participants.email, Participants.phone).join(Participants, EventParticipants.pid == Participants.pid)
                .filter(EventParticipants.eventID == eventID)
                .filter(Participants.email.like(f"{filterValue}%"))).offset((page-1)*10).limit(11).all()

            nextPageExists = bool(len(registered_participants)>10)
            if nextPageExists:
                registered_participants.pop()
            
            # print(registered_participants)

            for p_ in registered_participants:
                d={}
                d["pid"] = p_.pid
                d["name"] = p_.name
                d["email"] = p_.email
                d["phone"] = p_.phone

                data.append(d)

            ui_interact.returnRegisteredParticipantList(data, page, nextPageExists)
        except Exception as err:
            ui_interact.requestPopupMessage({"title": "", "mood":False | False, "body": str(err)})
            session.rollback()
        finally:
            session.close()

    def showParticipants(self, eventID, page=1, filterValue=None):
        filterValue = filterValue or ""
        page = int(page)
        eventID = int(eventID)
        session = createSession()
        data = []
        nextPageExists = False
        try:
            # if filterValue=="":
            #     registered_participants = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).offset((page-1)*10).limit(11).all()
            # else:
            #     registered_participants = session.query(EventParticipants).filter(EventParticipants.eventID == eventID).offset((page-1)*10).limit(11).all()

            # if registered_participants is None or len(registered_participants) == 0:
            #     raise Exception("no data found")

            registered_participants = (session.query(EventParticipants.pid, Participants.name, Participants.email, Participants.phone).join(Participants, EventParticipants.pid == Participants.pid)
                .filter(EventParticipants.eventID == eventID)
                .filter(EventParticipants.attendance == True)
                .filter(Participants.email.like(f"{filterValue}%"))).offset((page-1)*10).limit(11).all()

            nextPageExists = bool(len(registered_participants)>10)
            if nextPageExists:
                registered_participants.pop()
            
            # print(registered_participants)

            for p_ in registered_participants:
                d={}
                d["pid"] = p_.pid
                d["name"] = p_.name
                d["email"] = p_.email
                d["phone"] = p_.phone

                data.append(d)

            ui_interact.returnRegisteredParticipantList(data, page, nextPageExists)
        except Exception as err:
            ui_interact.requestPopupMessage({"title": "", "mood":False | False, "body": str(err)})
            session.rollback()
        finally:
            session.close()

eventManagement = EventManagement()