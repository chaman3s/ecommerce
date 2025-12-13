Full-Stack E-Commerce Application

A modern, full-stack E-commerce platform built using React, Node.js, GraphQL, and Cashfree Payment Gateway.
The application supports product browsing, cart management, secure checkout, and order tracking with a scalable GraphQL API.

🚀 Features
🛍️ Product listing & category filtering
🔍 Search functionality
🛒 Shopping cart management
👤 User authentication & authorization
📦 Order placement & tracking
💳 Secure payments using Cashfree
📱 Responsive UI (mobile & desktop)

🏗️ Tech Stack
Frontend
React
React Router
Apollo Client (GraphQL)
Tailwind CSS / Custom UI Components

Backend
Node.js
GraphQL (Apollo Server)
MongoDB (Mongoose)
Payment
Cashfree Payment Gateway
⚙️Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:
PORT=4000
MONGO_URI=your_mongodb_connection_string
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=TEST

Start the backend server:
npm run dev

GraphQL Playground:
http://localhost:4000/graphql

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

App runs at:
http://localhost:5173
