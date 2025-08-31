## McDonalds-Website-Clone 

 This project is a MERN stack McDonald’s website clone built to replicate the online food ordering experience. It allows users to browse the menu, add items to the cart, and place orders. The project demonstrates full-stack development using MongoDB, Express, React, and Node.js, with Mongoose as the ODM for database modeling.

Currently, the app supports login/signup, menu browsing, and cart/order placement. A payment gateway integration is planned for future updates.

# 🌍 Purpose & Vision

This project was built to practice end-to-end web development with MERN while replicating real-world food ordering workflows. The vision is to:

Build a fully functional restaurant website with a real-world use case.

Showcase authentication, data modeling, and state management in MERN.

Extend the project to include payment integration and order tracking.

Demonstrate scalability using modern web practices.

⚙️ Tech Stack

Frontend: React + Tailwind CSS (for responsive UI)

Backend: Node.js + Express.js

Database: MongoDB with Mongoose (for schema design & queries)

Authentication: JWT-based login & signup

Future Update: Integration with Razorpay/Stripe for secure online payments

# 🚀 Features

✅ User authentication (Signup/Login)
✅ Menu page with dynamic items (pulled from MongoDB)
✅ Add to Cart functionality
✅ Order placement simulation (stored in database)
✅ Responsive UI (optimized for desktop & mobile)
🟡 (Coming soon) Payment gateway integration (Stripe/Razorpay)
🟡 (Future) Admin dashboard for menu & order management

# 📸 Screenshots

![HomePage](./frontend/src/assets/homepage.png)
![login](./frontend/src/assets/login.png)
![Profile](./frontend/src/assets/profile.png)
![HappyMeal](./frontend/src/assets/happymeal.png)
![About](./frontend/src/assets/about.png)
![Cart](./frontend/src/assets/cart.png)
![Checkout](./frontend/src/assets/checkout.png)

# 🔄 How It Works

User signs up or logs in.

User browses the McDonald’s-style menu (data fetched from MongoDB).

Items can be added/removed from the cart.

User places an order → order stored in database.

(Future) Payment gateway processes the order securely.

User receives confirmation message.

# 🛠️ Getting Started
Clone the repo <br>
git clone https://github.com/ututkarsh22/MacDonalds-.git <br>
cd MacDonalds <br>

Backend Setup <br>
cd backend <br>
npm install <br>
npm start <br>

Frontend Setup <br>
cd frontend <br>
npm install <br>
npm run dev <br>

# Environment Variables

Create a .env file in the backend directory with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

# 📌 Future Improvements

🔐 Payment integration (Stripe/Razorpay)

📊 Admin panel for menu and orders

📱 Push notifications for order updates

🌐 Deployment on Vercel/Render + MongoDB Atlas
