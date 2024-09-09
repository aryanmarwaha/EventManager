import io, cv2
import pyqrcode, base64
from pyzbar.pyzbar import decode
import numpy as np
import winsound
import webview
import time
import json, rsa
import threading

from app import eel
from app.methods.liveEventManager2Methods import eventManagement as em2
from app.methods.uiIntractionUtils import ui_interact
from app.methods.utilMethods import utils
# class Beep():
#     def __init__(self):
#         self.isAvailable = True

class Methods():
    def __init__(self):
        pass

    # def beep(self,beep_,frequency = 2500,duration = 500):
    #     winsound.Beep(frequency,duration)
    #     print("BEEP......")
    #     beep_.isAvailable = True


    def beginQRScan(self,RSA_PRIVATE_KEY_):
        # user_data = {"img-src": "./Static/user_img_success.svg",
        #             "name": "Aryan",
        #             "role": "Student",
        #             "ticket": "34567776",
        #             "email": "asdfghgfgh@gmail.com",
        #             "phone": "12345-12345"}
        # user_data2 = [
        #     {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"},
        #     {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"},
        #     {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"}
        # ]

        s_time_in_sec = time.time()
        n=0
        cam = cv2.VideoCapture(0)
        scanning_ = True
        # beep_ = Beep()
        while scanning_:
            _,frame = cam.read()
            for barcode in decode(frame):
                # winsound.Beep(frequency,duration)
                data = barcode.data.decode('utf-8')

                QR_Succeed_OutlineColor = (255,0,255) # barcode -- highlighing-color
                QR_Fail_OutlineColor = (151,201,32) # barcode -- highlighing-color
                # QR_Fail_FillColor = (144,201,248) # barcode -- highlighing-color
                QR_Fail_FillColor = (248,201,144) # barcode -- highlighing-color
                try:
                    # if beep_.isAvailable==True:
                    #     self.beep(beep_)

                    data = utils.decodeJWT(data)
                    data['ticket'] = em2.markAttendee(data["user_id"], data["eventID"])
                    ui_interact.renderUserData(data)

                    # barcode -- highlighing
                    pts = np.array([barcode.polygon], np.int32)
                    pts = pts.reshape((-1,1,2))
                    cv2.polylines(frame,[pts],True,QR_Succeed_OutlineColor,5)

                except Exception as e:
                    print(e)
                    pts = np.array([barcode.polygon], np.int32)
                    pts = pts.reshape((-1,1,2))
                    cv2.fillPoly(frame,[pts],QR_Fail_FillColor)

            # setting image by calling js function via eel
            frame = cv2.flip(frame,1)
            _, buffer = cv2.imencode('.png', frame)
            frame_bytes = base64.b64encode(buffer.tobytes()).decode('utf-8')
            base64_string = "data:image/png;base64, " + frame_bytes
            scanning_ = bool(eel.SetImage(base64_string)())
            # Debug:
            n+=1
            if time.time() - s_time_in_sec > 1:
                print("Frame-rate: ~",n)
                s_time_in_sec = time.time()
                n=0

            # eel.sleep(1)
        eel.stopped_scan()
        cv2.destroyAllWindows()
        cam.release()

qrScannerMethods= Methods()