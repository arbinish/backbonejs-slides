#!/usr/bin/env python

from flask import Flask, jsonify, request
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='static', static_url_path='')
app.add_url_rule('/', view_func=lambda: app.send_static_file('index.html'))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.sqlite3"
db = SQLAlchemy(app)


class User(db.Model):
     __tablename__ = 'users'
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String)
     department = db.Column(db.String)

     def toDict(self):
         return dict(id=self.id, name=self.name, department=self.department)


@app.route("/api/users")
def get_users():
     resp = []
     for user in User.query:
         resp.append(user.toDict())
     return jsonify(objects=resp)


@app.route("/api/user", methods=["POST"])
def create_user():
    if not request.json:
        return jsonify(message="no data received"), 400

    name = request.json.get('name')
    dept = request.json.get('department')
    if not all([name, dept]):
        return jsonify(message="incorrect post data"), 400
    user = User(name=name, department=dept)
    db.session.add(user)
    try:
        db.session.commit()
    except Exception as e:
        app.logger.error("create_user: {0}".format(e))
        return jsonify(message="failed"), 400
    return jsonify(id=user.id), 201


@app.route("/api/user/<int:user_id>")
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.toDict());

@app.route("/api/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    user.name = request.json.get("name")
    user.department = request.json.get("department")
    try:
        db.session.commit()
    except Exception as e:
        return jsonify(message="update failed"), 500
    return jsonify(message="updated"), 200


@app.route("/api/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        user.delete()
        db.session.commit()
    except Exception as e:
        return jsonify(message="delete failed"), 500
    return jsonify(message="deleted"), 200


if __name__ == '__main__':
    app.run(debug=True)

