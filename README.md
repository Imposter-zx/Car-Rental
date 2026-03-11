# 🚗 Gamil Rent Car - Premium Car Rental Platform

A modern, high-conversion car rental platform built with **React**, **Vite**, and **Supabase**. Designed for luxury car rental businesses with real-time management and a high-performance frontend.

![Car Rental Preview](https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

### 💎 Premium Frontend
- **Luxury Dark UI**: Elegant design with crimson red accents and glassmorphism.
- **Dynamic Fleet Display**: Real-time car availability syncing with Supabase.
- **Advanced Filtering**: Filter by category, transmission, and fuel type with pulsing skeleton loaders.
- **Interactive Car Details**: Sticky booking cards, detailed specs, and dynamic availability badges.
- **Micro-Animations**: Framer Motion scroll reveals, hover effects, and counter animations.
- **Mobile Optimized**: Responsive design optimized for high customer conversion.

### 🛡️ Secure Backend & Security
- **Supabase Integration**: Unified backend for database (PostgreSQL), Auth, and Storage.
- **Secure Authentication**: Built-in Supabase Auth with protected admin routes.
- **Real-time Updates**: Live fleet status changes via Postgres changes notifications.
- **Security Hardened**: High-grade security headers (CSP, HSTS, X-Frame-Options) configured for Vercel.
- **Storage**: Optimized image hosting via Supabase Buckets.

### 👨‍💼 Admin Dashboard
- **Fleet Management**: Full CRUD operations for vehicles with real-time local state updates.
- **Live Statistics**: Real-time business metrics dashboard (Total cars, Available cars, Estimated revenue).
- **Booking Management**: Streamlined workflow for tracking customer rental requests.

---

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Backend/Database**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime).
- **Deployment**: [Vercel](https://vercel.com/).
- **Security**: Content Security Policy (CSP), Row Level Security (RLS), HSTS.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Imposter-zx/Car-Rental.git
cd Car-Rental
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🛡️ Security Configuration
The project is configured for Vercel with strict security headers in `vercel.json`. The Content Security Policy (CSP) is optimized to support Supabase's APIs and WebSocket connections while preventing XSS and clickjacking.

---

## 📄 License
Distributed under the MIT License.

---

## 🤝 Contact
**Imposter-zx** - [GitHub](https://github.com/Imposter-zx)

_Gamil Rent Car - Driving the future of rental management._
