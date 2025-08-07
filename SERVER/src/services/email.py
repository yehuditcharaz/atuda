from flask_mail import Message


def send_email(mail, subject, recipient, body):
    msg = Message(subject=subject, recipients=[recipient])
    msg.body = body

    try:
        mail.send(msg)
        return "Email sent successfully!"
    except Exception as e:
        return f"Failed to send email: {e}"