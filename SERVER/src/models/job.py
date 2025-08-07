from services.db import db


class Job(db.Model):
    __tablename__ = "JOBS"
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    requirements = db.Column(db.Text, nullable=False)
    num_top_resumes = db.Column(db.Integer, nullable=False)
    threshold_percentage = db.Column(db.Integer, nullable=False)
    summary = db.Column(db.Text, nullable=False)
    vector_id = db.Column(db.String(36), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("USERS.ID"), nullable=False)
    user = db.relationship("User", backref="jobs", lazy=True)

    def to_dict(self):
        return {
            "id": self.ID,
            "name": self.name,
            "requirements": self.requirements,
            "num_top_resumes": self.num_top_resumes,
            "threshold_percentage": self.threshold_percentage,
            "summary": self.summary,
            "vector_id": self.vector_id,
            "user": self.user.to_dict(),
        }

    def __repr__(self):
        return f"<Job {self.name}>"