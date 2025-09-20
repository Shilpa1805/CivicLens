from flask import Blueprint, request, jsonify
from ..models.user import User
from .. import db

bp = Blueprint('auth', __name__)

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered', 'user_id': user.id, 'email': user.email})

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    return jsonify({'message': 'Login successful', 'user_id': user.id, 'email': user.email})

@bp.route('/api/emails', methods=['GET'])
def get_emails():
    users = User.query.all()
    emails = [user.email for user in users]
    return jsonify(emails)

