from flask import request, jsonify

from backend.user_model import User


def registerUser():
    username = request.json.get("username", "")
    email = request.json.get("email", "")
    password = request.json.get("password", "")

    newUser = User(username, email, password)

    if newUser.isEmpty():
        return jsonify({"message": "Username, Email and password can not be empty"}), 400

    elif newUser.get_password_length() < 8:
        return jsonify({"message": "The password should be at least 8 characters"}), 400

    if not newUser.isValidUsername():
        return jsonify({"message": "The user can only contain alphanumeric values, _ ."}), 400

    if not newUser.isValidEmail():
        return jsonify({"message": "Please enter a valid email"}), 400

    with open("login.txt") as file:
        users = User.get_users(file)
        for user in users:
            if user.get_email() == newUser.get_email():
                return jsonify({"message": "User already exists"}), 409
            elif user.get_username() == newUser.get_username():
                return jsonify({"message": "Username is taken"}), 409

    with open("login.txt", "a") as file:
        file.write(str(newUser) + "\n")

    return jsonify({"message": "Sign in successful"}), 201


def loginUser():
    email = request.json.get("email", "")
    password = request.json.get("password", "")

    newUser = User(email, email, password)

    if newUser.isEmpty():
        return jsonify({"message": "Email and password can not be empty"}), 400

    with open("login.txt") as file:
        users = User.get_users(file)
        for user in users:
            if newUser == user:
                return jsonify({"message": "Sign in successful", "username": user.get_username()}), 200
    return jsonify({"message": "Incorrect credentials"}), 401
