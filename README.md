# Freelance_Platform

A Freelance Marketplace Platform that connects clients with freelancers, allowing clients to post projects and freelancers to submit proposals, manage project progress, and build their professional reputation through ratings and reviews.

## About The Project

Freelance_Platform is a web-based marketplace designed to connect clients who need services with freelancers who can provide them.

The platform aims to simplify the freelancing process by providing tools for project publishing, proposal submission, project management, and professional reputation building.

## Features

### Authentication & Authorization

### User Profiles

### Project Management

### Proposals Management

### Search & Filtering

### Project Progress Tracking

### Ratings & Reviews

### Admin Dashboard

## Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Development Tools**
- Git & GitHub
- Postman
- MongoDB Atlas
- Visual Studio Code

## Project Structure

```text
Freelance_Platform/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── pages/
│
├── .gitignore
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mostafa-tarek-khalil/Freelance_Platform.git
```

### 2. Navigate to the Backend Directory

```bash
cd Freelance_Platform/Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `Backend` directory.

Add the required environment variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Replace the placeholder connection string with your own authorized MongoDB Atlas connection string.

**Important:** Never commit your `.env` file or expose database credentials publicly.

### 5. Run the Backend Server

```bash
node --watch server.js
```

The backend server will run locally on:

```text
http://localhost:3000
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB Atlas connection string |

## API Documentation

## Team Members

## License

This project was developed for educational purposes as part of a university Web Programming course.
