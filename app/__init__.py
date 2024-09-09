import eel, eel.browsers
import rsa

eel.init('web', allowed_extensions=['.js', '.html'])


RSA_PUBLIC_KEY_ = rsa.PublicKey(
	6791411563309788692375731531390914535781035359523789213798071484996582439897712163526989636434352260105784013157625495637229271893289766016493804846999373,
	65537
)
RSA_PRIVATE_KEY_ = rsa.PrivateKey(
	6791411563309788692375731531390914535781035359523789213798071484996582439897712163526989636434352260105784013157625495637229271893289766016493804846999373,
	65537,
	5333895905926140097562653972317212459919151807763682780911764888166136548673465066224308477099443744693448425627627139495864423074768916425833022136890881,
	6916423694151714441373130286877935660419676795842744498475420115355888011678068409,
	981925322049366115752433962965688056315691124539816913720136824180249397
)



from app.methods.qrScannerMethods import qrScannerMethods
from app.methods.authMethods import auth
from app.methods.eventManagerMethods import eventManagement as em1
from app.methods.liveEventManager2Methods import eventManagement as em2
from app.methods.utilMethods import utils
from app.methods.uiIntractionUtils import ui_interact

# from app.methods.eventStatMethods import eventStats
from app.methods.authMethods import auth
from app.state import instanceState
# exposing all functions to 'eel'


@eel.expose
def startApplication():
    if instanceState.authenticate():
        ui_interact.redirectTo("dashboard.html")
    else:
        eel.show("index.html")

@eel.expose
def closeApplication():
    ui_interact.closeApplication()

# (Index.html) Authentication :
@eel.expose
def signin(useremail, userpassword):
    auth.signIn(useremail, userpassword)

@eel.expose
def signup(username, useremail, userpassword):
    auth.signUp(username, useremail, userpassword)


# Dashboard stuff:
@eel.expose
def initializeDashboardWindow():
    if instanceState.authenticate():
        ui_interact.initializeDashboardWindow()
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def createAnEvent(data):
    if instanceState.authenticate():
        em1.createAnEvent(data)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def fetchEventData(currentPage, filterVal=None):
    if instanceState.authenticate():
        em1.fetchEventData(currentPage, filterVal)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def updateEventDetails(data):
    if instanceState.authenticate():
        em1.updateEventDetails(data)
    else:
        ui_interact.redirectTo("index.html")


@eel.expose
def deleteEvent(eventID):
    if instanceState.authenticate():
        em1.deleteEvent(eventID)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def extractEventDetailsToTextFile(eventID):
    if instanceState.authenticate():
        em2.extractEventDetailsToTextFile(eventID)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def extractRegisteredParticipants(eventID):
    if instanceState.authenticate():
        em2.extractRegisteredParticipants(eventID)
    else:
        ui_interact.redirectTo("index.html")


@eel.expose
def requestInflateInstanceDetailPanel(eventID):
    if instanceState.authenticate():
        ui_interact.requestInflateInstanceDetailPanel(eventID)
    else:
        ui_interact.redirectTo("index.html")



@eel.expose
def registerParticipantsFromCSV(eventID, participants=None):
    if instanceState.authenticate():
        em1.registerParticipantsFromCSV(eventID, participants)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def requestRegistered_Participants(divType, eventID, page=1, filterValue=""):
    if instanceState.authenticate():
        if(divType == "registered"):
            em1.showRegisteredParticipants(eventID, page, filterValue)
        else:
            em1.showParticipants(eventID, page, filterValue)
    else:
        ui_interact.redirectTo("index.html")




@eel.expose
def startEventScanner(eventID):
    if instanceState.authenticate():
        em2.startEvent(eventID)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def resumeEventScanner(eventID):
    if instanceState.authenticate():
        em2.resumeEvent(eventID)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def pauseEvent():
    if instanceState.authenticate():
        em2.pauseEvent()
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def endEvent(eventID):
    if instanceState.authenticate():
        em2.endEvent(eventID)
    else:
        ui_interact.redirectTo("index.html")


# utils
@eel.expose
def selectPath():
    return utils.selectPath()

# @eel.expose
# def fetchAllEvents():
#     eventStats.fetchAllEvents()

# @eel.expose
# def fetchStatsData(eventId):
# 	eventStats.fetchStatsData(eventId)


@eel.expose
def beginQRScan():
    if instanceState.authenticate():
        qrScannerMethods.beginQRScan(RSA_PRIVATE_KEY_)
    else:
        ui_interact.redirectTo("index.html")


@eel.expose
def fetchScannerConfig():
    if instanceState.authenticate():
        em2.fetchScannerConfig()
    else:
        ui_interact.redirectTo("index.html")


@eel.expose
def registerWalkin(name, email, phone):
    if instanceState.authenticate():
        em1.registerWalkin(name, email, phone)
    else:
        ui_interact.redirectTo("index.html")

@eel.expose
def fetchAttendees():
    if instanceState.authenticate():
        em2.fetchAttendees()
    else:
        ui_interact.redirectTo("index.html")


# @eel.expose
# def test():
#     import datetime
#     d1 = {
#         "eventName": "Hello World 0.1",
#         "registrationEndTimeStamp": (datetime.datetime.now()+datetime.timedelta(seconds=100)).isoformat(),
#         "confirmationCurr": 99,
#         "confirmationCap": 100,
#         "venueCurr": 99,
#         "venueCap": 100
#     }
#     # ui = ScannerUIConfigModel(d1)
#     eel.initializeMyAppUI(d1)()