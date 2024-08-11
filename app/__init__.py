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

DATABASE_URL = "sqlite:///MAIN_DATABASE.db"
DB_ENGINE_ECHO = False


from app.database import createMyDbSession
from app.methods.qrScannerMethods import qrScannerMethods
from app.methods.eventStatMethods import eventStats

# exposing all functions to 'eel'

# class ScannerUIConfigModel():
#     def __init__ (self, data):
#         self.eventName = data.eventName
#         self.registrationEndTimeStamp = data.registrationEndTimeStamp
#         self.confirmationCurr = data.confirmationCurr
#         self.confirmationCap = data.confirmationCap
#         self.venueCurr = data.venueCurr
#         self.venueCap = data.venueCap

@eel.expose
def fetchAllEvents():
    eventStats.fetchAllEvents()

@eel.expose
def fetchStatsData(eventId):
	eventStats.fetchStatsData(eventId)

@eel.expose
def beginQRScan():
	qrScannerMethods.beginQRScan(RSA_PRIVATE_KEY_)

@eel.expose
def test():
    import datetime
    d1 = {
        "eventName": "Hello World 0.1",
        "registrationEndTimeStamp": (datetime.datetime.now()+datetime.timedelta(seconds=10)).isoformat(),
        "confirmationCurr": 1,
        "confirmationCap": 100,
        "venueCurr": 1,
        "venueCap": 100
    }
    # ui = ScannerUIConfigModel(d1)
    eel.initializeMyAppUI(d1)()