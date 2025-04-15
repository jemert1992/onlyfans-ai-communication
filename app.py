import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Sample messages for demonstration
sample_messages = [
    {"id": 1, "content": "Hey, I really loved your latest photoshoot! The lighting was amazing.", "risk_level": "safe"},
    {"id": 2, "content": "Would you consider doing more beach content? Those are my favorites!", "risk_level": "low-risk"},
    {"id": 3, "content": "Can we meet up privately? I'll pay extra...", "risk_level": "high-risk"},
    {"id": 4, "content": "Just renewed my subscription. Your content is worth every penny!", "risk_level": "safe"},
    {"id": 5, "content": "Do you offer custom content? I have some ideas I'd like to discuss.", "risk_level": "low-risk"}
]

# Sample response styles
response_styles = {
    "professional": {
        "flirtiness": 3,
        "friendliness": 7,
        "formality": 8,
        "sample": "Thank you for your support! I appreciate your feedback on my content."
    },
    "casual": {
        "flirtiness": 5,
        "friendliness": 8,
        "formality": 4,
        "sample": "Thanks so much! 😊 I'm really happy you're enjoying my content!"
    },
    "flirty": {
        "flirtiness": 8,
        "friendliness": 7,
        "formality": 3,
        "sample": "Aww you're so sweet! 💕 I love knowing you enjoy my content... stay tuned for more soon! 😘"
    }
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/filter', methods=['POST'])
def filter_message():
    data = request.json
    message = data.get('message', '')
    
    # Simple filtering logic
    low_risk_words = ['custom', 'private', 'special', 'request', 'personal']
    high_risk_words = ['meet', 'hotel', 'address', 'location', 'phone', 'number', 'extra']
    
    risk_level = "safe"
    if any(word in message.lower() for word in low_risk_words):
        risk_level = "low-risk"
    if any(word in message.lower() for word in high_risk_words):
        risk_level = "high-risk"
        
    return jsonify({
        "message": message,
        "risk_level": risk_level
    })

@app.route('/api/generate-response', methods=['POST'])
def generate_response():
    data = request.json
    flirtiness = data.get('flirtiness', 5)
    friendliness = data.get('friendliness', 7)
    formality = data.get('formality', 4)
    
    response = ""
    if flirtiness >= 7 and friendliness >= 6:
        response = "Aww you're so sweet! 💕 I love knowing you enjoy my content... stay tuned for more soon! 😘"
    elif flirtiness >= 5 and friendliness >= 5:
        response = "Thanks so much! 😊 I'm really happy you're enjoying my content!"
    elif formality >= 7:
        response = "Thank you for your support! I appreciate your feedback on my content."
    else:
        response = "Thanks! Glad you're enjoying the content."
    
    return jsonify({
        "response": response
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
