# Simplified Heroku Deployment Guide

This guide provides step-by-step instructions for deploying the OnlyFans AI Communication System to Heroku.

## Prerequisites

1. A GitHub account with the code repository set up (see GITHUB_SETUP.md)
2. A Heroku account (sign up at [heroku.com](https://heroku.com) if you don't have one)

## Step 1: Create a New Heroku App

1. Log in to your Heroku Dashboard at [dashboard.heroku.com](https://dashboard.heroku.com)
2. Click the "New" button in the top right corner
3. Select "Create new app"
4. Enter an app name (e.g., "fanai-communication")
5. Click "Create app"

## Step 2: Connect to GitHub

1. In your app's dashboard, go to the "Deploy" tab
2. In the "Deployment method" section, select "GitHub"
3. Connect your Heroku account to your GitHub account if prompted
4. Search for your repository name ("onlyfans-ai-communication")
5. Click "Connect" next to your repository

## Step 3: Configure Environment Variables

1. Go to the "Settings" tab
2. Click "Reveal Config Vars"
3. Add the following variables:
   - KEY: `SECRET_KEY`, VALUE: `8f42a73d5b4f1c7e9a6b2c3d4e5f6g7h`
   - KEY: `FLASK_ENV`, VALUE: `production`

## Step 4: Add Buildpacks

1. Still in the "Settings" tab, scroll down to "Buildpacks"
2. Click "Add buildpack"
3. Select "nodejs" and click "Save changes"
4. Click "Add buildpack" again
5. Select "python" and click "Save changes"
6. Make sure nodejs is listed first, followed by python

## Step 5: Add a Database

1. Go to the "Resources" tab
2. In the "Add-ons" search box, type "Heroku Postgres"
3. Select "Heroku Postgres" from the dropdown
4. Select the "Hobby Dev - Free" plan
5. Click "Submit Order Form"

## Step 6: Deploy Your App

1. Go back to the "Deploy" tab
2. Scroll down to "Manual deploy" section
3. Make sure the "main" branch is selected
4. Click "Deploy Branch"
5. Wait for the deployment to complete (this may take 5-10 minutes)

## Step 7: Open Your App

1. Once deployment is complete, click "View" to open your application
2. You should see the login page for your OnlyFans AI communication system
3. Create an account and start testing the system

## Troubleshooting

If you encounter any issues during deployment:
1. Check the Heroku logs by clicking "More" > "View logs" in the top right
2. Ensure all environment variables are set correctly
3. Make sure both buildpacks (nodejs and python) are added in the correct order
4. If database errors occur, make sure Heroku Postgres was added successfully
