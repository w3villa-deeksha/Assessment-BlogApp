class Post:

    def __init__(self, username, head, body, tags, time, likes):
        self.__username = username.lower().strip()
        self.__head = head
        self.__body = body
        self.__tags = tags
        self.__time = time
        self.__likes = likes

    def get_username(self):
        return self.__username

    def get_time(self):
        return self.__time

    def get_likes(self):
        return self.__likes

    def set_body(self, body):
        self.__body = body

    def set_head(self, head):
        self.__head = head

    def set_tags(self, tags):
        self.__tags = tags

    def set_time(self, time):
        self.__time = time

    def add_like(self, like):
        self.__likes.append(like)

    def remove_like(self, like):
        self.__likes.remove(like)

    @classmethod
    def from_string(cls, post):
        values = post.split("~")
        __username = values[0]
        head = values[1]
        body = values[2]
        tags = [i for i in values[3].split("^")]
        time = values[4]
        likes = [i for i in values[5].split("/") if i != ""]
        return cls(__username, head, body, tags, time, likes)

    @classmethod
    def get_posts(cls, file):
        return [Post.from_string(i) for i in file.read().split("\n") if i != ""]

    @classmethod
    def get_posts_dict(cls, file) -> list[dict]:
        return [Post.from_string(i).to_json() for i in file.read().split("\n") if i != ""]

    @classmethod
    def posts_to_string(cls, posts):
        return "\n".join([str(i) for i in posts])

    def to_json(self) -> dict:
        return {
            "username": self.__username,
            "head": self.__head,
            "tags": self.__tags,
            "body": self.__body,
            "time": self.__time,
            "likes": self.__likes,
        }

    def is_empty(self) -> bool: return self.__head == "" or self.__body == "" or self.__tags == [] or self.__username == ""

    def __str__(self):
        return "~".join([self.__username, self.__head, self.__body, "^".join(self.__tags), self.__time, "/".join(self.__likes)])
