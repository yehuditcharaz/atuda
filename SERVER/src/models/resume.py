from services.db import db


class Resume(db.Model):
    __tablename__ = "RESUME"
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    upload_date = db.Column(db.Date, nullable=False)
    url = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text, nullable=False)
    vector_id = db.Column(db.String(36), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("USERS.ID"), nullable=False)
    user = db.relationship("User", backref="resume", lazy=True)

    def to_dict(self):
        return {
            "id": self.ID,
            "name": self.name,
            "upload_date": self.upload_date,
            "summary": self.summary,
            "url": self.url,
            "vector_id": self.vector_id,
            "user": self.user.to_dict(),
        }

    def __repr__(self):
        return f"<Resume {self.name}>"