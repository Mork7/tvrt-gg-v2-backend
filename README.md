# TVRT Gaming Backend Application

This is the backend server for the TVRT Gaming application, which supports user authentication, friends tracking, and data retrieval for the frontend.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features

- **User Authentication**: Securely manage user accounts and logins.
- **Friends Tracking**: Allow users to follow their friends' progress.
- **Data Retrieval**: Provide endpoints for fetching summoner stats and live Twitch streams.
- **CORS**: Enable cross-origin requests to allow frontend communication.

## Usage

1. **User Registration**:

   - Send a POST requests with the user's email and password to create a new account. Passwords are hashed and secured with the help of the bcrypt library; not even administration has access to your plain text passwords.

2. **User Login**:

   - Send a POST requests with the user's email and password to log in and receive a JWT token, token will be saved in cookies for session.

3. **Fetch Summoner Stats**:

   - Send a GET requests to retreive summoner information to be displayed.

4. **Admin Functions**:
   - Admin routes to find, edit and delete user accounts.

## Technologies Used

- **Bcrypt**: For hashing passwords.
- **CORS**: For enabling cross-origin requests.
- **Express**: For building the server and API endpoints.
- **MongoDB & Mongoose**: For database management and object data modeling.
- **JsonWebToken**: For authentication and secure data exchange.
