#🍔 McDonald’s Clone Web Application 

Live Demo: https://petv-88-g8qr.vercel.app/

Table of Contents

Project Overview

Features

Screenshots

Technologies Used

Backend API Routes

Installation

Usage

Challenges Faced

Future Improvements

Contact

Project Overview

This project is a full-stack McDonald’s web application clone built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

It allows users to:

Register/Login securely

View the menu with dynamic items

Add items to cart (payment option excluded)

Manage their account

The backend is hosted on Render and connected to MongoDB Atlas, while the frontend is deployed on Vercel.

This project demonstrates full-stack development, JWT authentication, responsive UI, and frontend-backend integration.

Features

User Authentication: Register & login securely with JWT

Menu Display: View menu items dynamically from backend

Add to Cart: Manage items in cart

Responsive Design: Works on desktop and mobile

Search & Filter: Find menu items easily

Secure Backend: MongoDB Atlas + Express.js + JWT

Note: Payment gateway is not integrated in this version.

Screenshots
Home Page

Menu Page

Signup Page

Cart Page

(Replace these with your actual screenshots.)

Technologies Used
Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JSON Web Token (JWT)

Bcrypt.js

CORS & dotenv

Frontend

React.js

React Router DOM

Axios

Bootstrap / CSS

Framer Motion

React Hooks (useState, useEffect)

Backend API Routes
Authentication
Route	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Login and get JWT token
Menu / Cart
Route	Method	Description
/api/menu	GET	Get all menu items
/api/cart	GET	Get current user’s cart
/api/cart	POST	Add item to cart
/api/cart/:id	PUT	Update cart item quantity
/api/cart/:id	DELETE	Remove item from cart

Protected routes require JWT token in request headers.

Installation

Clone the repository:

git clone https://github.com/your-username/mcdonalds-clone.git
cd mcdonalds-clone


Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd ../frontend
npm install


Create .env file in backend:

MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Usage

Start backend:

cd backend
npm start


Start frontend:

cd frontend
npm start


Open http://localhost:3000 and explore the app.

Challenges Faced

Handling JWT authentication and protecting routes

Resolving CORS issues between frontend and backend

Linking MongoDB Atlas collections with user data

Implementing responsive UI across devices

Debugging form submission and API integration

Future Improvements

Profile Management: Update account info

Pagination & Sorting: For large menus

Dark Mode Toggle

Order History / Reading Progress Tracker

Offline Support (PWA)

Contact

GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile
