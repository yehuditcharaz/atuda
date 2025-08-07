from services.db import db


class User(db.Model):
    __tablename__ = "USERS"
    ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.ID,
            "name": self.name,
            "email": self.email,
            "role": self.role,
        }

    def __repr__(self):
        return f"<User {self.name}>"