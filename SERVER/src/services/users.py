from models.user import User
from .db import db


def create_user(data):
    existing_user = User.query.filter_by(name=data["name"]).first()
    if existing_user:
        return {"error": "User already exists"}, 400

    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return user.to_dict(), 201


def get_user(user_id):
    user = User.query.get(user_id)
    return user.to_dict()


def user_login(user_name, password):
    user = User.query.filter_by(name=user_name).first()
    if not user:
        return {"error": "User does not exists"}, 400
    if user.password != password:
        return {"error": "Incorrect password"}, 401
    return user.to_dict(), 200


def get_all_users():
    users = User.query.all()
    return [user.to_dict() for user in users]


def update_user(user_id, data):
    user = User.query.get(user_id)
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return user.to_dict()


def delete_user(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return user.to_dict()