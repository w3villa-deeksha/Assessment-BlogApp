import re
import hashlib


class User:
    def __init__(self, username, email, password):
        self.__username = username.lower().strip()
        self.__email = email.lower().strip()
        self.__password = password

    def get_username(self):
        return self.__username

    def encrypt_password(self, password) -> str:
        enc = hashlib.sha256()
        text = password
        salt = "my-blog-app"
        enc.update((text + salt).encode("utf-8"))
        return enc.hexdigest()

    def get_email(self):
        return self.__email

    def get_password_length(self):
        return len(self.__password)

    def isEmpty(self):
        return self.__username == "" or self.__email == "" or self.__password == ""

    def isValidUsername(self):
        usernameRegex = "^[a-zA-Z0-9._]+$"
        return re.match(usernameRegex, self.__username)

    def isValidEmail(self):
        emailRegex = r"^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return re.match(emailRegex, self.__email)

    @classmethod
    def from_string(cls, string):
        email, password, username = string.split(" ")
        return cls(username, email, password)

    @classmethod
    def get_users(cls, file):
        return [User.from_string(i) for i in file.read().split("\n") if i.strip() != ""]

    def __str__(self):
        return self.__email + " " + self.encrypt_password(self.__password) + " " + self.__username

    def __eq__(self, other):
        return ((self.__email == other.__email and self.encrypt_password(self.__password) == other.__password) or
                (self.__username == other.__username and self.encrypt_password(self.__password) == other.__password))
