import eel, eel.browsers, io, cv2
import pyqrcode, base64
from pyzbar.pyzbar import decode
import numpy as np
import winsound
import webview
import time
import threading

frequency = 2500
duration = 500

eel.init('web', allowed_extensions=['.js', '.html'])

@eel.expose
def gen_qr():
	img = pyqrcode.create("aryan")
	buffers = io.BytesIO()
	img.png(buffers, scale=8)
	frame_bytes = base64.b64encode(buffers.getvalue()).decode("ascii")
	# print(frame_bytes)
	return "data:image/png;base64, "+ frame_bytes

@eel.expose
def scan_qr():
	s_time_in_sec = time.time()
	n=0
	cam = cv2.VideoCapture(0)
	scanning_ = True;
	while scanning_:
		_,frame = cam.read()
		for barcode in decode(frame):
			pts = np.array([barcode.polygon], np.int32)
			pts = pts.reshape((-1,1,2))
			cv2.polylines(frame,[pts],True,(255,0,255),5)
			winsound.Beep(frequency,duration)
			data = barcode.data.decode('utf-8')
			print(type(data))
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

@eel.expose
def print_(jsvar = True):
	print('----------------js-var : ',bool(jsvar))
	return

eel.start('index.html', mode='chrome', block=True, shutdown_delay=0, cmdline_args=['--kiosk'])

# webview.create_window(title="hello", url='http://localhost/index.html:8000', frameless=False)
# webview.start()