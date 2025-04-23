from flask import Flask
from flask_cors import CORS, cross_origin

from . import auth
from . import admin
from . import users

app = Flask(__name__)


def main():
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/register', methods=['POST'])
    def registerUser():
        return auth.registerUser()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/login', methods=['POST'])
    def loginUser():
        return auth.loginUser()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/is_admin', methods=['POST'])
    def isAdmin():
        return admin.isAdmin()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/get_posts', methods=['GET'])
    def getPosts():
        return users.getPosts()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/get_user_posts', methods=['GET'])
    def getUserPosts():
        return admin.getUserPosts()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/get_reports', methods=['GET'])
    def getReports():
        return admin.getReports()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/add_post', methods=['POST'])
    def addPost():
        return users.addPost()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/set_like', methods=['POST'])
    def setLike():
        return users.setLike()

    @cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
    @app.route('/report', methods=['POST'])
    def reportPost():
        return users.reportPost()

    @cross_origin(origin="http://localhost:3000", headers=["Content-Type"])
    @app.route("/delete_post", methods=['POST'])
    def deletePost():
        return users.deletePost()

    @cross_origin(origin="http://localhost:3000", headers=["Content-Type"])
    @app.route("/update_post", methods=['POST'])
    def updatePost():
        return users.updatePost()

    app.run()


main()