from flask import Blueprint, request, jsonify
from flask_mail import Mail

from services.email import send_email

emails = Blueprint("emails", __name__)


def create_email_route(mail: Mail):
    @emails.route("/send_email", methods=["POST"])
    def fetch_send_email():
        data = request.json
        subject = data.get("subject")
        recipient = data.get("recipient")
        body = data.get("body")
        result = send_email(mail, subject, recipient, body)

        return jsonify({"message": result})

    return emails