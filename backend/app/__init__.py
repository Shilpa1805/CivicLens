from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # SQLite config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Enable CORS
    CORS(app)

    db.init_app(app)

    # Import blueprints
    from .routes.auth_routes import bp as auth_bp
    from .routes.janta_routes import bp as janta_bp

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(janta_bp)

    # Create tables
    with app.app_context():
        db.create_all()

    return app
