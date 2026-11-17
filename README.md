# Portfolio Builder

A Portfolio Builder Platform that helps users create, customize, and showcase their professional portfolios in one place.

## About The Project

Portfolify is a web-based platform designed to help individuals build and manage their professional online presence without requiring advanced web development skills.

The platform aims to provide users with an easy way to present their personal information, skills, experience, and projects through a customizable portfolio.

## Features

### Authentication & Authorization

### Portfolio Management

### Profile Customization

### Projects Showcase

### Skills & Experience Management

### Portfolio Templates

### Public Portfolio Sharing

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
- MongoDB Compass
- Visual Studio Code

## Project Structure

```text
Portfolio-Builder/
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
git clone https://github.com/mostafa-tarek-khalil/Portfolio-Builder.git
```

### 2. Navigate to the Backend Directory

```bash
cd Portfolio-Builder/Backend
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