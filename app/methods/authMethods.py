from app import eel
from app.models.models import Users
from app.database import createSession, closeSession
from app.methods.uiIntractionUtils import ui_interact

from app.state import instanceState

import bcrypt
from datetime import datetime, timedelta
class Authentication():
    def __init__(self) -> None:
        pass

    def signInController(self, useremail, userpassword) -> dict:
        session = createSession()
        res = {"status": False, "message": "some error occured"}

        try:
            user_ = session.query(Users).filter(Users.email == useremail).first()

            if user_ is None:
                res["message"] = "user-notfound"
                raise Exception("user-not-found")
            
            elif bcrypt.checkpw(userpassword.encode('utf-8'), user_.password):
                res["status"]= True
                res["userID"]= user_.userID
                res["message"]= "success"

                instanceState.userID = user_.userID
                instanceState.userName = user_.name
                instanceState.expireAt = datetime.now() + timedelta(days=3)
            else:
                res["message"]= "invalid-cred"

        except Exception as err:
            session.rollback()
        finally:
            session.close()
        return res
    
    def signUpController(self, username, useremail, userpassword) -> dict:
        session = createSession()
        res = {"status": False, "message": "some error occured"}
        try:
            user_ = session.query(Users).filter(Users.email == useremail).first()

            if user_ is not None:
                res["message"] = "user-exists"
                raise Exception("user-already-exists")
            else:
                user_ = Users(useremail, 
                              username,
                              "organizer", 
                              bcrypt.hashpw(userpassword.encode('utf-8'), bcrypt.gensalt()))
                
                session.add(user_)
                session.commit()
                res["status"] = True
                res["userID"] = user_.userID
                res["message"] = "success"

                instanceState.userID = user_.userID
                instanceState.userName = user_.name
                instanceState.expireAt = datetime.now() + timedelta(days=3)
    
        except Exception as err:
            session.rollback() if session else 0
        finally:
            session.close() if session else 0
        return res


    def signIn(self, useremail, userpassword):
        useremail = useremail.lower()
        res = auth.signInController(useremail, userpassword)
        if res["status"] is True:
            instanceState.userID = res["userID"]
            instanceState.expireAt = datetime.now() + timedelta(days=1)
        
            eel.signingSuccess(res)()
            ui_interact.redirectTo("dashboard.html")
        else:
            eel.signingFailed(res)()

    def signUp(self, username, useremail, userpassword):
        useremail = useremail.lower()
        username = username.lower()
        username = username[0].upper() + username[1::]

        res = auth.signUpController(username, useremail, userpassword)
        if res["status"] is True:
            eel.signingSuccess(res)()
            ui_interact.redirectTo("dashboard.html")
        else:
            eel.signingFailed(res)()


auth = Authentication()