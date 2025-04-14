# FanAI - OnlyFans AI Communication System

## Deployment Guide

This document provides instructions for deploying the FanAI OnlyFans AI Communication System MVP to Heroku.

## Prerequisites

1. A Heroku account (sign up at [heroku.com](https://heroku.com) if you don't have one)
2. Heroku CLI installed on your computer (download from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli))
3. Git installed on your computer

## Deployment Steps

### 1. Login to Heroku

Open a terminal and run:

```bash
heroku login
```

Follow the prompts to log in to your Heroku account.

### 2. Create a new Heroku app

```bash
heroku create fanai-communication
```

This will create a new Heroku app named "fanai-communication" (you can choose a different name if you prefer).

### 3. Set up environment variables

Set the required environment variables for your app:

```bash
heroku config:set SECRET_KEY=your_secret_key
heroku config:set DATABASE_URL=your_database_url
```

For the MVP testing phase, you can use Heroku's free PostgreSQL database:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 4. Deploy the application

From the root directory of the project (the mvp folder), run:

```bash
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

### 5. Run database migrations

```bash
heroku run python -m backend.app.models.create_tables
```

### 6. Open the application

```bash
heroku open
```

This will open your deployed application in a web browser.

## Testing the Deployment

1. Register a new account using the registration form
2. Log in with your credentials
3. Navigate through the dashboard, messages, and style settings pages
4. Test the message filtering and response generation features

## Troubleshooting

If you encounter any issues during deployment, check the Heroku logs:

```bash
heroku logs --tail
```

## Next Steps

After successful deployment and testing:

1. Share the application URL with your OnlyFans creator friends for testing
2. Collect feedback on the user experience and functionality
3. Plan for improvements based on feedback
4. Consider upgrading to a paid Heroku plan for production use

## Support

If you need assistance with deployment or have questions about the application, please contact your development team.
