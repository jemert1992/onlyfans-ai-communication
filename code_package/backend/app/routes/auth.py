from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
from app import db, bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    if not data or 'email' not in data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create new user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user = User(
        email=data['email'],
        username=data['username'],
        password_hash=hashed_password,
        display_name=data.get('display_name', data['username'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'display_name': user.display_name
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user."""
    data = request.get_json()
    
    if not data or ('email' not in data and 'username' not in data) or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find user by email or username
    if 'email' in data:
        user = User.query.filter_by(email=data['email']).first()
    else:
        user = User.query.filter_by(username=data['username']).first()
    
    if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Update last login
    user.last_login = db.func.now()
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'display_name': user.display_name
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'display_name': user.display_name,
        'profile_image': user.profile_image,
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat() if user.last_login else None,
        'style_preferences': {
            'flirtiness': user.flirtiness,
            'friendliness': user.friendliness,
            'formality': user.formality
        },
        'automation_preferences': {
            'auto_respond_safe': user.auto_respond_safe,
            'auto_respond_low_risk': user.auto_respond_low_risk,
            'auto_respond_high_risk': user.auto_respond_high_risk
        }
    }), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """Update current user information."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    # Update basic profile information
    if 'display_name' in data:
        user.display_name = data['display_name']
    
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    
    # Update style preferences
    if 'style_preferences' in data:
        style_prefs = data['style_preferences']
        if 'flirtiness' in style_prefs:
            user.flirtiness = max(0.0, min(1.0, float(style_prefs['flirtiness'])))
        
        if 'friendliness' in style_prefs:
            user.friendliness = max(0.0, min(1.0, float(style_prefs['friendliness'])))
        
        if 'formality' in style_prefs:
            user.formality = max(0.0, min(1.0, float(style_prefs['formality'])))
    
    # Update automation preferences
    if 'automation_preferences' in data:
        auto_prefs = data['automation_preferences']
        if 'auto_respond_safe' in auto_prefs:
            user.auto_respond_safe = bool(auto_prefs['auto_respond_safe'])
        
        if 'auto_respond_low_risk' in auto_prefs:
            user.auto_respond_low_risk = bool(auto_prefs['auto_respond_low_risk'])
        
        if 'auto_respond_high_risk' in auto_prefs:
            user.auto_respond_high_risk = bool(auto_prefs['auto_respond_high_risk'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': user.id,
            'display_name': user.display_name,
            'profile_image': user.profile_image,
            'style_preferences': {
                'flirtiness': user.flirtiness,
                'friendliness': user.friendliness,
                'formality': user.formality
            },
            'automation_preferences': {
                'auto_respond_safe': user.auto_respond_safe,
                'auto_respond_low_risk': user.auto_respond_low_risk,
                'auto_respond_high_risk': user.auto_respond_high_risk
            }
        }
    }), 200

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    if not data or 'current_password' not in data or 'new_password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify current password
    if not bcrypt.check_password_hash(user.password_hash, data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Update password
    hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
    user.password_hash = hashed_password
    
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
