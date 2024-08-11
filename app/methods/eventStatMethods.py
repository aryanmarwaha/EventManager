from app import createMyDbSession
from app.models.models import EventAttendees

class Methods():
    def __init__(self):
        pass
	
    def fetchAllEvents():
        try:
            session = createMyDbSession()
            data = session.query(Events).all()
            print(data)
            session.close()
        except:
            print("error occurred while fetching all events")


    def fetchStatsData(self, eventId):
        session = createMyDbSession()

        data = session.query(EventAttendees).filter(EventAttendees.eventId == eventId).all()

        print(data)
        pass
    

eventStats= Methods()
		