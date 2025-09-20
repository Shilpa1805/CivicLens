from .. import db

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)  # stores user ID or guest ID
    idea_id = db.Column(db.Integer, db.ForeignKey('idea.id'), nullable=False)
    vote_type = db.Column(db.String(4), nullable=False)  # 'up' or 'down'

    # Ensure one vote per user per idea
    __table_args__ = (db.UniqueConstraint('user_id', 'idea_id', name='unique_user_idea_vote'),)

    idea = db.relationship('Idea', backref=db.backref('votes', lazy='dynamic'))
