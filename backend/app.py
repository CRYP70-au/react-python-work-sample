from database import Database, User
from config import DATABASE_DIR
from flask import Flask, request, jsonify, session
from flask_login import LoginManager, login_user, logout_user, current_user
from flask_bcrypt import generate_password_hash, check_password_hash

app = Flask(__name__)
db = Database(DATABASE_DIR)
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id) -> User:
    user = db.get_user_by_id(user_id)
    if not user:
        return None
    return user


# TODO: Check an invite code to allow prospective employers to create an account 
@app.route("/api/create_user", methods=["POST"])
def create_user():
    username = request.json["username"]
    password = request.json["password"]
    confirmed_password = request.json["confirm_password"]
    
    if password != confirmed_password:
        return jsonify({"message": "Confirmed password must match!"}), 401
    
    user_exists = db.get_user_by_username(username)
    if user_exists:
        return jsonify({"message": "Username already exists!"}), 401
    
    # Create user
    password_hash = generate_password_hash(password)
    db.create_user(username, password_hash)
    
    return jsonify({
        "message": "User successfully created!"
    }), 200
 
   
@app.route("/api/update_password", methods=["POST"])
def update_password():
    uid = int(session.get('_user_id'))
    if not uid:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    
    old_password = request.json["old_password"]
    new_password = request.json["password"]
    confirmed_password = request.json["confirmed_password"]
    
    if new_password != confirmed_password:
        return jsonify({"message": "Confirmed password must match!"}), 401
    
    user = db.get_user_by_id(int(uid))
    old_pass_hash = user.password
    print(old_pass_hash)
    if not check_password_hash(old_pass_hash, old_password):
        return jsonify({
            "message": "Old password is incorrect!"
        }), 401
    
    password_hash = generate_password_hash(new_password)
    db.update_password(uid, password_hash)
    
    return jsonify({
        "message": "Password successfully updated!"
    }), 200
    
    
   
    


@app.route("/api/login", methods=["GET", "POST"])
def login():
    
    if request.method == "POST":
        username = request.json.get('username')
        password = request.json.get('password')
        
        user_query = db.get_user_by_username(username)
        if not user_query:
            return jsonify({
                "message": "Incorrect username or password!"
            }), 401
            
        
        user = user_query[0]
        username = user.username
        pw_hash = user.password
        if not check_password_hash(pw_hash, password):
            return jsonify({
                "message": "Incorrect username or password!"
            }), 401
        
        login_user(user)
        return jsonify({"message": "Login success!"}), 200
    
    return 200
    
    

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Sucessful logout!"}), 200


@app.route("/api/check_auth", methods=["GET"])
def check_auth(): # For the front end to check user auth status
    uid = session.get('_user_id')
    if uid:
        user = db.get_user_by_id(int(uid)) 
        return jsonify({
            "message": "User logged in",
            "data": user.to_json()    
        }), 200
    else:
        return jsonify({
            "message": "User unauthenticated",
        }), 401



# Get all posts
@app.route("/api/posts", methods=["GET"])
def get_posts():
    query = db.get_all_posts_publicly()
    res = [row.to_json() for row in query]
    return jsonify(res), 200
    

@app.route("/api/user_posts", methods=["GET"])
def get_user_posts():
    uid = session.get('_user_id')
    if not uid:
        return jsonify({
            "message": "Unauthorized"
        }), 401
        
    user = db.get_user_by_id(int(uid))
    j_user = user.to_json()
    query_private = db.get_posts_by_author(j_user.get('username'), True)  
    query_public = db.get_posts_by_author(j_user.get('username'), False)  
    
    private = [row.to_json() for row in query_private]
    public = [row.to_json() for row in query_public]
    res = private + public
    return jsonify(res), 200
    


# Create post
@app.route("/api/create_post", methods=["POST"])
def create_post():
    
    uid = session.get('_user_id')
    if not uid:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    user = db.get_user_by_id(int(uid))
    j_user = user.to_json()
    
    author = j_user.get('username')
    title = request.json.get('title')
    content = request.json.get('content')
    private = request.json.get('private')
    i_private = None
    if private:
        i_private = 1
    else:
        i_private = 0
    
    res = db.create_post(author, title, content, i_private)
    j_post = res.to_json()
    return jsonify({
        "message": "Post Created!",
        "data": j_post
    }), 200


# Update post
@app.route("/api/update_post", methods=["POST"])
def update_post():
    post_id = request.json.get('post_id')
    title = request.json.get('title')
    content = request.json.get('content')
    private = request.json.get('private')

    uid = session.get('_user_id')
    if not uid:
        return jsonify({
            "message": "Unauthorized"
        }), 401
            
    user = db.get_user_by_id(int(uid)).to_json()
    username = user.get('username')
    
    post = db.get_post_by_id(post_id).to_json()
    author = post.get('author')
    
    if not current_user.is_authenticated or author != username:
        return jsonify({
            "message": "Unauthorized"
        }), 401
        
    i_private = None
    if private:
        i_private = 1
    else:
        i_private = 0
    
    res = db.update_post(post_id, title, content, i_private)
    j_post = res.to_json()
    
    return jsonify({
        "message": "Post Updated!",
        "data": j_post
    }), 200


# delete post
@app.route("/api/delete_post", methods=["POST"])
def delete_post():
    
    uid = session.get('_user_id')
    if not uid:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    
    user = db.get_user_by_id(int(uid)).to_json()
    username = user.get('username')
    
    post_id = request.json.get('post_id')
    post = db.get_post_by_id(post_id).to_json()
    author = post.get('author')
    
    if not current_user.is_authenticated or author != username:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    
    db.delete_post(post_id)
    return jsonify({
        "message": "Post Deleted!",
        "data": post_id
    }), 200



if __name__ == '__main__':
    app.secret_key = "Something super secret" # TODO: Add to environment variables or config file
    app.run(debug=True, host="0.0.0.0", port=5001)