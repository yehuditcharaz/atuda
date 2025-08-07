from flask import Blueprint, request, jsonify
from services.users import (
    create_user,
    get_user,
    user_login,
    update_user,
    delete_user,
    get_all_users,
)

users = Blueprint("users", __name__)


@users.route("/users", methods=["POST"])
def add_user():
    data = request.get_json(force=True)
    user = create_user(data)
    return jsonify(user), 201


@users.route("/users/<int:user_id>", methods=["GET"])
def fetch_user(user_id):
    user = get_user(user_id)
    return jsonify(user)


@users.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_name = data.get("user_name")
    password = data.get("password")
    user = user_login(user_name, password)
    return jsonify(user)


@users.route("/users", methods=["GET"])
def fetch_all_users():
    users = get_all_users()
    return jsonify(users)


@users.route("/users/<int:user_id>", methods=["PUT"])
def modify_user(user_id):
    data = request.get_json(force=True)
    user = update_user(user_id, data)
    return jsonify(user)


@users.route("/users/<int:user_id>", methods=["DELETE"])
def remove_user(user_id):
    user = delete_user(user_id)
    return jsonify(user), 204