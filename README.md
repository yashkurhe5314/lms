# MERN Stack LMS Portal

A modern Learning Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Student/Teacher roles)
- Course Management
- Content Delivery
- Assessment System
- Progress Tracking

## Project Structure

```
lms2/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - Redux Toolkit
  - React Router

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication 