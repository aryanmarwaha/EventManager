import pandas as pd, jwt, os, qrcode
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

JWT_SECRET_KEY = "ksjkasjcskfbdsfhdshklfP22EC2x380lZ1"
# Email configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
MAIL_USERNAME = 'aryanid4softtestin@gmail.com'
MAIL_PASSWORD = 'hkmg mntw yaqu jaev' 
from_address = 'aryanid4softtestin@gmail.com'

class Methods():
    def __init__(self) -> None:
        self.parentFolder = "./CSV_FILES/"

    def importRegistrationLinksFromCSV(self, filename):
        df = pd.read_csv(self.parentFolder + filename, usecols=['name', 'email', 'phone'])
        data_dict = df.to_dict(orient='index')
        return data_dict

    
    def decodeJWT(self, token):
        try:
            decoded_token = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            return decoded_token
        except Exception as err:
            print(err)
            raise Exception("Integrity Error")
        
    def generateQRCode_and_MailItToParticipant(self, participant, eventID):
        # Generating QR-Codes
        payload = {
            'user_id': participant["pid"],
            'eventID': eventID
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(token)
        qr.make(fit=True)
        # Create an image from the QR code
        img = qr.make_image(fill='black', back_color='white')
        filename = "./__qrcache__/" + str(participant["pid"]) + "-" + str(eventID)
        img.save(filename)

        # Sending Mail
        body = """
        <head>
        </head>
        <body>
            <h2>Hi</h2>
            <h4>Your ticket has been attached to this mail.</h4>
        </body>
        """
        msg = MIMEMultipart()
        msg['From'] = MAIL_USERNAME
        msg['To'] = participant["email"]
        msg['Subject'] = 'Ticket'
        msg.attach(MIMEText(body, 'html'))

        with open(filename, 'rb') as img_file:
            img = MIMEImage(img_file.read())
            img.add_header('Content-Disposition', f'attachment; filename="{filename}"')
            msg.attach(img)

        attempt = 0
        while(attempt<4):
            try:
                with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                    server.starttls()
                    server.login(MAIL_USERNAME, MAIL_PASSWORD)
                    server.send_message(msg)
                print(f'Email sent to {participant["email"]} successfully!')
                os.remove(filename)
                return
            except Exception as e:
                attempt+=1
        print(f'Error sending email to {participant["email"]}: {e}')
    
    def extractResultListAsCSV(self, eventName, participants):
        df = pd.DataFrame(participants)
        filename = eventName+".csv"
        filename = filename.replace('/','_')
        filename = filename.replace('\\','_')

        df.to_csv(self.parentFolder + filename, index=False)
        print("extracted data sucessfully.")
        
    def extractEventDetailsToTextFile(self, event):
        df = pd.DataFrame(event)
        filename = event[0]["eventName"]+" (event-details).csv"
        filename = filename.replace('/','_')
        filename = filename.replace('\\','_')

        df.to_csv(self.parentFolder + filename, index=False)
        print("extracted data sucessfully.")
        

utils = Methods()