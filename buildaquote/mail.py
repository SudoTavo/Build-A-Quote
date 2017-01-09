import os
import sys
# Import smtplib for the actual sending function
import smtplib

# For guessing MIME type
import mimetypes

# Import the email modules we'll need
import email
import email.mime.application

try:
    import configparser
except:
    from six.moves import configparser

os.chdir(sys.path[0])

if(len(sys.argv)<=1):
    print ("Error: Not enough arguments: <Email> <Quote Num>");
    sys.exit(0)

destination = sys.argv[1];
quoteNum = sys.argv[2];

config = configparser.ConfigParser()
config.read('config.ini')

gmail_user = config.get('email','emailuser');
gmail_password = config.get('email','emailpassword');

msg = email.mime.Multipart.MIMEMultipart()

subject = config.get('email','emailsubject') + quoteNum
msg['Subject'] = subject 
msg['From'] = config.get('email','emailuser');
msg['To'] = destination

bodyFile = open('emailBody.txt', 'r')

bodyText = bodyFile.read()

# The main body is just another attachment
body = email.mime.Text.MIMEText(bodyText)
msg.attach(body)
bodyFile.close()
# PDF attachment
filename='quote.pdf'
filepath='temp/' + quoteNum + '/quote.pdf'
fp=open(filepath,'rb')
att = email.mime.application.MIMEApplication(fp.read(),_subtype="pdf")
fp.close()
att.add_header('Content-Disposition','attachment',filename=filename)
msg.attach(att)

try:  
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.ehlo()
    server.login(gmail_user, gmail_password)
    server.sendmail(gmail_user, destination, msg.as_string())
    server.close()
    print 'Email sent!'
except:  
    print 'Something went wrong... Email not sent'
sys.exit(1)
