from flask import Blueprint, request, jsonify
from ..models.janta_models import Idea
from ..models.vote import Vote
from .. import db

bp = Blueprint('janta', __name__)

@bp.route('/api/ideas', methods=['POST'])
def add_idea():
    data = request.get_json()
    text = data.get('text')
    if not text or text.strip() == "":
        return jsonify({'error': 'Text is required'}), 400
    idea = Idea(text=text.strip())
    db.session.add(idea)
    db.session.commit()
    return jsonify({
        'id': idea.id,
        'text': idea.text,
        'up': idea.upvotes,
        'down': idea.downvotes
    }), 201

@bp.route('/api/ideas', methods=['GET'])
def get_ideas():
    user_id = request.args.get('user_id')  # Optional user_id parameter
    ideas = Idea.query.all()
    result = []
    for idea in ideas:
        idea_data = {
            'id': idea.id,
            'text': idea.text,
            'up': idea.upvotes,
            'down': idea.downvotes
        }
        
        # If user_id provided, include their vote status
        if user_id:
            user_vote = Vote.query.filter_by(user_id=str(user_id), idea_id=idea.id).first()
            idea_data['user_vote'] = user_vote.vote_type if user_vote else None
        
        result.append(idea_data)
    return jsonify(result)

@bp.route('/api/ideas/<int:idea_id>/vote', methods=['POST'])
def vote_idea(idea_id):
    data = request.get_json()
    action = data.get('action')
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    if action not in ['up', 'down']:
        return jsonify({'error': 'Invalid vote action'}), 400
    
    idea = Idea.query.get_or_404(idea_id)
    
    # Check if user has already voted on this idea
    existing_vote = Vote.query.filter_by(user_id=str(user_id), idea_id=idea_id).first()
    
    if existing_vote:
        # If trying to vote the same way, return error
        if existing_vote.vote_type == action:
            return jsonify({'error': 'You have already voted on this idea'}), 409
        
        # If changing vote, update the vote and adjust counters
        old_vote_type = existing_vote.vote_type
        existing_vote.vote_type = action
        
        # Adjust counters: remove old vote, add new vote
        if old_vote_type == 'up':
            idea.upvotes -= 1
        else:
            idea.downvotes -= 1
            
        if action == 'up':
            idea.upvotes += 1
        else:
            idea.downvotes += 1
    else:
        # Create new vote
        new_vote = Vote(user_id=str(user_id), idea_id=idea_id, vote_type=action)
        db.session.add(new_vote)
        
        # Increment appropriate counter
        if action == 'up':
            idea.upvotes += 1
        else:
            idea.downvotes += 1
    
    db.session.commit()
    
    # Get user's current vote status for this idea
    user_vote = Vote.query.filter_by(user_id=str(user_id), idea_id=idea_id).first()
    user_vote_type = user_vote.vote_type if user_vote else None
    
    return jsonify({
        'id': idea.id, 
        'up': idea.upvotes, 
        'down': idea.downvotes,
        'user_vote': user_vote_type
    })

@bp.route('/api/ideas/top', methods=['GET'])
def get_top_ideas():
    ideas = Idea.query.all()
    sorted_ideas = sorted(ideas, key=lambda x: (x.upvotes - x.downvotes), reverse=True)
    top_three = sorted_ideas[:3]
    result = [{'id': idea.id, 'text': idea.text, 'up': idea.upvotes, 'down': idea.downvotes} for idea in top_three]
    return jsonify(result)
