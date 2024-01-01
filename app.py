import eel, eel.browsers, io, cv2
import pyqrcode, base64
from pyzbar.pyzbar import decode
import numpy as np
import winsound
import webview
import time
import json, rsa
import threading


public_key = rsa.PublicKey(6791411563309788692375731531390914535781035359523789213798071484996582439897712163526989636434352260105784013157625495637229271893289766016493804846999373, 65537)
private_key = rsa.PrivateKey(6791411563309788692375731531390914535781035359523789213798071484996582439897712163526989636434352260105784013157625495637229271893289766016493804846999373, 65537, 5333895905926140097562653972317212459919151807763682780911764888166136548673465066224308477099443744693448425627627139495864423074768916425833022136890881, 6916423694151714441373130286877935660419676795842744498475420115355888011678068409, 981925322049366115752433962965688056315691124539816913720136824180249397)


eel.init('web', allowed_extensions=['.js', '.html'])

	# @eel.expose
	# def scan_qr():
	# 	is_beepu = True
	# 	def beepu():
	# 		global is_beepu
	# 		frequency = 2500
	# 		duration = 500
	# 		winsound.Beep(frequency,duration)
	# 		is_beepu = True

	# 	s_time_in_sec = time.time()
	# 	n=0
	# 	cam = cv2.VideoCapture(0)
	# 	scanning_ = True;
	# 	while scanning_:
	# 		_,frame = cam.read()
	# 		for barcode in decode(frame):
	# 			pts = np.array([barcode.polygon], np.int32)
	# 			pts = pts.reshape((-1,1,2))
	# 			cv2.polylines(frame,[pts],True,(255,0,255),5)
				
	# 			# winsound.Beep(frequency,duration)
	# 			if is_beepu == True:
	# 				is_beepu = False
	# 				p = multiprocessing.Process(target=beepu)
	# 				p.start()

	# 			data = json.loads(barcode.data.decode('utf-8'))

	# 			data["key"] = base64.b64decode(data["key"].encode('utf-8'))
	# 			data["key"] = rsa.decrypt(data["key"],private_key).decode()
	# 			print(data)

	# 		frame = cv2.flip(frame,1)
	# 		_, buffer = cv2.imencode('.png', frame)
	# 		frame_bytes = base64.b64encode(buffer.tobytes()).decode('utf-8')
	# 		base64_string = "data:image/png;base64, " + frame_bytes
	# 		scanning_ = bool(eel.SetImage(base64_string)())
	# 		# Debug:
	# 		n+=1;
	# 		if time.time() - s_time_in_sec > 1:
	# 			print("Frame-rate: ~",n)
	# 			s_time_in_sec = time.time()
	# 			n=0

	# 		# eel.sleep(1)
	# 	eel.stopped_scan()
	# 	cv2.destroyAllWindows()
	# 	cam.release()

@eel.expose
def scan_qr():
	user_data = {"img-src": "./Static/user_img_success.svg",
				"name": "Aryan",
				"role": "Student",
				"ticket": "34567776",
				"email": "asdfghgfgh@gmail.com",
				"phone": "12345-12345"}

	s_time_in_sec = time.time()
	n=0
	cam = cv2.VideoCapture(0)
	scanning_ = True;
	while scanning_:
		_,frame = cam.read()
		for barcode in decode(frame):
			# winsound.Beep(frequency,duration)
			data = barcode.data.decode('utf-8')

			high_color = (255,0,255) # barcode -- highlighing-color
			try:
				data = json.loads(barcode.data.decode('utf-8'))
				data["key"] = base64.b64decode(data["key"].encode('utf-8'))
				data["key"] = rsa.decrypt(data["key"],private_key).decode()
				print(data)
				# user_data["ticket"] = data["ticket"]
				# user_data = json.dumps(user_data)
				eel.render_userdata(user_data)

				# barcode -- highlighing
				pts = np.array([barcode.polygon], np.int32)
				pts = pts.reshape((-1,1,2))
				cv2.polylines(frame,[pts],True,high_color,5)

			except Exception as e:
				print(e)
				high_color = (51,51,51) # 51 51 51
				pts = np.array([barcode.polygon], np.int32)
				pts = pts.reshape((-1,1,2))
				cv2.fillPoly(frame,[pts],high_color)

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

eel.start('index.html', mode='chrome', shutdown_delay=0, cmdline_args=['--kiosk'])



# def start_app():
#     eel_thread = threading.Thread(target=eel_start) # Eel app start.
#     eel_thread.setDaemon(True)
#     eel_thread.start() # Run eel in a seperate thread.

#     webview_start() # Start pywebview web browser.

# def eel_start():
#     # EEL app start.
#     eel.start("web/index.html", port=8000, mode=None, shutdown_delay=0)

# def webview_start():
#     # pywebview start.
#     webview.create_window("Overseer", "http://localhost:8000/index.html", fullscreen=True)
#     webview.start()

# start_app() # Run app.
# server1 = threading.Thread(target=start_eel, args=[eel])
# server1.setDaemon(True)
# server1.start()

# webview.create_window(title="hello", url='http://localhost/index.html:8000', frameless=False)
# webview.start()