# uiIntractionUtils.py

from app import eel

from app.database import createSession
from app.models.models import Events, Participants, EventParticipants
from app.state import instanceState, eventState



class UIInteractionManager():
    def __init__(self) -> None:
        pass

    def requestInflateInstanceDetailPanel(self, eventID):
        session = createSession()
        data=[]
        try:
            data = session.query(Events).filter(Events.eventID == eventID).first()
        except:
            session.rollback()
        finally:
            session.close()
        if data is None:
            eel.generatePopupMessage({"title": 404, "mood":False, "body": "Access denied"})
            return
        data = data.to_dict()
        data["startDatetime"] = str(data["startDatetime"])
        data["endDatetime"] = str(data["endDatetime"])
            
        eel.inflateInstanceDetailPanel(data)
    
    def eventCreatedSuccess(self):
        eel.eventCreatedSuccess()
    
    def refreshEventListHelper(self):
        eel.refreshEventListHelper()
    
    def eventCreatedFailed(self):
        eel.eventCreatedFailed()

    def returnEventsInstanceList(self, data):
        eel.listEventsInstanceList(data)

    def requestPopupMessage(self, message):
        # {"title": "Success", "mood":True | False, "body": ""}
        eel.generatePopupMessage(message)

    def returnRegisteredParticipantList(self, data, page, nextPageExists):
        eel.inflateRegisteredParticipantList(data, page, nextPageExists)

    def closeIndexHelper(self):
        try:
            eel.closeIndexHelper()
        except:
            pass
    
    def closeDashboardHelper(self):
        try:
            eel.closeDashboardHelper()
        except:
            pass

    def closeEventScannerHelper(self):
        try:
            eel.closeEventScannerHelper()
        except:
            pass

    def closeApplication(self):
        self.closeEventScannerHelper()
        self.closeDashboardHelper()
        self.closeIndexHelper()
        
    def redirectTo(self, newPage):
        if instanceState.currentTab == "index.html":
            instanceState.currentTab = "dashboard.html"
            self.closeIndexHelper()
        elif instanceState.currentTab == "dashboard.html":
            instanceState.currentTab = "dashboard.html"
            self.closeDashboardHelper()
        elif instanceState.currentTab == "eventAttendance.html":
            instanceState.currentTab = "eventAttendance.html"
            eventState.reset()
            self.closeEventScannerHelper()
    
        instanceState.currentTab = newPage
        eel.show(newPage)

    def initializeDashboardWindow(self):
        eel.setDashboardUserName(instanceState.userName)

    # Scanner UI interations:
    def returnScannerConfig(self):
        if eventState.eventID is None:
            raise Exception("Integrity Error")
        
        data = eventState.useEventState("configScanner")
        print(data)
        eel.initializeMyAppUI(data)

    def renderUserData(self, user_data):
        session = createSession()
        try:
            data = session.query(Participants).filter(Participants.pid == user_data["user_id"]).first()
            user_data["name"] = data.name
            user_data["email"] = data.email
            user_data["phone"] = data.phone
            
            eel.render_userdata(user_data)
        except Exception as err:
            print(err)
            session.rollback()
            raise Exception(err)
        finally:
            session.close()

    def returnPastCommits(self, data):
        if eventState.eventID is None:
            raise Exception("Integrity Error")
        
        eel.reRenderPastCommits(data)

    def re_render_chartData(self, data):
        eel.re_render_chartData({
            "confirmationCurr": data["registeredCurr"],
            "confirmationCap": data["registeredCap"],
            "venueCurr": data["venueCurr"],
            "venueCap":data["venueCap"]
        })

ui_interact = UIInteractionManager()