from flask import Flask
from flask_mail import Mail
from config import Config, EmailConfig
from services.db import db
from services.ai_services.qdrant import create_collections
from services.s3.s3_actions import create_bucket

from flask_cors import CORS

from routes.users import users
from routes.jobs import jobs
from routes.resumes import resumes
from routes.upload import uploads
from routes.email import create_email_route


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(users)
    app.register_blueprint(jobs)
    app.register_blueprint(resumes)
    app.register_blueprint(uploads)
    # app.register_blueprint(ai)

    app.config.from_object(EmailConfig)
    mail = Mail(app)
    app.register_blueprint(create_email_route(mail))
    
    create_collections()
    create_bucket("resumes")

    
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8080, debug=True)

