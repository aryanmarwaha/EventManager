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

class Beep():
    def __init__(self):
        self.isAvailable = True

class Methods():
    def __init__(self):
        pass

    async def beep(self,beep_,frequency = 2500,duration = 500):
        winsound.Beep(frequency,duration)
        print("BEEP......")
        beep_.isAvailable = True


    def beginQRScan(self,RSA_PRIVATE_KEY_):
        user_data = {"img-src": "./Static/user_img_success.svg",
                    "name": "Aryan",
                    "role": "Student",
                    "ticket": "34567776",
                    "email": "asdfghgfgh@gmail.com",
                    "phone": "12345-12345"}
        user_data2 = [
            {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"},
            {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"},
            {"value": 13123, "participantName": "Aryan Marwaha", "timeStamp": "19:21:21 - 12/12/23"}
        ]

        s_time_in_sec = time.time()
        n=0
        cam = cv2.VideoCapture(0)
        scanning_ = True
        beep_ = Beep()
        while scanning_:
            _,frame = cam.read()
            for barcode in decode(frame):
                # winsound.Beep(frequency,duration)
                data = barcode.data.decode('utf-8')

                QR_Succeed_OutlineColor = (255,0,255) # barcode -- highlighing-color
                QR_Fail_OutlineColor = (255,255,255) # barcode -- highlighing-color
                QR_Fail_FillColor = (246,49,49) # barcode -- highlighing-color
                try:
                    if beep_.isAvailable==True:
                        self.beep(beep_)

                    data = json.loads(barcode.data.decode('utf-8'))
                    data["key"] = base64.b64decode(data["key"].encode('utf-8'))
                    data["key"] = rsa.decrypt(data["key"],RSA_PRIVATE_KEY_).decode()
                    print(data)
                    # user_data["ticket"] = data["ticket"]
                    # user_data = json.dumps(user_data)
                    eel.render_userdata(user_data)
                    eel.reRenderPastCommits(user_data2)

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
            n+=1;
            if time.time() - s_time_in_sec > 1:
                print("Frame-rate: ~",n)
                s_time_in_sec = time.time()
                n=0

            # eel.sleep(1)
        eel.stopped_scan()
        cv2.destroyAllWindows()
        cam.release()

qrScannerMethods= Methods()