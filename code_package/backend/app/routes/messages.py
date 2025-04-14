from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Message
from app import db
from app.services.message_filter import MessageFilter
from app.services.response_generator import ResponseGenerator

messages_bp = Blueprint('messages', __name__)
message_filter = MessageFilter()
response_generator = ResponseGenerator()

@messages_bp.route('/', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all messages for the current user."""
    current_user_id = get_jwt_identity()
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    risk_level = request.args.get('risk_level', None)
    is_read = request.args.get('is_read', None)
    
    # Build query
    query = Message.query.filter_by(user_id=current_user_id)
    
    # Apply filters
    if risk_level:
        query = query.filter_by(risk_level=risk_level)
    
    if is_read is not None:
        is_read_bool = is_read.lower() == 'true'
        query = query.filter_by(is_read=is_read_bool)
    
    # Order by creation date (newest first)
    query = query.order_by(Message.created_at.desc())
    
    # Paginate results
    messages = query.paginate(page=page, per_page=per_page)
    
    # Format response
    result = {
        'messages': [{
            'id': message.id,
            'sender_name': message.sender_name,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'risk_level': message.risk_level,
            'risk_score': message.risk_score,
            'is_read': message.is_read,
            'is_archived': message.is_archived,
            'is_flagged': message.is_flagged
        } for message in messages.items],
        'total': messages.total,
        'pages': messages.pages,
        'current_page': messages.page
    }
    
    return jsonify(result), 200

@messages_bp.route('/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Get a specific message by ID."""
    current_user_id = get_jwt_identity()
    
    message = Message.query.filter_by(id=message_id, user_id=current_user_id).first_or_404()
    
    # Mark as read if not already
    if not message.is_read:
        message.is_read = True
        db.session.commit()
    
    # Get responses for this message
    responses = [{
        'id': response.id,
        'content': response.content,
        'created_at': response.created_at.isoformat(),
        'is_auto_generated': response.is_auto_generated
    } for response in message.responses]
    
    result = {
        'id': message.id,
        'sender_name': message.sender_name,
        'content': message.content,
        'created_at': message.created_at.isoformat(),
        'risk_level': message.risk_level,
        'risk_score': message.risk_score,
        'is_read': message.is_read,
        'is_archived': message.is_archived,
        'is_flagged': message.is_flagged,
        'responses': responses
    }
    
    return jsonify(result), 200

@messages_bp.route('/', methods=['POST'])
@jwt_required()
def create_message():
    """
    Create a new message (for testing purposes).
    In production, messages would be imported from OnlyFans.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    if not data or 'sender_name' not in data or 'content' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new message
    message = Message(
        user_id=current_user_id,
        sender_name=data['sender_name'],
        content=data['content']
    )
    
    # Process message with filter
    message = message_filter.process_message(message)
    
    db.session.add(message)
    db.session.commit()
    
    # Check if message should be auto-responded
    if message_filter.should_auto_respond(message, user):
        # Generate auto-response
        response = response_generator.generate_response(message, user)
        db.session.add(response)
        db.session.commit()
        
        auto_response = {
            'id': response.id,
            'content': response.content,
            'created_at': response.created_at.isoformat(),
            'is_auto_generated': response.is_auto_generated
        }
    else:
        auto_response = None
    
    result = {
        'id': message.id,
        'sender_name': message.sender_name,
        'content': message.content,
        'created_at': message.created_at.isoformat(),
        'risk_level': message.risk_level,
        'risk_score': message.risk_score,
        'auto_response': auto_response
    }
    
    return jsonify(result), 201

@messages_bp.route('/<int:message_id>', methods=['PUT'])
@jwt_required()
def update_message(message_id):
    """Update message status (read, archived, flagged)."""
    current_user_id = get_jwt_identity()
    
    message = Message.query.filter_by(id=message_id, user_id=current_user_id).first_or_404()
    
    data = request.get_json()
    
    if 'is_read' in data:
        message.is_read = data['is_read']
    
    if 'is_archived' in data:
        message.is_archived = data['is_archived']
    
    if 'is_flagged' in data:
        message.is_flagged = data['is_flagged']
    
    db.session.commit()
    
    result = {
        'id': message.id,
        'is_read': message.is_read,
        'is_archived': message.is_archived,
        'is_flagged': message.is_flagged
    }
    
    return jsonify(result), 200

@messages_bp.route('/import', methods=['POST'])
@jwt_required()
def import_messages():
    """
    Import multiple messages at once (for testing purposes).
    In production, this would connect to OnlyFans API.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.get_json()
    
    if not data or 'messages' not in data or not isinstance(data['messages'], list):
        return jsonify({'error': 'Invalid data format'}), 400
    
    imported_messages = []
    auto_responses = []
    
    for msg_data in data['messages']:
        if 'sender_name' not in msg_data or 'content' not in msg_data:
            continue
        
        # Create new message
        message = Message(
            user_id=current_user_id,
            sender_name=msg_data['sender_name'],
            content=msg_data['content']
        )
        
        # Process message with filter
        message = message_filter.process_message(message)
        
        db.session.add(message)
        db.session.flush()  # Get ID without committing
        
        imported_messages.append({
            'id': message.id,
            'sender_name': message.sender_name,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'risk_level': message.risk_level,
            'risk_score': message.risk_score
        })
        
        # Check if message should be auto-responded
        if message_filter.should_auto_respond(message, user):
            # Generate auto-response
            response = response_generator.generate_response(message, user)
            db.session.add(response)
            
            auto_responses.append({
                'message_id': message.id,
                'response_id': response.id,
                'content': response.content
            })
    
    db.session.commit()
    
    result = {
        'imported_count': len(imported_messages),
        'auto_responded_count': len(auto_responses),
        'imported_messages': imported_messages,
        'auto_responses': auto_responses
    }
    
    return jsonify(result), 201
