# 🚀 Bybu Backend – Express API (TypeScript)

This is the backend architecture for the **Bybu Platform**, built with **Node.js + TypeScript + Express**, structured using **modular, domain-driven principles** for scalability, testing, and developer efficiency.

---

## 📦 Tech Stack

- **Node.js** with Express
- **TypeScript**
- **JWT + Bcrypt** for security
- **Nodemailer + Axios** for notifications
- **Socket.IO-ready** setup
- **Jest** for unit testing

---

## 🗂️ Project Structure

### `/src`

The root of all source code, split into **features** and **shared resources**.

---

### `features/api/user/`

Feature-oriented domain structure for `user` and its submodules:

features/
└── api/
└── user/
├── user.routes.ts # Main user route entry
├── personal/
│ ├── personal.routes.ts
│ ├── profile/
│ │ ├── profile.controller.ts
│ │ ├── profile.routes.ts
│ │ └── profile.service.ts
│ └── wallet/ # (Reserved for wallet logic)
└── routes.ts # Aggregator for all user-related routes

> Each feature (e.g. `profile`) has:
>
> - `controller` → Handles HTTP & request lifecycle
> - `service` → Business logic
> - `routes` → HTTP route definitions

---

### `shared/`

Global logic reusable across the entire application.

shared/
├── data/
│ ├── models/ # DB models (e.g., User, Wallet)
│ └── repositories/
│       ├── encryption/ # Token & password logic
│       ├── notification/ # Email and webhook handler
│       └── socket/ # Socket connection interface

---

## 📌 Developer Workflow

### Feature Flow

Route → Controller → Service → Repository → Model

- **Routes** expose endpoints
- **Controllers** validate and forward requests
- **Services** encapsulate business logic
- **Repositories** handle database, encryption, sockets, etc.
- **Models** define schema/entities

---

## ✅ Example

### Creating a new feature: `KYC`

features/
└── api/
    └── user/
    └── personal/
    └── kyc/
        ├── kyc.routes.ts
        ├── kyc.controller.ts
        └── kyc.service.ts

Then register it in `routes.ts` for `user`.

---

## 🧪 Testing

Jest is used for unit testing. All repositories and services are mockable.

```bash
npm run test

## 🔐 Environment Variables
.env file setup:

ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
ADMIN_ACCESS_TOKEN_SECRET=...
WEB_TOKEN_SECRET=...
API_ACCESS_TOKEN=...
EMAIL_USER=you@gmail.com
EMAIL_PASS=your-password

🛠️ Scripts
Command Description
npm run dev Run app in development mode (ts-node)
npm run build Transpile TypeScript to JS
npm run start Run production build from /dist
npm run test Run all unit tests with Jest

✨ Design Principles
Modular: Easy to scale horizontally with new domains.

Separation of Concerns: Each layer does one job well.

Testable: Everything is injectable and mockable.

Real-time Ready: Plug in socket logic in seconds.

Security First: Tokens, passwords, secrets handled with care.

👨‍💻 Contributors
Jude Classic – CTO @ Bybu
