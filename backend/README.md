# McDonald's Clone Backend API

## Overview
This is the backend API for the McDonald's Clone application. It provides endpoints for user authentication, menu management, cart operations, and order processing.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation
1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user details

### Menu
- `GET /api/menu` - Get all menu items (with optional filters)
- `GET /api/menu/:id` - Get a specific menu item
- `GET /api/menu/categories` - Get all menu categories
- `POST /api/menu` - Create a new menu item (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/summary` - Get cart summary for mini-cart display
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/add-multiple` - Add multiple items to cart
- `PUT /api/cart/update/:itemId` - Update item quantity
- `PUT /api/cart/update/:itemId/options` - Update item options
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/promo` - Apply promo code
- `DELETE /api/cart/promo` - Remove promo code
- `POST /api/cart/delivery-fee` - Set delivery fee
- `GET /api/cart/abandoned` - Get abandoned carts (admin only)
- `POST /api/cart/recover/:cartId` - Recover abandoned cart

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all user orders (with pagination and filters)
- `GET /api/orders/recent/:limit?` - Get user's recent orders
- `GET /api/orders/:id` - Get a specific order
- `PUT /api/orders/:id/cancel` - Cancel an order
- `POST /api/orders/reorder` - Reorder an existing order
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/delivery-time` - Update estimated delivery time (admin only)

## Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- phone: String
- address: String
- passwordUpdatedAt: Date
- createdAt: Date

### MenuItem
- name: String
- description: String
- price: Number
- image: String
- category: String
- isVegetarian: Boolean
- isAvailable: Boolean
- isPopular: Boolean
- options: Array of option groups

### Cart
- userId: ObjectId (ref: User)
- items: Array of cart items
- subtotal: Number
- tax: Number
- deliveryFee: Number
- discount: Number
- totalAmount: Number
- appliedPromoCode: String
- lastActivity: Date
- status: String (active, abandoned, converted)

### Order
- userId: ObjectId (ref: User)
- items: Array of order items
- subtotal: Number
- tax: Number
- deliveryFee: Number
- discount: Number
- totalAmount: Number
- orderType: String (Dine-In, Takeaway)
- paymentMethod: String (Card, UPI, Cash)
- paymentStatus: String (Pending, Paid, Failed, Refunded)
- status: String (Processing, Preparing, Ready, Completed, Delivered, Cancelled)
- statusHistory: Array of status changes
- estimatedDeliveryTime: Date
- customerNotes: String
- promoCodeUsed: String

## Scheduled Tasks
- Abandoned cart detection: Runs daily at midnight to mark carts as abandoned if they've been inactive for 24 hours