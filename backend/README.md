# 🏠 Real Estate Management Platform

A production-ready RESTful API backend for managing real estate properties, users, and visit bookings — built with Node.js, Express.js, and MongoDB.

---

## 🚀 Features

- **JWT Authentication** — Secure login/register with token-based auth
- **Role-Based Access Control (RBAC)** — Three roles: `buyer`, `seller`, `admin`
- **Property Listings** — Full CRUD for properties with advanced filters
- **Visit Booking System** — Buyers can request visits, sellers can confirm/cancel
- **Pagination & Search** — Filter by city, type, price range, bedrooms
- **Soft Delete** — Properties and users are deactivated, not permanently deleted
- **Input Validation** — All endpoints validated using `express-validator`
- **Secure Coding** — Passwords hashed with bcryptjs, protected routes, ownership checks

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Logging | Morgan |
| Dev Tools | Nodemon, Jest, Supertest |

---

## 📁 Project Structure

```
real-estate-management-platform/
│
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get profile
│   │   ├── propertyController.js  # Property CRUD + filters
│   │   ├── bookingController.js   # Visit booking system
│   │   └── userController.js      # User management
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + RBAC authorize
│   ├── models/
│   │   ├── User.js                # User schema with password hashing
│   │   ├── Property.js            # Property schema with indexes
│   │   └── Booking.js             # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── userRoutes.js
│   └── server.js                  # App entry point
│
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/raiprashantmittal/real-estate-management-platform.git
cd real-estate-management-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your MONGO_URI and JWT_SECRET

# Start development server
npm run dev
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get token |
| GET | `/api/auth/me` | Private | Get logged-in user profile |

### Properties
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | Get all properties (with filters) |
| GET | `/api/properties/:id` | Public | Get single property |
| POST | `/api/properties` | Seller/Admin | Create a new listing |
| PUT | `/api/properties/:id` | Seller/Admin | Update property |
| DELETE | `/api/properties/:id` | Seller/Admin | Soft delete property |
| GET | `/api/properties/my-listings` | Seller | Get own listings |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Buyer | Request a property visit |
| GET | `/api/bookings` | Private | Get my bookings |
| PUT | `/api/bookings/:id/status` | Private | Update booking status |

### Users (Admin)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all users |
| PUT | `/api/users/profile` | Private | Update own profile |
| DELETE | `/api/users/:id` | Admin | Deactivate a user |

---

## 🔍 Query Filters for Properties

```
GET /api/properties?city=Indore&type=apartment&listingType=rent&minPrice=5000&maxPrice=20000&bedrooms=2&page=1&limit=10
```

---

## 🔐 Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 🔒 Role Permissions

| Action | Buyer | Seller | Admin |
|---|---|---|---|
| View properties | ✅ | ✅ | ✅ |
| Create property listing | ❌ | ✅ | ✅ |
| Request property visit | ✅ | ❌ | ✅ |
| Confirm/cancel booking | ❌ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |

---

## 👨‍💻 Author

**Prashant Kumar Rai**
B.Tech (CS) | M.Tech Computer Engineering — SGSITS Indore
[LinkedIn](https://www.linkedin.com/in/prashantkumarrai8788) • [GitHub](https://github.com/raiprashantmittal)
