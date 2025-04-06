# CRM Application

A Customer Relationship Management (CRM) application that enables telecallers to manage customer leads and allows administrators to oversee operations.

## Features

- Role-based authentication (Admin and Telecaller)
- JWT-based secure authentication
- Lead management (CRUD operations)
- Call status tracking
- Dashboard with statistics and charts
- Real-time validation and feedback

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for password hashing

### Frontend

- React
- Vite
- Material-UI
- React Router
- Chart.js
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crm-application
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Leads (Telecaller)

- GET /api/leads - Get all leads
- POST /api/leads - Create a new lead
- PATCH /api/leads/:id/address - Update lead address
- PATCH /api/leads/:id/status - Update lead status
- DELETE /api/leads/:id - Delete a lead

### Dashboard (Admin)

- GET /api/users/dashboard/stats - Get dashboard statistics
- GET /api/users/telecallers - Get all telecallers
- GET /api/users/telecallers/:id/activities - Get telecaller activities

## User Roles

### Admin

- Access to Dashboard
- View all telecallers and their activities
- View statistics and charts

### Telecaller

- Access to Telecaller Page
- Add, edit, delete, and update customer leads
- Update call status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
