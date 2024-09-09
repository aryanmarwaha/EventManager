import jwt, base64, qrcode, io
from PIL import Image

secretKey = "ksjkasjcskfbdsfhdshklfP22EC2x380lZ1"

payload = {
    'user_id': 123,
    'eventID': 231
}
token = jwt.encode(payload, secretKey, algorithm='HS256')

qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data(token)
qr.make(fit=True)

# Create an image from the QR code
img = qr.make_image(fill='black', back_color='white')

buffer = io.BytesIO()
img.save(buffer, format="PNG")
img_bytes = buffer.getvalue()

base64_encoded_image = base64.b64encode(img_bytes).decode('utf-8')
imgString = "data:image/png;base64, " + base64_encoded_image