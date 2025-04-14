# FanAI - OnlyFans AI Communication System

## Overview

FanAI is an AI-powered communication system designed specifically for OnlyFans creators to manage their DMs more efficiently. The system replaces traditional agencies (which charge 20% commission) with an intelligent platform that filters inappropriate messages, generates customized responses, and maintains the creator's authentic voice.

## Features

### Message Filtering
- Automatically detects and categorizes messages by risk level (safe, low-risk, high-risk)
- Filters out inappropriate content before it reaches the creator
- Provides analytics on message types and volumes

### Response Generation
- Creates personalized responses that match the creator's communication style
- Adjustable parameters for flirtiness, friendliness, and formality
- Learns from the creator's previous messages to maintain authenticity

### User Interface
- Dashboard with message statistics and activity overview
- Inbox interface for viewing and managing messages
- Style customization controls for personalizing responses
- Settings for managing automation preferences

## Technical Architecture

### Backend
- Flask application with RESTful API endpoints
- SQLAlchemy ORM for database interactions
- Message filtering service using AI content moderation
- Response generation service with style customization
- User authentication and authorization

### Frontend
- React application with Material-UI components
- Responsive design for desktop and mobile use
- Real-time message updates and notifications
- Style customization interface

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm 8+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fanai-communication.git
cd fanai-communication
```

2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```

3. Set up the frontend
```bash
cd frontend
npm install
npm start
```

4. Access the application
Open your browser and navigate to `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying the application to Heroku.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For support or inquiries, please contact the development team.
