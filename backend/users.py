from flask import request, jsonify

import time

from backend.post_model import Post


def getPosts():
    posts = []
    with open("posts.txt") as file:
        posts = Post.get_posts_dict(file)

    return jsonify({"message": "Posts loaded successfully", "posts": posts}), 200


def addPost():
    head = request.json.get("head", "")
    body = request.json.get("body", "").replace("\n", "<br>")
    tags = request.json.get("tags", "")
    username = request.json.get("username", "")

    post = Post(username, head, body, tags, str(int(time.time() * 1000)), [])

    if post.is_empty():
        return jsonify({"message": "Posts should have a head, body and at least one tag"}), 400

    with open("posts.txt", "a") as file:
        file.write(str(post) + "~\n")

    return jsonify({"message": "Post added"}), 201


def setLike():
    postID = request.json.get("postID", "")
    username = request.json.get("username", "")
    posts = []
    with open("posts.txt") as file:
        posts = Post.get_posts(file)
        for i, post in enumerate(posts):
            if post.get_time() == postID:
                if username in post.get_likes():
                    post.remove_like(username)
                else:
                    post.add_like(username)
                posts[i] = str(post)

    with open("posts.txt", "w") as file:
        file.write(Post.posts_to_string(posts))

    return jsonify({"message": "Post liked"}), 201


def reportPost():
    postID = request.json.get("time", "")

    with open("reports.txt", "a") as file:
        file.write(postID + "\n")

    return jsonify({"message": "Post reported"}), 201


def deletePost():
    postID = request.json.get("time", "")

    reports = []
    with open("reports.txt") as file:
        reports = [i for i in file.read().split("\n") if i != ""]
        if postID in reports:
            reports.remove(postID)

    with open("reports.txt", "w") as file:
        file.write("\n".join(reports) + "\n")

    posts = []
    with open("posts.txt") as file:
        posts = Post.get_posts(file)
        lenBefore = len(posts)
        for i, post in enumerate(posts):
            if post.get_time() == postID:
                posts.remove(post)
                break
        if len(posts) == lenBefore:
            return jsonify({"message": "Post not found"}), 400

    with open("posts.txt", "w") as file:
        file.write(Post.posts_to_string(posts) + "\n")
        return jsonify({"message": "Post deleted"}), 200


def updatePost():
    postID = request.json.get("time", "")
    head = request.json.get("head", "")
    body = request.json.get("body", "")
    tags = request.json.get("tags", "")

    posts = []
    with open("posts.txt") as file:
        posts = Post.get_posts(file)
        for i, post in enumerate(posts):
            if post.get_time() == postID:
                post.set_head(head)
                post.set_body(body)
                post.set_tags("^".join(tags))
                post.set_time(str(int(time.time() * 1000)))
                posts[i] = str(post)

    with open("posts.txt", "w") as file:
        file.write(Post.posts_to_string(posts))
        return jsonify({"message": "Post updated"}), 200
