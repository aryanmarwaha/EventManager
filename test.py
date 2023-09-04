import pyqrcode
import png
import json

data = {"Ticket-no": "2345678", "name": "aryan", "meta": {}}
data = json.dumps(data)

qrcode = pyqrcode.create(data)

qrcode.png("qr-code.png", scale=8)