from flask import request, jsonify

from backend.post_model import Post


def isAdmin():
    username = request.json.get("username", "").strip().lower()

    if username == "":
        return jsonify({"message": "The username can not be empty"}), 400

    if username == "admin":
        return jsonify({"message": "The user is the admin"}), 200
    else:
        return jsonify({"message": "The user is not the admin"}), 400


def getUserPosts():
    with open("posts.txt") as file:
        posts = Post.get_posts(file)
        for post in posts:
            posts.append(post)

        userPosts = {}
        for post in posts:
            username = post.get_username()
            if username not in userPosts:
                userPosts[username] = [post.to_json()]
            else:
                userPosts[username].append(post.to_json())

    return jsonify({"message": "Posts loaded successfully", "posts": userPosts}), 200


def getReports():
    reports = []
    with open("reports.txt") as file:
        reports = [i for i in file.read().split("\n") if i.strip() != ""]

    posts = []
    with open("posts.txt") as file:
        posts = Post.get_posts(file)
        for post in posts:
            if post.get_time() in reports:
                posts.append(post.to_json())

    return jsonify({"message": "Posts loaded successfully", "posts": posts}), 200
