import json, rsa, base64
import pyqrcode, png

public_key = rsa.PublicKey(6791411563309788692375731531390914535781035359523789213798071484996582439897712163526989636434352260105784013157625495637229271893289766016493804846999373, 65537)

# data = {"ticket":"2345678","key": "1234567890"}
data= "this is nagpal."
# data["key"] = rsa.encrypt(data["key"].encode(),public_key)
# data["key"] = base64.b64encode(data["key"]).decode('utf-8')

# data = json.dumps(data)

qrcode = pyqrcode.create(data)
qrcode.png("qr-code.png", scale=8)

# data["key"] = base64.b64decode(data["key"].encode('utf-8'))