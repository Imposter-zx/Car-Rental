# 🚗 Gamil Rent Car - Premium Car Rental Platform

A modern, high-conversion car rental platform built with **React**, **Node.js**, and **MongoDB**. Designed for luxury car rental businesses in Casablanca, Morocco.

![Car Rental Preview](https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

### 💎 Premium Frontend (React)

- **Luxury Dark UI**: Elegant design with crimson red accents and glassmorphism.
- **Dynamic Fleet Display**: Real-time car availability fetching from the backend.
- **Advanced Filtering**: Filter by category, transmission, and price with pulsing skeleton loaders.
- **Interactive Car Details**: Sticky booking cards, detailed specs, and dynamic availability badges.
- **Micro-Animations**: Framer Motion scroll reveals, hover effects, and counter animations.
- **Mobile Optimized**: Floating action buttons for instant Call or WhatsApp contact.

### 🛡️ Robust Backend (Node.js & Express)

- **REST API**: Clean endpoints for car management and booking processing.
- **MongoDB Integration**: Scalable database for fleet and reservation storage.
- **JWT Authentication**: Secure admin access protection.
- **Automated Workflows**: Booking confirmations automatically update car availability.
- **Smart Messaging**: Generates rich WhatsApp message templates for customers.

### 👨‍💼 Admin Dashboard

- **Fleet Management**: CRUD operations (Add, Edit, Delete) for your vehicles.
- **Booking Hub**: Track all customer requests (Pending, Confirmed, Cancelled).
- **Session Control**: Secure login/logout flow with persistent session storage.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Security**: JWT (JSON Web Tokens), Bcrypt.js.
- **Build Tool**: Vite.

---

## 🛠️ Installation & Setup

### 1. Prerequisite

- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 2. Clone the Repository

```bash
git clone https://github.com/Imposter-zx/Car-Rental.git
cd Car-Rental
```

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@gamil.ma
ADMIN_PASSWORD=admin123
```

### 4. Initialize Database (Seed)

```bash
npm run seed
```

### 5. Start the Application

**Terminal 1 (Backend):**

```bash
cd server
npm start
```

**Terminal 2 (Frontend):**

```bash
npm install
npm run dev
```

---

## 📖 Usage

- **User**: Browse cars, apply filters, and request bookings via the interactive modal.
- **Admin**: Go to `/login` and use the credentials defined in your `.env` to access the management dashboard.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contact

**Imposter-zx** - [GitHub](https://github.com/Imposter-zx)

_Gamil Rent Car - Driving the future of rental management._
