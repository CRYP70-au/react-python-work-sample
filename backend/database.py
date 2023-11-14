import sqlite3
from time import time
from config import DATABASE_DIR
from dataclasses import dataclass
from flask_login import UserMixin


# TODO: Create admin field
# TODO: Create Invite codes
@dataclass
class User(UserMixin):
    id: int
    username: str
    password: str
    is_admin: bool
    
    def to_json(self):        
        return {"username": self.username}

    def is_authenticated(self):
        return True

    def is_active(self):   
        return True           

    def is_anonymous(self):
        return False          

    def get_id(self):         
        return str(self.id)
    

@dataclass
class Post:
    id: int
    author: str
    post_timestamp: float # Epoch timestamp
    update_timestamp: int
    title: str
    content: str
    private: bool
    
    def to_json(self):
        return {
            "id": self.id,
            "author": self.author,
            "post_timestamp": self.post_timestamp,
            "update_timestamp": self.update_timestamp,
            "title": self.title,
            "content": self.content,
            "private": self.private
        }


class Database:
    """All database actions for our sample blod database including Create, Read, Update and Delete functions
    """

    def __init__(self, db_name: str) -> None:
        self.con = sqlite3.connect(db_name, check_same_thread=False)
        
        
    def initialize(self) -> None:
        """Initializes tables for sampleblog database
        """
        cur = self.con.cursor()

        sql = "CREATE TABLE Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username, password, is_admin BOOL);" 
        cur.execute(sql)
        
        sql = "CREATE TABLE Posts(id INTEGER PRIMARY KEY AUTOINCREMENT, author, post_timestamp,\
            update_timestamp, title, content, private BOOLEAN)"
        cur.execute(sql)
        
        
    # Utility functions to make my life easier
    def _row_to_post(self, row) -> Post:
        if not row:
            return None
        id = row[0]
        author = row[1]
        post_timestamp = row[2]
        update_timestamp = row[3]
        title = row[4]
        content = row[5]
        private = row[6]
        return Post(id, author, post_timestamp, update_timestamp, title, content, private)
    
    def _row_to_user(self, row) -> User:
        if not row:
            return None
        id = row[0]
        username = row[1]
        password = row[2]
        is_admin = row[3]
        return User(id, username, password, is_admin)
    
    
    # ===== USER ===== 
        
    def get_user_by_id(self, id: int) -> User:
        sql = "SELECT * FROM Users WHERE id=?"
        cur = self.con.cursor()
        cur.execute(sql, (id,))
        rows = cur.fetchone()
        user = self._row_to_user(rows)
        return user


    def get_user_by_username(self, username: str) -> list[User]:
        sql = "SELECT * FROM Users WHERE username=?"
        cur = self.con.cursor()
        cur.execute(sql, (username,))
        rows = cur.fetchall()
        res = []
        for row in rows:
            user = self._row_to_user(row)
            res.append(user)
        return res
    
    
    def get_user_by_username_and_password(self, username: str, password: str) -> list[User]:
        sql = "SELECT * FROM Users WHERE username=? AND password=?"
        cur = self.con.cursor()
        
        cur.execute(sql, (username, password, ))
        rows = cur.fetchall()
        res = []
        for row in rows:
            user = self._row_to_user(row)
            res.append(user)
        return res
    
    
    def create_user(self, username: str, password: str, is_admin: bool = False) -> None:
        sql = "INSERT INTO Users(username, password, is_admin) VALUES(?, ?, ?);"
        cur = self.con.cursor()
        cur.execute(sql, (username, password, is_admin, ))
        self.con.commit()
        
        
    def update_password(self, user_id: int, new_password: str) -> None:
        sql = "UPDATE Users SET password=? WHERE id=?"
        cur = self.con.cursor()
        cur.execute(sql, (new_password, user_id,))
        self.con.commit()
    
    
    
    # ===== Post =====
    
    # If I wanted to create more abstraction, I'd only pass the sql and parameters in a top layer of abstraction
    def get_post_by_id(self, id: int) -> Post:
        sql = "SELECT * FROM Posts WHERE id=?"
        cur = self.con.cursor()
        cur.execute(sql, (id,))
        rows = cur.fetchone()
        post = self._row_to_post(rows)
        return post
    
    
    def get_posts_by_author(self, author: str, private: bool) -> list[Post]:
        sql = "SELECT * FROM Posts WHERE author=? AND private=? ORDER BY post_timestamp DESC"
        cur = self.con.cursor()
        cur.execute(sql, (author, private))
        rows = cur.fetchall()
        res = []
        for row in rows:
            post = self._row_to_post(row)
            res.append(post)
        return res
    
    
    # Searches content with strings that contain
    def get_posts_by_contents(self, content: str, private: bool) -> list[Post]:
        sql = "SELECT * FROM Posts WHERE content LIKE ? AND private=?"
        cur = self.con.cursor()
        cur.execute(sql, (f"%{content}%", private))
        rows = cur.fetchmany()
        res = []
        for row in rows:
            post = self._row_to_post(row)
            res.append(post)
        return res
    
    
    def get_posts_by_title(self, title: str, private: bool) -> list[Post]:
        sql = "SELECT * FROM Posts WHERE title LIKE ? AND private=?"
        cur = self.con.cursor()
        cur.execute(sql, (f"%{title}%", private))
        rows = cur.fetchmany()
        res = []
        for row in rows:
            post = self._row_to_post(row)
            res.append(post)
        return res
    
    
    def get_all_posts_publicly(self) -> list[tuple]:
        sql = "SELECT * FROM Posts WHERE private=? ORDER BY post_timestamp DESC"
        cur = self.con.cursor()
        cur.execute(sql, (False,))
        rows = cur.fetchall()
        res = []
        for row in rows:
            post = self._row_to_post(row)
            res.append(post)
        return res
    
    
    def create_post(self, author: str, title: str, content: str, private: bool) -> Post:
        sql = "INSERT INTO Posts(author, post_timestamp, update_timestamp, title, content, private) VALUES(?, ?, ?, ?, ?, ?)"
        cur = self.con.cursor()
        cur.execute(sql, (author, time(), 0, title, content, private,))
        self.con.commit()
        
        sql = "SELECT * FROM Posts ORDER BY id DESC LIMIT 1;"
        cur.execute(sql)
        res = cur.fetchone()
        return Post(*res)
        
        
    def update_post(self, post_id: int, title: str, content: str, private: bool) -> Post:
        sql = "UPDATE Posts SET update_timestamp=?, title=?, content=?, private=? WHERE id=?"
        cur = self.con.cursor()
        cur.execute(sql, (time(), title, content, private, post_id,))
        self.con.commit()
        
        sql = "SELECT * FROM Posts WHERE id=?"
        cur.execute(sql, (post_id,))
        res = cur.fetchone()
        return Post(*res)
    
    
    def delete_post(self, post_id: int) -> None:
        sql = "DELETE FROM Posts where id=?"
        cur = self.con.cursor()
        cur.execute(sql, (post_id,))
        self.con.commit()    
    

    
if __name__ == '__main__':
    db = Database(DATABASE_DIR)
    db.initialize() # Initialize database
