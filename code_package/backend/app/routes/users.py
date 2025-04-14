from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Message, Response
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get message statistics for the current user."""
    current_user_id = get_jwt_identity()
    
    # Get message counts by risk level
    safe_count = Message.query.filter_by(user_id=current_user_id, risk_level='safe').count()
    low_risk_count = Message.query.filter_by(user_id=current_user_id, risk_level='low-risk').count()
    high_risk_count = Message.query.filter_by(user_id=current_user_id, risk_level='high-risk').count()
    
    # Get unread message count
    unread_count = Message.query.filter_by(user_id=current_user_id, is_read=False).count()
    
    # Get auto-response count
    auto_response_count = Response.query.filter_by(user_id=current_user_id, is_auto_generated=True).count()
    
    # Get total message count
    total_message_count = Message.query.filter_by(user_id=current_user_id).count()
    
    # Calculate auto-response percentage
    auto_response_percentage = 0
    if total_message_count > 0:
        auto_response_percentage = (auto_response_count / total_message_count) * 100
    
    result = {
        'message_counts': {
            'total': total_message_count,
            'safe': safe_count,
            'low_risk': low_risk_count,
            'high_risk': high_risk_count,
            'unread': unread_count
        },
        'response_stats': {
            'auto_response_count': auto_response_count,
            'auto_response_percentage': auto_response_percentage
        }
    }
    
    return jsonify(result), 200

@users_bp.route('/style-preferences', methods=['GET'])
@jwt_required()
def get_style_preferences():
    """Get style preferences for the current user."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    result = {
        'flirtiness': user.flirtiness,
        'friendliness': user.friendliness,
        'formality': user.formality
    }
    
    return jsonify(result), 200

@users_bp.route('/style-preferences', methods=['PUT'])
@jwt_required()
def update_style_preferences():
    """Update style preferences for the current user."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    if 'flirtiness' in data:
        user.flirtiness = max(0.0, min(1.0, float(data['flirtiness'])))
    
    if 'friendliness' in data:
        user.friendliness = max(0.0, min(1.0, float(data['friendliness'])))
    
    if 'formality' in data:
        user.formality = max(0.0, min(1.0, float(data['formality'])))
    
    db.session.commit()
    
    result = {
        'flirtiness': user.flirtiness,
        'friendliness': user.friendliness,
        'formality': user.formality
    }
    
    return jsonify(result), 200

@users_bp.route('/automation-preferences', methods=['GET'])
@jwt_required()
def get_automation_preferences():
    """Get automation preferences for the current user."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    result = {
        'auto_respond_safe': user.auto_respond_safe,
        'auto_respond_low_risk': user.auto_respond_low_risk,
        'auto_respond_high_risk': user.auto_respond_high_risk
    }
    
    return jsonify(result), 200

@users_bp.route('/automation-preferences', methods=['PUT'])
@jwt_required()
def update_automation_preferences():
    """Update automation preferences for the current user."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    if 'auto_respond_safe' in data:
        user.auto_respond_safe = bool(data['auto_respond_safe'])
    
    if 'auto_respond_low_risk' in data:
        user.auto_respond_low_risk = bool(data['auto_respond_low_risk'])
    
    if 'auto_respond_high_risk' in data:
        user.auto_respond_high_risk = bool(data['auto_respond_high_risk'])
    
    db.session.commit()
    
    result = {
        'auto_respond_safe': user.auto_respond_safe,
        'auto_respond_low_risk': user.auto_respond_low_risk,
        'auto_respond_high_risk': user.auto_respond_high_risk
    }
    
    return jsonify(result), 200
